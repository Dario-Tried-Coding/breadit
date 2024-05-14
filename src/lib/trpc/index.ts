import { db } from '@/lib/prisma'
import { authRouter } from '@/lib/trpc/routers/auth-router'
import { postCreationValidator } from '@/lib/validators/post'
import { subredditCreationValidator, subredditJoiningLeavingValidator } from '@/lib/validators/subreddit'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'
import { privateProcedure, router } from './init'

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
    const t = await getTranslations({ locale, namespace: 'Index' })

    const subreddit = await db.subreddit.findUnique({ where: { id: subredditId }, include: { subscribers: true } })
    if (!subreddit) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subreddit not found' })

    const isOwner = subreddit.creatorId === userId
    const isSubscribed = subreddit.subscribers.find((u) => u.id === userId)
    if (!isSubscribed && !isOwner) throw new TRPCError({ code: 'FORBIDDEN', message: 'You must be subscribed to post' })

    const post = await db.post.create({ data: { title, content, subredditId, authorId: userId } })
    return post.id
  }),
})

export type AppRouter = typeof appRouter
