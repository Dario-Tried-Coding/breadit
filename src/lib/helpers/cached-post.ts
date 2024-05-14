import { edjsParser } from '@/lib/editor-js/parser'
import { CachedPost } from '@/types/utils/redis'
import { OutputData } from '@editorjs/editorjs';
import { Post, PostVote, User } from '@prisma/client'

export function constructCachedPost(post: Post & { votes: PostVote[]; author: User }): CachedPost {
  return {
    id: post.id,
    title: post.title,
    authorUsername: post.author.username as string,
    content: edjsParser.parse(post.content as unknown as OutputData).join(''),
    votesAmt: post.votes.reduce((acc, vote) => acc + (vote.vote === 'UP' ? 1 : -1), 0),
  }
}
