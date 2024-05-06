import { Locale } from '@/config/i18n.config'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
  params: { locale: Locale }
}

export async function generateMetadata({ params: { locale } }: Omit<Props, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'Project.Metadata' })

  return {
    title: t('title'),
    description: t('description')
  } as Metadata
}

export default function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
