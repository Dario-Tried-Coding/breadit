'use client'

import Vote_UI from '@/components/post/Vote.ui'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { votesAmountLogic } from '@/machines/votes-amt-reducer-logic'
import { Vote } from '@prisma/client'
import { useActor } from '@xstate/react'
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

  const [{ context }, send] = useActor(votesAmountLogic, { input: { votesAmt: initialVotesAmt, voteType: initialVoteType } })

  const { mutate: voteMtn, isPending } = trpc.voteComment.useMutation({
    onMutate({ voteType }) {
      send({ type: voteType })
    },
    onError(err, { voteType }) {
      send({ type: voteType })

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

  const voteComment = (voteType: Vote) => {
    if (initialVoteType === undefined) return signInToast()
    if (!isPending) voteMtn({ commentId, voteType })
  }

  return <Vote_UI voteFn={voteComment} voteType={context.voteType} votesAmt={context.votesAmt} className={cn('gap-2', className)} {...rest} />
}

export default CommentVote
