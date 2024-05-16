import { I18nValues } from '@/types/utils'
import { OutputData } from '@editorjs/editorjs'
import { Vote } from '@prisma/client'
import { z } from 'zod'

export const POST_CREATION_I18N_PATH = 'Components.Editor.Zod' as const
type Path = typeof POST_CREATION_I18N_PATH

const title_required: I18nValues<Path> = 'Title.required'
const title_tooLong: I18nValues<Path> = 'Title.tooLong'
const content_required: I18nValues<Path> = 'Content.required'

interface Content extends OutputData {
  [key: string]: any
}

export const postCreationValidator = z
  .object({
    subredditId: z.string(),
    title: z.string().min(1, title_required).max(255, title_tooLong),
    content: z.custom<Content>(),
  })
  .refine((data) => data.content.blocks.length > 0, {
    message: content_required,
    path: ['content'],
  })
export type PostCreationPayload = z.infer<typeof postCreationValidator>

export const postVotingValidator = z.object({
  postId: z.string(),
  voteType: z.custom<Vote>().nullable(),
})
export type PostVotingPayload = z.infer<typeof postVotingValidator>
