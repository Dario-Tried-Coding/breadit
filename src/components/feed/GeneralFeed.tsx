import Feed from '@/components/feed/Feed'
import { Locale } from '@/config/i18n.config'
import { getFeedPosts } from '@/lib/helpers/models/posts'
import { cn } from '@/lib/utils'
import { getLocale } from 'next-intl/server'
import { FC, HTMLAttributes } from 'react'

interface GeneralFeedProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {}

const GeneralFeed: FC<GeneralFeedProps> = async ({ className, ...rest }) => {
  const locale = (await getLocale()) as Locale
  const { posts, nextPost } = await getFeedPosts(locale)

  return <Feed initialPosts={{ posts, nextPost }} className={cn('', className)} {...rest} />
}

export default GeneralFeed
