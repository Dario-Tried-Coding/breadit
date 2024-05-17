import { isUserPartOfSubreddit } from '@/lib/helpers/models/users'
import { db } from '@/lib/prisma'
import { authRouter } from '@/lib/trpc/routers/auth-router'
import { commentCreationValidator, commentVotingValidator } from '@/lib/validators/comment'
import { postCreationValidator, postVotingValidator } from '@/lib/validators/post'
import { subredditCreationValidator, subredditJoiningLeavingValidator } from '@/lib/validators/subreddit'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'
import { privateProcedure, publicProcedure, router } from './init'
import { redis } from '@/lib/redis'
import { infiniteFeedValidator } from '@/lib/validators/feed'
import { DEFAULT_INFINITE_QUERY_LIMIT } from '@/config'
import { auth } from '@/lib/next-auth'
import { getFeedPosts } from '@/lib/helpers/models/posts'

export const appRouter = router({
  authRouter,
  createSubreddit: privateProcedure.input(subredditCreationValidator).mutation(async ({ ctx: { locale, userId: creatorId }, input: { name } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.r.Create.Server' })
    const existingSubreddit = await db.subreddit.findFirst({ where: { name } })

    if (existingSubreddit) throw new TRPCError({ code: 'CONFLICT', message: t('Errors.subreddit-already-exists') })

    const subreddit = await db.subreddit.create({ data: { name, creatorId } })
    return subreddit.name
  }),
  joinLeaveSubreddit: privateProcedure
    .input(subredditJoiningLeavingValidator)
    .mutation(async ({ ctx: { locale, userId }, input: { subredditId } }) => {
      const t = await getTranslations({ locale, namespace: 'Components.JoinLeaveBtn' })

      const subreddit = await db.subreddit.findUnique({ where: { id: subredditId }, include: { subscribers: true } })
      if (!subreddit) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.not-found') })

      const isCreator = subreddit.creatorId === userId
      if (isCreator) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.creator-cannot-join-leave') })

      const isSubscribed = subreddit.subscribers.find((u) => u.id === userId)
      if (isSubscribed) {
        await db.user.update({
          where: { id: userId },
          data: {
            subscribedSubreddits: {
              disconnect: { id: subredditId },
            },
          },
        })
        return 'UNSUBSCRIBED' as const
      }

      await db.user.update({
        where: { id: userId },
        data: {
          subscribedSubreddits: {
            connect: { id: subredditId },
          },
        },
      })
      return 'SUBSCRIBED' as const
    }),
  publishPost: privateProcedure.input(postCreationValidator).mutation(async ({ ctx: { locale, userId }, input: { title, content, subredditId } }) => {
    const t = await getTranslations({ locale, namespace: 'Components.Editor.Server' })

    const subreddit = await db.subreddit.findUnique({ where: { id: subredditId }, include: { subscribers: true } })
    if (!subreddit) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.subreddit-not-found') })

    const isPartOfSubreddit = await isUserPartOfSubreddit({ userId, subredditId: subreddit.id })
    if (!isPartOfSubreddit) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.forbidden') })

    const post = await db.post.create({ data: { title, content, subredditId, authorId: userId } })
    return post.id
  }),
  votePost: privateProcedure.input(postVotingValidator).mutation(async ({ ctx: { locale, userId }, input: { postId, voteType } }) => {
    const t = await getTranslations({ locale, namespace: 'Components.PostVote.Server' })

    const post = await db.post.findUnique({ where: { id: postId }, include: { votes: true, author: true } })
    if (!post) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.post-not-found') })

    const postVote = await db.postVote.findUnique({ where: { postId_userId: { postId, userId } } })

    const cachedPostVotesAmt = await redis.hget<number | null>(`post:${postId}`, 'votesAmt')

    if (voteType === null) {
      if (!postVote) throw new TRPCError({ code: 'BAD_REQUEST', message: t('Errors.vote-to-delete-not-found') })

      const deletedVote = await db.postVote.delete({ where: { postId_userId: { postId, userId } } })
      if (cachedPostVotesAmt !== null) await redis.hincrby(`post:${postId}`, 'votesAmt', deletedVote.vote === 'UP' ? -1 : 1)
      return 'DELETED' as const
    }

    if (!postVote) {
      const createdVote = await db.postVote.create({ data: { postId, userId, vote: voteType } })
      if (cachedPostVotesAmt !== null) await redis.hincrby(`post:${postId}`, 'votesAmt', createdVote.vote === 'UP' ? 1 : -1)
      return 'CREATED' as const
    }

    const updatedVote = await db.postVote.update({ where: { postId_userId: { postId, userId } }, data: { vote: voteType } })
    if (cachedPostVotesAmt !== null) await redis.hincrby(`post:${postId}`, 'votesAmt', updatedVote.vote === 'UP' ? 2 : -2)
    return 'UPDATED' as const
  }),
  voteComment: privateProcedure.input(commentVotingValidator).mutation(async ({ ctx: { locale, userId }, input: { commentId, voteType } }) => {
    const t = await getTranslations({ locale, namespace: 'Components.CommentVote.Server' })

    const comment = await db.comment.findUnique({ where: { id: commentId } })
    if (!comment) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.comment-not-found') })

    const post = await db.post.findUnique({ where: { id: comment.postId } })
    if (!post) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.post-not-found') })

    const isPartOfSubreddit = await isUserPartOfSubreddit({ userId, subredditId: post.subredditId })
    if (!isPartOfSubreddit) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.must-be-part-of-subreddit') })

    const commentVote = await db.commentVote.findUnique({ where: { commentId_userId: { commentId, userId } } })

    if (voteType === null) {
      if (!commentVote) throw new TRPCError({ code: 'BAD_REQUEST', message: t('Errors.comment-to-delete-not-found') })

      await db.commentVote.delete({ where: { commentId_userId: { commentId: commentVote.commentId, userId: commentVote.userId } } })
      return 'DELETED' as const
    }

    if (!commentVote) {
      await db.commentVote.create({ data: { commentId, userId, vote: voteType } })
      return 'CREATED' as const
    }

    await db.commentVote.update({ where: { commentId_userId: { commentId, userId } }, data: { vote: voteType } })
    return 'UPDATED' as const
  }),
  createComment: privateProcedure
    .input(commentCreationValidator)
    .mutation(async ({ ctx: { locale, userId }, input: { postId, replyToId, content } }) => {
      const t = await getTranslations({ locale, namespace: 'Components' })

      const post = await db.post.findUnique({ where: { id: postId } })
      if (!post) throw new TRPCError({ code: 'NOT_FOUND', message: 'The post with the specified ID was not found.' })

      const isPartOfSubreddit = await isUserPartOfSubreddit({ userId, subredditId: post.subredditId })
      if (!isPartOfSubreddit) throw new TRPCError({ code: 'FORBIDDEN', message: 'You need to be subscribed to the subreddit in order to comment' })

      let replyingToComment: Comment | null = null
      if (replyToId) {
        replyingToComment = (await db.comment.findUnique({ where: { id: replyToId } })) as Comment | null
        if (!replyingToComment) throw new TRPCError({ code: 'NOT_FOUND', message: 'The comment with the specified ID was not found.' })
      }

      await db.comment.create({ data: { authorId: userId, content, postId, replyToId } })
      return 'CREATED' as const
    }),
  getPosts: publicProcedure.input(infiniteFeedValidator).query(async ({ ctx: { locale }, input: { cursor, limit, subredditName } }) => {
    const t = await getTranslations({ locale, namespace: 'Index' })

    const { posts, nextPost } = await getFeedPosts({ subredditName }, { limit, cursor })

    let nextCursor: typeof cursor | null = null
    nextCursor = nextPost?.id

    return { posts, nextCursor }
  }),
})

export type AppRouter = typeof appRouter
