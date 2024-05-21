import SubredditFeed from '@/components/feed/SubredditFeed'
import { Locale } from '@/config/i18n.config'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
  }
}

const page: FC<pageProps> = async ({ params: { subredditName } }) => {
  return <SubredditFeed subredditName={subredditName} />
}
export default page
