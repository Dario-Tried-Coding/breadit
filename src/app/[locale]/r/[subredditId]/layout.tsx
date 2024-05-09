import ToFeedBtn from '@/components/ToFeedBtn'
import { Feed } from '@/components/pages/Feed'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/next-auth/cache'
import { Link } from '@/lib/next-intl/navigation'
import { db } from '@/lib/prisma'
import { format } from 'date-fns'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { FC, PropsWithChildren } from 'react'

interface layoutProps extends PropsWithChildren {
  params: {
    locale: string
    subredditId: string
  }
}

const layout: FC<layoutProps> = async ({ children, params: { locale, subredditId } }) => {
  const t = await getTranslations({ locale, namespace: 'Pages.r.SubredditId' })
  const session = await getAuthSession()

  const subreddit = await db.subreddit.findUnique({
    where: { id: subredditId },
    include: { subscribers: true },
  })

  if (!subreddit) redirect('/')

  const Layout = Feed.Layout
  const Info = Feed.Info
  const Heading = Info.Heading
  const List = Info.List
  const Item = Info.Item

  return (
    <>
      <ToFeedBtn className='mt-6 md:mt-8' />
      <Feed>
        <Layout>
          <div className='col-span-2'>{children}</div>
          <Info>
            <Heading className='bg-accent'>{t('Info.about-subreddit', { subredditName: subreddit.name })}</Heading>
            <List>
              <Item>
                <Item.Term>{t('Info.createdAt')}</Item.Term>
                <Item.Description>
                  <time dateTime={subreddit.createdAt.toDateString()}>{format(subreddit.createdAt, 'MMMM dd, yyyy')}</time>
                </Item.Description>
              </Item>
              <Item>
                <Item.Term>{t('Info.subscribers')}</Item.Term>
                <Item.Description>{subreddit.subscribers.length}</Item.Description>
              </Item>
              {subreddit.creatorId === session?.user?.id ? <Item>{t('Info.you-created')}</Item> : <div>subscribe leave toggle</div>}
            </List>
            <Link href={`/r/${subredditId}/post`} className={buttonVariants({ variant: 'outline', className: 'mb-4 w-full' })}>
              {t('Info.create-post')}
            </Link>
          </Info>
        </Layout>
      </Feed>
    </>
  )
}

export default layout
