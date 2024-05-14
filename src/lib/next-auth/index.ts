import { auth_config } from '@/config/auth.config'
import { db } from '@/lib/prisma'
import { getUserById } from '@/lib/utils/models/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { nanoid } from 'nanoid'

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await getUserById(token.sub!)

      if (!dbUser?.username) {
        const updatedUser = await db.user.update({
          where: { id: token.sub! },
          data: { username: nanoid(10) },
        })
        token.username = updatedUser.username!
      }

      token.username = dbUser?.username!

      return token
    },
    async session({ session, token }) {
      if (!token.sub) return session
      
      session.user.id = token.sub
      session.user.username = token.username

      return session
    }
  },
  ...auth_config,
})
