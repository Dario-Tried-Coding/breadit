import JoinLeaveToogle from '@/components/JoinLeaveToogle'
import ToFeedBtn from '@/components/ToFeedBtn'
import { Feed } from '@/components/pages/Feed'
import { buttonVariants } from '@/components/ui/Button'
import { DEFAULT_REDIRECT_URL } from '@/config/auth.config'
import { Locale } from '@/config/i18n.config'
import { getAuthSession } from '@/lib/next-auth/cache'
import { Link, redirect } from '@/lib/next-intl/navigation'
import { db } from '@/lib/prisma'
import { format } from 'date-fns'
import { getTranslations } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'

interface layoutProps extends PropsWithChildren {
  params: {
    locale: Locale
    subredditName: string
  }
}

const layout: FC<layoutProps> = async ({ children, params: { locale, subredditName } }) => {
  const localeModule = (await import(`date-fns/locale`))[locale]
  const t = await getTranslations({ locale, namespace: 'Pages.r.SubredditName' })
  const session = await getAuthSession()

  // if subreddit doesn't exist, redirect to DEFAULT_REDIRECT_URL
  const subreddit = await db.subreddit.findUnique({
    where: { name: subredditName },
    include: { subscribers: true },
  })

  if (!subreddit) return redirect(DEFAULT_REDIRECT_URL)

  // if not signed in, show posts but deny user any action
  const isSubscribed = !!subreddit.subscribers.find((u) => u.id === session?.user?.id)
  const isCreator = subreddit.creatorId === session?.user?.id

  const Layout = Feed.Layout
  const Info = Feed.Info
  const Heading = Info.Heading
  const List = Info.List
  const Item = Info.Item
  const Footer = Info.Footer

  return (
    <>
      <ToFeedBtn className='mt-6 md:mt-8' />
      <Feed>
        <Layout>
          <div className="col-span-2">{children}</div>
          <Info>
            <Heading className='bg-accent'>{t('Info.about-subreddit', { subredditName: subreddit.name })}</Heading>
            <List>
              <Item>
                <Item.Term>{t('Info.createdAt')}</Item.Term>
                <Item.Description>
                  <time dateTime={subreddit.createdAt.toDateString()}>{format(subreddit.createdAt, 'dd/MM/yyyy', { locale: localeModule })}</time>
                </Item.Description>
              </Item>
              <Item>
                <Item.Term>{t('Info.subscribers')}</Item.Term>
                <Item.Description>{subreddit.subscribers.length}</Item.Description>
              </Item>
              {isCreator && <Item>{t('Info.you-created')}</Item>}
            </List>
            <Footer>
              {session?.user && !isCreator && <JoinLeaveToogle isSubscribed={isSubscribed} subreddit={subreddit} />}
              {session?.user && (
                <Link href={`/r/${subredditName}/publish`} className={buttonVariants({ className: 'w-full' })}>
                  {t('Info.create-post')}
                </Link>
              )}
            </Footer>
          </Info>
        </Layout>
      </Feed>
    </>
  )
}

export default layout
