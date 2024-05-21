'use client'

import Post from '@/components/post/Post'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { ExtendedFeedPost } from '@/types/utils/feed'
import { useIntersection } from '@mantine/hooks'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { FC, HTMLAttributes, useEffect } from 'react'

interface FeedProps extends HTMLAttributes<HTMLUListElement> {
  subredditName?: string | null
  initialPosts?: {
    posts: ExtendedFeedPost[]
    nextPost?: ExtendedFeedPost
  }
}

const Feed: FC<FeedProps> = ({ subredditName, initialPosts, className, children, ...rest }) => {
  const { data: session } = useSession()
  const { ref, entry } = useIntersection<HTMLLIElement>()

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry])

  const {
    data: postsPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.getPosts.useInfiniteQuery(
    {
      subredditName,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: initialPosts
        ? {
            pages: [
              {
                posts: initialPosts.posts,
                nextCursor: initialPosts.nextPost?.id,
              },
            ],
            pageParams: [null],
          }
        : undefined,
    }
    )
  
  const posts = postsPages?.pages.flatMap((p) => p.posts)
  if (posts?.length === 0) return null

  return (
    <ul className={cn('flex flex-col gap-4', className)} {...rest}>
      {children}
      {posts?.map((p) => {
        const votesAmt = p.votes.reduce((acc, vote) => acc + (vote.vote === 'UP' ? 1 : -1), 0)
        const voteType = session?.user ? p.votes.find((v) => v.userId === session.user?.id)?.vote ?? null : undefined
        return <Post key={p.id} postRef={ref} post={p} subredditName={p.subreddit.name} votesAmt={votesAmt} voteType={voteType} />
      })}
      {isFetchingNextPage && (
        <li>
          <Loader2 className='m-auto animate-spin' />
        </li>
      )}
    </ul>
  )
}

export default Feed
