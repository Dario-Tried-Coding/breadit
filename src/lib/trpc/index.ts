import { authRouter } from '@/lib/trpc/routers/auth-router'
import { privateProcedure, router } from './init'
import { subredditCreationValidator } from '@/lib/validators/subreddit'
import { db } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'

export const appRouter = router({
  authRouter,
  createSubreddit: privateProcedure.input(subredditCreationValidator).mutation(async ({ ctx: { locale, userId: creatorId }, input: { name } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.r.Create.Server' })
    const existingSubreddit = await db.subreddit.findFirst({ where: { name, creatorId } })

    if (existingSubreddit) throw new TRPCError({ code: 'CONFLICT', message: t('Errors.subreddit-already-exists') })

    const subreddit = await db.subreddit.create({ data: { name, creatorId } })
    return subreddit.id
  }),
})

export type AppRouter = typeof appRouter
