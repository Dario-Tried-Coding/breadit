import ClientProviders from '@/components/providers/Providers.client'
import { Locale } from '@/config/i18n.config'
import { getAuthSession } from '@/lib/next-auth/cache'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'

interface ProvidersProps extends PropsWithChildren {
  locale: Locale
}

const Providers: FC<ProvidersProps> = async ({ children, locale }) => {
  const session = await getAuthSession()
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <ClientProviders>{children}</ClientProviders>
      </SessionProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
