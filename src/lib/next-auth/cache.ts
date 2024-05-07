import { auth } from '@/lib/next-auth'
import { cache } from 'react'

export const getAuthSession = cache(auth)