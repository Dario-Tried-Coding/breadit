import PostVote_Client from '@/components/post/post-vote/PostVote.client'
import { Vote } from '@prisma/client'
import { FC } from 'react'

interface PostVote {
  postId: string
  getUserVote: () => Promise<Vote | null | undefined>
  initialVotesAmt: number
}

const PostVote: FC<PostVote> = async ({ postId, initialVotesAmt, getUserVote }) => {
  const userVote = await getUserVote()

  return (
    <div>
      <PostVote_Client postId={postId} initialVotesAmt={initialVotesAmt} initialVote={userVote} />
    </div>
  )
}

export default PostVote
