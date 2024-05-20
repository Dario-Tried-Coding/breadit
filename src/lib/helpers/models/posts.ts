import { DEFAULT_INFINITE_QUERY_LIMIT } from '@/config'
import { Locale } from '@/config/i18n.config'
import { auth } from '@/lib/next-auth'
import { db } from '@/lib/prisma'
import { formatTimeToNow } from '@/lib/utils/date-fns'

interface ClientOpts {
  subredditName?: string | null
}
interface QueryOpts {
  limit?: number | null
  cursor?: string | null
}
export async function getFeedPosts(locale: Locale, clientOpts?: ClientOpts | null, queryOpts?: QueryOpts | null) {
  const subredditName = clientOpts?.subredditName
  const cursor = queryOpts?.cursor
  const limit = queryOpts?.limit

  const session = await auth()

  const take = (limit ?? DEFAULT_INFINITE_QUERY_LIMIT) + 1

  let where: {} | undefined = undefined
  if (subredditName) where = { subreddit: { name: subredditName } }
  else if (session)
    where = {
      OR: [
        {
          subreddit: {
            creatorId: session?.user?.id,
          },
        },
        {
          subreddit: {
            subscribers: {
              some: {
                id: session?.user?.id,
              },
            },
          },
        },
      ],
    }

  let cursorSettings: {} | undefined = undefined
  if (cursor) cursorSettings = { cursor: { id: cursor } }

  const postsPlusOne = await db.post.findMany({
    take,
    ...cursorSettings,
    where,
    include: {
      author: true,
      subreddit: true,
      votes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const posts = await Promise.all(
    (postsPlusOne.length === take ? postsPlusOne.slice(0, take - 1) : postsPlusOne).map(async (p) => ({
      ...p,
      createdAt: await formatTimeToNow(p.createdAt, locale),
    }))
  )

  const nextPost = postsPlusOne.length === take ? postsPlusOne.pop() : undefined
  const strigifiedCreatedAt = nextPost ? await formatTimeToNow(nextPost?.createdAt, locale) : ''

  return { posts, nextPost: nextPost ? { ...nextPost, createdAt: strigifiedCreatedAt } : undefined }
}
