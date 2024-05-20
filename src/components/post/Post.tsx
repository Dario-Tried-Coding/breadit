'use client'

import EditorOutput from '@/components/EditorOutput'
import PostVote_Client from '@/components/post/post-vote/PostVote.client'
import { Link } from '@/lib/next-intl/navigation'
import { ExtendedFeedPost } from '@/types/utils/feed'
import type { Vote } from '@prisma/client'
import { FC, useRef } from 'react'

interface PostProps {
  post: ExtendedFeedPost
  subredditName: string
  votesAmt: number
  voteType: Vote | null | undefined
}

const Post: FC<PostProps> = ({ votesAmt, voteType, subredditName, post }) => {
  const postRef = useRef<HTMLLIElement>(null)

  return (
    <li ref={postRef} className='flex justify-between gap-2 rounded-md bg-card py-4 pl-2 pr-6 shadow sm:gap-6 sm:px-6'>
      <PostVote_Client initialVotesAmt={votesAmt} initialVote={voteType} postId={post.id} className='flex-col-reverse gap-4' />
      <div className='relative max-h-60 flex-1 overflow-clip'>
        <div className='text-sm text-muted-foreground'>
          <Link href={`/r/${subredditName}`} className='text-foreground underline underline-offset-2'>
            r/{subredditName}
          </Link>
          &nbsp;•&nbsp;
          <span>Posted by u/{post.author.username}</span>&nbsp;{post.createdAt}
        </div>
        <Link href={`/r/${subredditName}/${post.id}`} className='mt-2 block'>
          <h2 className='text-lg font-semibold leading-6'>{post.title}</h2>
        </Link>
        <EditorOutput output={post.content} />
        {postRef.current && postRef.current?.clientHeight > 160 && (
          <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent' />
        )}
      </div>
    </li>
  )
}

export default Post
