import { z } from "zod";

export const subredditCreationValidator = z.object({
  name: z.string().min(3).max(21),
})
export type SubredditCreationPayload = z.infer<typeof subredditCreationValidator>

export const subredditJoiningLeavingValidator = z.object({
  subredditId: z.string()
})
export type SubredditJoiningLeavingPayload = z.infer<typeof subredditJoiningLeavingValidator>

export const subredditSearchValidator = z.object({
  subredditName: z.string(),
})
export type SubredditSearchPayload = z.infer<typeof subredditSearchValidator>