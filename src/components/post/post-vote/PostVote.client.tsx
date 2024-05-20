'use client'

import Vote_UI from '@/components/Vote.ui'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { votingLogic } from '@/machines/voting-machine'
import { Vote } from '@prisma/client'
import { useMachine } from '@xstate/react'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

interface PostVote_Client_Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  postId: string
  initialVotesAmt: number
  initialVote: Vote | null | undefined
}
const PostVote_Client: FC<PostVote_Client_Props> = ({ postId, initialVotesAmt, initialVote, className, ...rest }) => {
  const t = useTranslations('Components.PostVote.Client')
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const [state, send] = useMachine(
    votingLogic.provide({
      actions: {
        sendVote: ({ context: { voteType } }) => voteMtn({ postId, voteType }),
      },
    }),
    { input: { votesAmt: initialVotesAmt, voteType: initialVote ?? null } }
  )

  const { mutate: voteMtn } = trpc.votePost.useMutation({
    onSuccess() {
      send({ type: 'vote.success' })
    },
    onError() {
      send({ type: 'vote.error' })

      toast({
        title: t('Toasts.GenericError.title'),
        description: t('Toasts.GenericError.description'),
        variant: 'destructive',
      })
    },
  })

  const votePost = (voteType: Vote) => {
    if (initialVote === undefined) return signInToast()
    send({ type: 'click', voteType })
  }

  return (
    <Vote_UI voteFn={votePost} voteType={state.context.voteType} votesAmt={state.context.votesAmt} className={cn('gap-8 sm:flex-col sm:gap-4', className)} {...rest} />
  )
}

export default PostVote_Client
