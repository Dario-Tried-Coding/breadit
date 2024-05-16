'use client'

import { buttonVariants } from '@/components/ui/Button'
import { Link } from '@/lib/next-intl/navigation'
import { I18nLinkProps } from '@/types/utils'
import { VariantProps } from 'class-variance-authority'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface SignInProps extends I18nLinkProps, VariantProps<typeof buttonVariants> {}
export const SignIn: FC<SignInProps> = ({ size, variant, className, ...props }) => {
  const t = useTranslations('Auth.CTA')

  return (
    <Link href='/auth/sign-in' className={buttonVariants({ size, variant, className })} {...props}>
      {t('sign-in')}
    </Link>
  )
}
