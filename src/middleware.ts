import { DEFAULT_REDIRECT_URL } from '@/config/auth.config'
import { getLocalePrefix } from '@/helpers/routing'
import { auth } from '@/lib/next-auth'
import { i18nMiddleware } from '@/lib/next-intl/middleware'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const localePrefix = getLocalePrefix(nextUrl.pathname)

  // if (nextUrl.pathname.startsWith('/sign-in') && isLoggedIn) return Response.redirect(new URL(`${localePrefix}${DEFAULT_REDIRECT_URL}`))

  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
