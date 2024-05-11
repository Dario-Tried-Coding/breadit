import { db } from '@/lib/prisma'

export async function getSubredditById(id: string) {
  try {
    const subreddit = await db.subreddit.findUnique({ where: { id } })
    return subreddit
  } catch (error) {
    return null
  }
}

export async function getSubredditByName(name: string) {
  try {
    const subreddit = await db.subreddit.findUnique({ where: { name } })
    return subreddit
  } catch (error) {
    return null
  }
}
