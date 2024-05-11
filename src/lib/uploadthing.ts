import { generateReactHelpers } from '@uploadthing/react'

import type { FileUploadRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = generateReactHelpers<FileUploadRouter>()
