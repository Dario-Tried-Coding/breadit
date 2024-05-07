import { authRouter } from '@/lib/trpc/routers/auth-router'
import { router } from './init'

export const appRouter = router({
  authRouter,
})

export type AppRouter = typeof appRouter
