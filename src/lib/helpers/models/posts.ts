import { DEFAULT_INFINITE_QUERY_LIMIT } from '@/config'
import { auth } from '@/lib/next-auth'
import { db } from '@/lib/prisma'

interface ClientOpts {
  subredditName?: string | null
}
interface QueryOpts {
  limit?: number | null
  cursor?: string | null
}
export async function getFeedPosts(clientOpts?: ClientOpts | null, queryOpts?: QueryOpts | null) {
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
    orderBy: {
      createdAt: 'desc',
    },
  })

  const posts = postsPlusOne.length === take ? postsPlusOne.slice(0, take - 1) : postsPlusOne
  const nextPost = postsPlusOne.length === take ? postsPlusOne.pop() : undefined

  return { posts, nextPost }
}
