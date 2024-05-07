import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const REDIRECT_URL_PARAM = 'redirectUrl' as const
export const DEFAULT_REDIRECT_URL = '/' as const

export default {
  providers: [Google],
  pages: {
    signIn: '/sign-in'
  }
} satisfies NextAuthConfig
