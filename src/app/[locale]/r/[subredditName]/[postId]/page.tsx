import { Locale } from '@/config/i18n.config'
import { getAuthSession } from '@/lib/next-auth/cache'
import { redirect } from '@/lib/next-intl/navigation'
import { db } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { headingParser } from '@/lib/utils/editor-js-parsers/heading-parser'
import { linkParser } from '@/lib/utils/editor-js-parsers/link-parser'
import { tableParser } from '@/lib/utils/editor-js-parsers/table-parses'
import { CachedPost } from '@/types/utils/redis'
import { OutputData } from '@editorjs/editorjs'
import edjsHTML from 'editorjs-html'
import { Interweave } from 'interweave'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
    postId: string
  }
}

const page: FC<pageProps> = async ({ params: { locale, subredditName, postId } }) => {
  const session = await getAuthSession()

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost | null
  let html: string | null = cachedPost?.content ?? null

  if (!html) {
    // get post from db
    const dbPost = await db.post.findUnique({ where: { id: postId }, include: { author: true, votes: true } })
    if (!dbPost) return redirect(`/r/${subredditName}`)

    const edjsParser = edjsHTML({
      link: linkParser,
      header: headingParser,
      table: tableParser,
    })
    html = edjsParser.parse(dbPost.content as unknown as OutputData).join('')

    // Cache post
    const currentVote = dbPost.votes.find((v) => v.userId === session?.user?.id)?.vote

    const postToCache: CachedPost = {
      id: dbPost.id,
      title: dbPost.title,
      authorUsername: dbPost.author.username as string,
      content: html,
      currentVote: currentVote ?? null,
    }

    await redis.hmset(`post:${postId}`, postToCache)
  }

  return (
    <div>
      <Interweave className='prose' content={html} />
    </div>
  )
}

export default page
