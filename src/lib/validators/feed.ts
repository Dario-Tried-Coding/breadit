import { z } from 'zod'

export const infiniteFeedValidator = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  subredditName: z.string().nullish(),
})
export type InfiniteFeedPayload = z.infer<typeof infiniteFeedValidator>
