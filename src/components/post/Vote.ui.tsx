'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface Vote_UI_Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  voteFn: (vote: Vote) => void
  votesAmt: number
  voteType: Vote | null | undefined
}

const Vote_UI: FC<Vote_UI_Props> = ({voteFn, votesAmt, voteType, className, ...rest}) => {
  const t = useTranslations('Components.Voting')

  return (
    <div className={cn('flex flex-row items-center', className)} {...rest}>
      <Button onClick={() => voteFn('UP')} size='sm' variant='ghost' aria-label={t('upvote')} className='order-last sm:order-first'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-foreground-700', {
            'fill-success text-success': voteType === 'UP',
          })}
        />
      </Button>
      <p className='text-center text-sm font-medium'>{votesAmt}</p>
      <Button onClick={() => voteFn('DOWN')} size='sm' variant='ghost' aria-label={t('downvote')} className='order-first sm:order-last'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-foreground-700', {
            'fill-destructive text-destructive': voteType === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default Vote_UI

export const Vote_Skeleton = () => {
  const t = useTranslations('Components.Voting')

  return (
    <div className='flex flex-row items-center gap-8 sm:w-20 sm:flex-col sm:gap-4'>
      <Button size='sm' variant='ghost' disabled aria-label={t('upvote')} className='order-last sm:order-first'>
        <ArrowBigUp className='h-5 w-5 text-foreground-700' />
      </Button>
      <div className='text-center text-sm font-medium'>
        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
      </div>
      <Button size='sm' variant='ghost' disabled aria-label={t('downvote')} className='order-first sm:order-last'>
        <ArrowBigDown className='h-5 w-5 text-foreground-700' />
      </Button>
    </div>
  )
}