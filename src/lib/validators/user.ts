import { I18nValues } from "@/types/utils";
import { z } from "zod";

export const USERNAME_CHANGE_I18N_PATH = 'Pages.Settings.Zod' as const
type Path = typeof USERNAME_CHANGE_I18N_PATH
export type USERNAME_CHANGE_I18N_KEYS = I18nValues<Path>

const username_too_long: USERNAME_CHANGE_I18N_KEYS = 'Username.too-long'
const username_too_short: USERNAME_CHANGE_I18N_KEYS = 'Username.too-short'
const username_contains_space: USERNAME_CHANGE_I18N_KEYS = 'Username.no-spaces'

export const usernameChangeValidator = z.object({
  username: z.string().min(3, username_too_short).max(21, username_too_long).refine(s => !s.includes(' '), username_contains_space),
})
export type UsernameChangePayload = z.infer<typeof usernameChangeValidator>