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
    async session({ session, token }) {
      if (!token.sub) return session
      
      session.user.id = token.sub

      return session
    }
  },
  ...auth_config,
})
