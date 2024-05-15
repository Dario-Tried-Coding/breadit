import { Vote } from "@prisma/client";
import { z } from "zod";

export const commentVotingValidator = z.object({
  commentId: z.string(),
  voteType: z.custom<Vote>(),
})
export type CommentVotingPayload = z.infer<typeof commentVotingValidator>