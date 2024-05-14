'use client'

import { Button, ButtonProps } from '@/components/ui/Button'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { Subreddit } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

interface JoinLeaveToogleProps extends Omit<ButtonProps, 'asChild' | 'isLoading' | 'disabled' | 'onClick'> {
  isSubscribed: boolean
  subreddit: Pick<Subreddit, 'id' | 'name'>
}

const JoinLeaveToogle: FC<JoinLeaveToogleProps> = ({ isSubscribed, subreddit, className, variant = 'outline', ...rest }) => {
  const t = useTranslations('Components.JoinLeaveBtn')
  const router = useRouter()
  const { toast } = useToast()
  const { signInToast} = useCustomToasts()

  const { mutate: joinLeaveSubreddit, isPending } = trpc.joinLeaveSubreddit.useMutation({
    onSuccess: (data) => {
      router.refresh()
      if (data === 'SUBSCRIBED')
        toast({
          title: t('Toasts.Subscribed.title'),
          description: t('Toasts.Subscribed.description', { subredditName: subreddit.name }),
        })
      else
        toast({
          title: t('Toasts.Unsubscribed.title'),
          description: t('Toasts.Unsubscribed.description', { subredditName: subreddit.name }),
        })
    },
    onError(err) {
      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      return toast({
        title: t('Toasts.GenericError.title'),
        description: t('Toasts.GenericError.description', { action: isSubscribed ? 'leave' : 'join' }),
        variant: 'destructive',
      })
    },
  })

  return (
    <Button onClick={() => joinLeaveSubreddit({ subredditId: subreddit.id })} disabled={isPending} isLoading={isPending} variant={variant} className={cn('w-full', className)} {...rest}>
      {isSubscribed ? t('leave-community') : t('join-community')}
    </Button>
  )
}

export default JoinLeaveToogle
