import { Locale } from '@/config/i18n.config'
import { redirect } from '@/lib/next-intl/navigation'
import { db } from '@/lib/prisma'
import { headingParser } from '@/lib/utils/editor-js-parsers/heading-parser'
import { linkParser } from '@/lib/utils/editor-js-parsers/link-parser'
import { OutputData } from '@editorjs/editorjs'
import edjsHTML from 'editorjs-html'
import { FC } from 'react'
import { Interweave } from 'interweave'
import { tableParser } from '@/lib/utils/editor-js-parsers/table-parses'
import { redis } from '@/lib/redis'

interface pageProps {
  params: {
    locale: Locale
    subredditName: string
    postId: string
  }
}

const page: FC<pageProps> = async ({ params: { locale, subredditName, postId } }) => {
  const post = await db.post.findUnique({ where: { id: postId } })

  if (!post) redirect(`/r/${subredditName}`)

  const content = post?.content as unknown as OutputData

  const edjsParser = edjsHTML({
    link: linkParser,
    header: headingParser,
    table: tableParser,
  })
  const html = edjsParser.parse(content)

  return <div><Interweave className='prose' content={html.join(' ')} /></div>
}

export default page
