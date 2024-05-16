'use client'

import Vote_UI from '@/components/post/Vote.ui'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { votingLogic } from '@/machines/voting-machine'
import { Vote } from '@prisma/client'
import { useMachine } from '@xstate/react'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface CommentVoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  commentId: string
  initialVotesAmt: number
  initialVoteType: Vote | null | undefined
}

const CommentVote: FC<CommentVoteProps> = ({ commentId, initialVotesAmt, initialVoteType, className, ...rest }) => {
  const t = useTranslations('Components.CommentVote.Client')

  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const [state, send] = useMachine(
    votingLogic.provide({
      actions: {
        sendVote: ({ context }) => voteMtn({ commentId, voteType: context.voteType }),
      },
    }),
    { input: { votesAmt: initialVotesAmt, voteType: initialVoteType ?? null } }
  )

  const { mutate: voteMtn } = trpc.voteComment.useMutation({
    onSuccess() {
      send({ type: 'vote.success' })
    },
    onError(err) {
      send({ type: 'vote.error' })

      if (err.data?.code === 'FORBIDDEN')
        return toast({
          title: t('Toasts.MustBePartOfSubreddit.title'),
          description: t('Toasts.MustBePartOfSubreddit.description'),
          variant: 'destructive',
        })

      toast({
        title: t('Toasts.GenericError.title'),
        description: t('Toasts.GenericError.description'),
        variant: 'destructive',
      })
    },
  })

  // TODO: Add join subreddit toast
  const voteComment = (voteType: Vote) => {
    if (initialVoteType === undefined) return signInToast()
    send({ type: 'click', voteType })
  }

  return (
    <Vote_UI voteFn={voteComment} voteType={state.context.voteType} votesAmt={state.context.votesAmt} className={cn('gap-2', className)} {...rest} />
  )
}

export default CommentVote
