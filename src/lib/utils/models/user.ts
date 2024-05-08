import { db } from '@/lib/prisma'

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } })
    return user
  } catch (error) {
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } })
    return user
  } catch (err) {
    return null
  }
}