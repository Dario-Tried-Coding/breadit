import { auth_config } from '@/config/auth.config'
import { db } from '@/lib/prisma'
import { getUserById } from '@/lib/utils/models/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const dbUser = await getUserById(token.sub)
      if (!dbUser) return token

      token.id = dbUser.id

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id

      return session
    }
  },
  ...auth_config,
})
