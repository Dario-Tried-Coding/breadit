import Feed from '@/components/feed/Feed'
import { Locale } from '@/config/i18n.config'
import { getFeedPosts } from '@/lib/helpers/models/posts'
import { cn } from '@/lib/utils'
import { getLocale } from 'next-intl/server'
import { FC, HTMLAttributes } from 'react'

interface SubredditFeedProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  subredditName: string
}

const SubredditFeed: FC<SubredditFeedProps> = async ({ subredditName, className, ...rest }) => {
  const locale = (await getLocale()) as Locale
  const { posts, nextPost } = await getFeedPosts(locale, { subredditName })

  return <Feed initialPosts={{ posts, nextPost }} subredditName={subredditName} className={cn('', className)} {...rest} />
}

export default SubredditFeed
