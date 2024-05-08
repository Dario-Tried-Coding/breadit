import { REDIRECT_URL_COOKIE } from '@/config/auth.config'
import { auth } from '@/lib/next-auth'
import { i18nMiddleware } from '@/lib/next-intl/middleware'

export default auth((req) => {
  const redirectUrl = req.headers.get('referer') || req.nextUrl.href
  console.log(req.headers.get('referer'), req.nextUrl.href)
  
  const res = i18nMiddleware(req)
  
  res.cookies.set(REDIRECT_URL_COOKIE, redirectUrl)

  return res
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
