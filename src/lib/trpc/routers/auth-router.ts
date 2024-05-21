import { signIn } from '@/lib/next-auth'
import { publicProcedure, router } from '@/lib/trpc/init'
import { SignInValidator } from '@/lib/validators/auth'
import { TRPCError } from '@trpc/server'
import { AuthError } from 'next-auth'
import { getTranslations } from 'next-intl/server'

export const authRouter = router({
  signIn: publicProcedure.input(SignInValidator).mutation(async ({ ctx: { locale }, input: { provider, redirectUrl } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth.Errors' })

    try {
      const url = (await signIn(provider, { redirect: false, redirectTo: redirectUrl })) as string
      return { url }
    } catch (error) {
      if (error instanceof AuthError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: t('social-auth-error', { provider }) })
    }
  }),
})
