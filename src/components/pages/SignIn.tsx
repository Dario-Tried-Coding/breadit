import { Icons } from '@/components/Icons'
import AuthForm from '@/components/auth/AuthForm'
import { Locale } from '@/config/i18n.config'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface SignInProps {}

const SignIn: FC<SignInProps> = async ({ }) => {
  const t = await getTranslations('Pages.Auth.Sign-in')

  return (
    <>
      <Icons.logo className='h-8 w-8' />
      <h1 className='text-2xl font-semibold tracking-tight'>{t('heading')}</h1>
      <p className='text-sm'>{t('subheading')}</p>
      <AuthForm className='mt-6' />
    </>
  )
}

export default SignIn
