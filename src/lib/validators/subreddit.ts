import { z } from "zod";

export const subredditCreationValidator = z.object({
  name: z.string().min(3).max(21),
})
export type SubredditCreationPayload = z.infer<typeof subredditCreationValidator>