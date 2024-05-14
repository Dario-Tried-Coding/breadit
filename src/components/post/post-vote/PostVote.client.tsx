'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { Vote } from '@prisma/client'
import { useActor } from '@xstate/react'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { FC } from 'react'
import { fromTransition } from 'xstate'

type Event = { type: Vote }
type VotesAmtCtx = { count: number; voted?: Vote | null }
const votesAmountLogic = fromTransition(
  (state: VotesAmtCtx, event: Event) => {
    switch (event.type) {
      case 'UP': {
        if (state.voted === 'UP') return { count: state.count - 1, voted: null }
        else if (state.voted === 'DOWN') return { count: state.count + 2, voted: 'UP' as Vote }
        else return { count: state.count + 1, voted: 'UP' as Vote }
      }

      case 'DOWN': {
        if (state.voted === 'DOWN') return { count: state.count + 1, voted: null }
        else if (state.voted === 'UP') return { count: state.count - 2, voted: 'DOWN' as Vote }
        else return { count: state.count - 1, voted: 'DOWN' as Vote }
      }

      default: {
        return state
      }
    }
  },
  ({ input }: { input: VotesAmtCtx }) => input
)

interface PostVote_Client_Props {
  postId: string
  initialVotesAmt: number
  initialVote?: Vote | null
}
const PostVote_Client: FC<PostVote_Client_Props> = ({ postId, initialVotesAmt, initialVote }) => {
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const [{ context }, send] = useActor(votesAmountLogic, { input: { count: initialVotesAmt, voted: initialVote } })

  const { mutate: voteMtn, isPending } = trpc.votePost.useMutation({
    onMutate({ vote }) {
      send({ type: vote })
    },
    onError(err, { vote }) {
      send({ type: vote })

      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      toast({
        title: 'There was an error voting',
        description: 'It seems like there was an error voting, please try again later',
        variant: 'destructive',
      })
    },
  })

  const votePost = (vote: Vote) => {
    if (initialVote === null) return signInToast()
    if (!isPending) voteMtn({ postId, vote })
  }

  return (
    <div className='flex flex-row items-center gap-8 sm:w-20 sm:flex-col sm:gap-4'>
      <Button onClick={() => votePost('UP')} size='sm' variant='ghost' aria-label='upvote' className='order-last sm:order-first'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-foreground-700', {
            'fill-success text-success': context.voted === 'UP',
          })}
        />
      </Button>
      <p className='text-center text-sm font-medium'>{context.count}</p>
      <Button onClick={() => votePost('DOWN')} size='sm' variant='ghost' aria-label='downvote' className='order-first sm:order-last'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-foreground-700', {
            'fill-destructive text-destructive': context.voted === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default PostVote_Client

export const PostVote_Skeleton = () => {
  return (
    <div className='flex flex-row items-center gap-8 sm:w-20 sm:flex-col sm:gap-4'>
      <Button size='sm' variant='ghost' disabled aria-label='upvote' className='order-last sm:order-first'>
        <ArrowBigUp className='h-5 w-5 text-foreground-700' />
      </Button>
      <div className='text-center text-sm font-medium'>
        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
      </div>
      <Button size='sm' variant='ghost' disabled aria-label='downvote' className='order-first sm:order-last'>
        <ArrowBigDown className='h-5 w-5 text-foreground-700' />
      </Button>
    </div>
  )
}