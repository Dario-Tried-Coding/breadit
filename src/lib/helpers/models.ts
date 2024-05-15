import { db } from "@/lib/prisma";

export async function isUserPartOfSubreddit({ userId, subredditId }: { userId: string; subredditId: string }) {
  const isSubscribed = !!(await db.user.findFirst({ where: { id: userId, subscribedSubreddits: { some: { id: subredditId } } } }))
  const isOwner = !!(await db.user.findFirst({ where: { id: userId, createdSubreddits: { some: { id: subredditId } } } }))
  return isSubscribed || isOwner
}