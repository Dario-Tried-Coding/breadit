import { createRouteHandler } from 'uploadthing/next'

import { fileUploadRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: fileUploadRouter,
})
