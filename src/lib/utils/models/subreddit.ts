import { db } from '@/lib/prisma'

export async function getSubredditById(id: string) {
  try {
    const subreddit = await db.subreddit.findUnique({ where: { id } })
    return subreddit
  } catch (error) {
    return null
  }
}