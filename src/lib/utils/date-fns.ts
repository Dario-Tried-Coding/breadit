import { Locale } from '@/config/i18n.config'
import { formatDistanceToNowStrict } from 'date-fns'

export async function formatTimeToNow(date: Date, localePrefix: Locale): Promise<string> {
  const locale = (await import('date-fns/locale'))[localePrefix]

  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale,
  })
}
