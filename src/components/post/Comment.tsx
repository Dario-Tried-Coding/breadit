'use client'

import Vote from '@/components/post/CommentVote'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import type { Comment, CommentVote, Vote as TVote, User } from '@prisma/client'
import { UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface CommentProps {
  comment: Omit<Comment, 'createdAt'> & { author: User; votes: CommentVote[]; createdAt: string }
  votesAmt: number
  userVote: TVote | null | undefined
}

const Comment: FC<CommentProps> = ({ comment, votesAmt, userVote }) => {
  const t = useTranslations('Components.CommentVote.Client')

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={comment.author.image!} alt={t('Avatar.alt')} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <p className='text-sm font-medium'>
          u/{comment.author.username}&nbsp;•&nbsp;<span className='font-normal text-muted-foreground'>{comment.createdAt}</span>
        </p>
      </div>
      <p className='mt-2 text-sm'>{comment.content}</p>
      <div className="flex items-center">
        <Vote commentId={comment.id} initialVotesAmt={votesAmt} initialVoteType={userVote} />
      </div>
    </div>
  )
}

export default Comment
