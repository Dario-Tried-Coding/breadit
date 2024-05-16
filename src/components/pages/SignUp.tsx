import { Icons } from '@/components/Icons'
import AuthForm from '@/components/auth/AuthForm'
import { Link } from '@/lib/next-intl/navigation'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface SignUpProps {}

export const SignUp: FC<SignUpProps> = async ({}) => {
  const t = await getTranslations('Pages.Auth.Sign-up')

  return (
    <>
      <Icons.logo className='h-8 w-8' />
      <h1 className='text-2xl font-semibold tracking-tight'>{t('heading')}</h1>
      <p className='text-sm'>{t('subheading')}</p>
      <AuthForm className='mt-6' />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        {t.rich('sign-in', {
          link: (chunk) => (
            <Link href='/auth/sign-in' className='text-sm underline underline-offset-4 hover:text-foreground'>
              {chunk}
            </Link>
          ),
        })}
      </p>
    </>
  )
}
