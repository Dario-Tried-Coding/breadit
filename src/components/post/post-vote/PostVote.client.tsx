'use client'

import Vote_UI from '@/components/post/Vote.ui'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { Vote } from '@prisma/client'
import { useActor } from '@xstate/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { votesAmountLogic } from '@/machines/votes-amt-reducer-logic'

interface PostVote_Client_Props {
  postId: string
  initialVotesAmt: number
  initialVote: Vote | null | undefined
}
const PostVote_Client: FC<PostVote_Client_Props> = ({ postId, initialVotesAmt, initialVote }) => {
  const t = useTranslations('Components.PostVote.Client')
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const [{ context }, send] = useActor(votesAmountLogic, { input: { votesAmt: initialVotesAmt, voteType: initialVote } })

  const { mutate: voteMtn, isPending } = trpc.votePost.useMutation({
    onMutate({ vote }) {
      send({ type: vote })
    },
    onError(_, { vote }) {
      send({ type: vote })

      toast({
        title: t('Toasts.GenericError.title'),
        description: t('Toasts.GenericError.description'),
        variant: 'destructive',
      })
    },
  })

  const votePost = (vote: Vote) => {
    if (initialVote === undefined) return signInToast()
    if (!isPending) voteMtn({ postId, vote })
  }

  return <Vote_UI voteFn={votePost} voteType={context.voteType} votesAmt={context.votesAmt} className='gap-8 sm:flex-col sm:gap-4' />
}

export default PostVote_Client
