'use client'

import { buttonVariants } from '@/components/ui/Button'
import { REDIRECT_URL_PARAM } from '@/config/auth.config'
import { Link, usePathname } from '@/lib/next-intl/navigation'
import { cn } from '@/lib/utils'
import { I18nLinkProps } from '@/types/utils'
import { VariantProps } from 'class-variance-authority'
import { useTranslations } from 'next-intl'

interface SignInProps extends I18nLinkProps, VariantProps<typeof buttonVariants> {}
const SignIn = ({ className, size, variant, ...props }: SignInProps) => {
  const pathname = usePathname()
  const t = useTranslations('Auth.CTA')

  return (
    <Link href={`/api/auth/signin?${REDIRECT_URL_PARAM}=${pathname}`} className={cn(buttonVariants({ size, variant }), className)} {...props}>
      {t('sign-in')}
    </Link>
  )
}

interface SignOutProps extends I18nLinkProps, VariantProps<typeof buttonVariants> {}
const SignOut = ({ className, size, variant, ...props }: SignOutProps) => {
  const pathname = usePathname()
  const t = useTranslations('Auth.CTA')

  return (
    <Link href={`/api/auth/signin?${REDIRECT_URL_PARAM}=${pathname}`} className={cn(buttonVariants({ size, variant }), className)} {...props}>
      {t('sign-up')}
    </Link>
  )
}

export { SignIn, SignOut }
