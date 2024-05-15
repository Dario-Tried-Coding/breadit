import { I18nValues } from "@/types/utils";
import { Vote } from "@prisma/client";
import { z } from "zod";

export const commentVotingValidator = z.object({
  commentId: z.string(),
  voteType: z.custom<Vote>(),
})
export type CommentVotingPayload = z.infer<typeof commentVotingValidator>

// COMMENT REPLYING -----------------------------------------------------------------

export const COMMENT_REPLYING_I18N_PATH = 'Components.Comment.Zod' as const
type Path = typeof COMMENT_REPLYING_I18N_PATH

const content_required: I18nValues<Path> = 'Content.required'
const content_tooLong: I18nValues<Path> = 'Content.tooLong'

export const commentCreationValidator = z.object({
  postId: z.string(),
  replyToId: z.string().optional(),
  content: z.string().min(1, content_required).max(1000, content_tooLong),
})
export type CommentCreationPayload = z.infer<typeof commentCreationValidator>