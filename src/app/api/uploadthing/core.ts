import { getAuthSession } from '@/lib/next-auth/cache'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const fileUploadRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const session = await getAuthSession()
      if (!session?.user) throw new UploadThingError('UNAUTHORIZED')

      return { userId: session.user.id! }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type FileUploadRouter = typeof fileUploadRouter
