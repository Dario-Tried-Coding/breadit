import Editor from '@/components/Editor'
import { Feed } from '@/components/pages/Feed'
import { DEFAULT_REDIRECT_URL } from '@/config/auth.config'
import { Locale } from '@/config/i18n.config'
import { redirect } from '@/lib/next-intl/navigation'
import { getSubredditByName } from '@/lib/utils/models/subreddit'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
  }
}

const page: FC<pageProps> = async ({ params: { locale, subredditName } }) => {
  const subreddit = await getSubredditByName(subredditName)

  if (!subreddit) return redirect(DEFAULT_REDIRECT_URL)

  const { H3 } = Feed.Heading

  return (
    <div className='flex flex-col items-stretch gap-8'>
      <H3 className='max-w-full self-start border-b pb-6'>
        Write Post &nbsp;<span className='truncate text-sm font-normal text-muted-500'>in r/{subredditName}</span>
      </H3>
      <Editor subredditId={subreddit.id} />
    </div>
  )
}

export default page
