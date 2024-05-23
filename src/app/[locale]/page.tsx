import GeneralFeed from '@/components/feed/GeneralFeed'
import { Feed } from '@/components/pages/Feed'
import { buttonVariants } from '@/components/ui/Button'
import { Locale } from '@/config/i18n.config'
import { Link } from '@/lib/next-intl/navigation'
import { HomeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
  }
}

const page: FC<pageProps> = ({ params: { } }) => {
  const t = useTranslations('Pages.Home')

  const { H1 } = Feed.Heading
  const Layout = Feed.Layout
  const Info = Feed.Info

  return (
    <Feed className='mt-8'>
      <H1>{t('heading')}</H1>
      <Layout>
        <GeneralFeed className='col-span-2' />

        <Info>
          <Info.Heading>
            <HomeIcon className='h-4 w-4' />
            {t('Info.heading')}
          </Info.Heading>
          <Info.List>
            <Info.Item>
              <span>{t('Info.description')}</span>
            </Info.Item>
          </Info.List>
          <Link
            className={buttonVariants({
              className: 'mb-4 mt-4 w-full',
            })}
            href={`/r/create`}
          >
            {t('Info.create-community')}
          </Link>
        </Info>
      </Layout>
    </Feed>
  )
}

export default page
