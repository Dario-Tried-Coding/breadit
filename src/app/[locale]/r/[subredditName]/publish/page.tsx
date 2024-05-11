import Editor from '@/components/Editor'
import { Feed } from '@/components/pages/Feed'
import { Locale } from '@/config/i18n.config'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
  }
}

const page: FC<pageProps> = ({ params: { locale, subredditName } }) => {
  const { H3 } = Feed.Heading

  return (
    <div className='flex flex-col items-stretch gap-8'>
      <H3 className='max-w-full self-start border-b pb-6'>
        Write Post &nbsp;<span className='truncate text-sm font-normal text-muted-500'>in r/{subredditName}</span>
      </H3>
      <Editor />
    </div>
  )
}

export default page
