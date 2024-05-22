import { I18nValues } from "@/types/utils";
import { z } from "zod";

export const SUBREDDIT_CREATION_I18N_PATH = 'Pages.r.Create.Zod' as const
export type SUBREDDIT_CREATION_I18N_KEYS = I18nValues<typeof SUBREDDIT_CREATION_I18N_PATH>

const name_too_long: SUBREDDIT_CREATION_I18N_KEYS = 'Name.too-long'
const name_too_short: SUBREDDIT_CREATION_I18N_KEYS = 'Name.too-short'
const name_contains_space: SUBREDDIT_CREATION_I18N_KEYS = 'Name.no-spaces'

export const subredditCreationValidator = z.object({
  name: z.string().min(3, name_too_short).max(21, name_too_long).refine(s => !s.includes(' '), name_contains_space),
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