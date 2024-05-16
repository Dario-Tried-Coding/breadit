import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up'] as const
export const DEFAULT_REDIRECT_URL = '/' as const
export const REDIRECT_URL_COOKIE = 'authjs.callback-url' as const

export const auth_config = {
  providers: [Google({
    userinfo: {
      
    }
  })],
  pages: {
    signIn: '/auth/sign-in'
  }
} as const satisfies NextAuthConfig
