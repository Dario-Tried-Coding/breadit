'use client'

import Vote from '@/components/comment/CommentVote'
import WriteComment from '@/components/comment/WriteComment'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import type { Comment, CommentVote, Vote as TVote, User } from '@prisma/client'
import { MessageSquare, UserIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface CommentProps {
  comment: Omit<Comment, 'createdAt'> & { author: User; votes: CommentVote[]; createdAt: string }
  votesAmt: number
  userVote: TVote | null | undefined
  replyToId?: string
}

const Comment: FC<CommentProps> = ({ comment, votesAmt, userVote, replyToId }) => {
  const t = useTranslations('Components.Comment.Client.UI')
  const session = useSession()

  const { signInToast } = useCustomToasts()

  const [isReplying, setIsReplying] = useState(false)

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={comment.author.image!} alt={t('alt')} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <p className='text-sm font-medium'>
          {t('user-prefix')}
          {comment.author.username}&nbsp;•&nbsp;<span className='font-normal text-muted-foreground'>{comment.createdAt}</span>
        </p>
      </div>
      <p className='mt-2 text-sm'>{comment.content}</p>
      <div className='flex items-center'>
        <Vote commentId={comment.id} initialVotesAmt={votesAmt} initialVoteType={userVote} />
        <Button onClick={() => (session.data?.user ? setIsReplying(true) : signInToast())} variant='ghost' size='sm' className='gap-1.5'>
          <MessageSquare className='h-4 w-4' />
          {t('reply')}
        </Button>
      </div>
      {isReplying && (
        <WriteComment
          postId={comment.postId}
          replyToId={replyToId || comment.id}
          mention={comment.author.username ?? undefined}
          closeForm={() => setIsReplying(false)}
          className='mt-2'
        />
      )}
    </div>
  )
}

export default Comment
