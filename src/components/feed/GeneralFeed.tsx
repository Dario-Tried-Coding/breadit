import Feed from '@/components/feed/Feed'
import { getFeedPosts } from '@/lib/helpers/models/posts'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes } from 'react'

interface GeneralFeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

const GeneralFeed: FC<GeneralFeedProps> = async ({ className, ...rest }) => {
  const { posts, nextPost } = await getFeedPosts()

  return <Feed initialPosts={{posts, nextPost}} className={cn('', className)} {...rest} />
}

export default GeneralFeed
