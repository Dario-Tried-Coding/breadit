'use client'

import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'
import {parseCookies} from 'nookies'
import { REDIRECT_URL_COOKIE } from '@/config/auth.config'

interface AuthFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'action'> {}

const AuthForm: FC<AuthFormProps> = ({ className, ...props }) => {
  const t = useTranslations('Auth')
  const { toast } = useToast()

  const { mutate: signIn, isPending } = trpc.authRouter.signIn.useMutation({
    onSuccess(data) {
      if (data) window.location.href = data.url
    },
    onError(error) {
      toast({
        title: t('Errors.Toast.title'),
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const redirectUrl = parseCookies()[REDIRECT_URL_COOKIE]

  return (
    <form className={cn('self-stretch', className)} {...props}>
      <Button type='button' onClick={() => signIn({ provider: 'google', redirectUrl })} isLoading={isPending} className='w-full'>
        {!isPending && <Icons.google className='mr-2 h-4 w-4' />}
        {t('Providers.Google.name')}
      </Button>
    </form>
  )
}

export default AuthForm
