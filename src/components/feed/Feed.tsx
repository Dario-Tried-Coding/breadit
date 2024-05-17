'use client'

import { DEFAULT_INFINITE_QUERY_LIMIT } from '@/config'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { Post } from '@prisma/client'
import { FC, HTMLAttributes } from 'react'

interface FeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  subredditName?: string | null
  initialPosts?: {
    posts: Post[]
    nextPost?: Post
  }
}

const Feed: FC<FeedProps> = ({ subredditName, initialPosts, className, ...rest }) => {
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
                nextCursor: initialPosts.nextPost?.id
              },
            ],
            pageParams: [null],
          }
        : undefined,
    }
    )
  
  // console.log(postsPages)

  const posts = postsPages?.pages.flatMap((p) => p.posts)
  if (posts?.length === 0) return <div>empty</div>

  return (
    <div className={cn('', className)} {...rest}>
      {posts?.map(({ id, title, content, subredditId }) => (
        <div key={id}>
          <pre>{JSON.stringify({ id, title, content, subredditId }, null, 2)}</pre>
        </div>
      ))}
      {isFetchingNextPage && <div>loading...</div>}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </div>
  )
}

export default Feed
