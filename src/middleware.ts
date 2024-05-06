import { auth } from '@/lib/next-auth'
import { i18nMiddleware } from '@/lib/next-intl/middleware'

export default auth((req) => {
  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
