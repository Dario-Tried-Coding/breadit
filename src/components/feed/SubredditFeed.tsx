import Feed from '@/components/feed/Feed'
import { getFeedPosts } from '@/lib/helpers/models/posts'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes } from 'react'

interface SubredditFeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  subredditName: string
}

const SubredditFeed: FC<SubredditFeedProps> = async ({ subredditName, className, ...rest }) => {
  const { posts, nextPost } = await getFeedPosts({ subredditName })

  return <Feed initialPosts={{ posts, nextPost }} subredditName={subredditName} className={cn('', className)} {...rest} />
}

export default SubredditFeed
