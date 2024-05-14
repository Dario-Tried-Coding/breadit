import { PostVote_Skeleton } from '@/components/post/post-vote/PostVote.client'
import PostVote from '@/components/post/post-vote/PostVote.server'
import { Locale } from '@/config/i18n.config'
import { edjsParser } from '@/lib/editor-js/parser'
import { constructCachedPost } from '@/lib/helpers/cached-post'
import { getAuthSession } from '@/lib/next-auth/cache'
import { redirect } from '@/lib/next-intl/navigation'
import { db } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { CachedPost } from '@/types/utils/redis'
import { OutputData } from '@editorjs/editorjs'
import { Interweave } from 'interweave'
import { FC, Suspense } from 'react'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
    postId: string
  }
}

const page: FC<pageProps> = async ({ params: { locale, subredditName, postId } }) => {
  const session = await getAuthSession()

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost | null
  let post: CachedPost | null = cachedPost ?? null

  if (!post) {
    const dbPost = await db.post.findUnique({ where: { id: postId }, include: { author: true, votes: true } })
    if (!dbPost) return redirect(`/r/${subredditName}`)

    post = constructCachedPost(dbPost)

    const votesAmt = post.votesAmt
    if (votesAmt > 0) await redis.hset(`post:${postId}`, post)
  } else {
    if (post.votesAmt <= 0) await redis.del(`post:${postId}`)
  }

  const getUserVote = async () =>
    session?.user?.id ? (await db.postVote.findUnique({ where: { postId_userId: { postId, userId: session.user.id } } }))?.vote : null

  return (
    <div className='flex flex-col items-center justify-between sm:flex-row sm:items-start sm:gap-4'>
      <Suspense fallback={<PostVote_Skeleton />}>
        <PostVote postId={postId} initialVotesAmt={post.votesAmt} {...{ getUserVote }} />
      </Suspense>
      <div className='self-stretch rounded-sm bg-card p-4 sm:flex-1 sm:self-start'>
        <Interweave content={post.content} />
      </div>
    </div>
  )
}

export default page
