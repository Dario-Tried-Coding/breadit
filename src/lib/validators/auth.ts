import {z} from 'zod'

export const SignInValidator = z.object({
  provider: z.enum(['google']),
  redirectUrl: z.string().nullable(),
})
export type SignInPayload = z.infer<typeof SignInValidator>