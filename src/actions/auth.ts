'use server'

import { signOut as signOut_func, signIn as signIn_func } from '@/lib/next-auth'

export const signIn = async (provider: 'google') => {
  await signIn_func(provider, { redirect: true })
}
export const signOut = async () => {
  await signOut_func()
}