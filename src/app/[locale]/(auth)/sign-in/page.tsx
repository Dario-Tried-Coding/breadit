import SignIn from '@/components/pages/SignIn'
import { buttonVariants } from '@/components/ui/Button'
import { Locale } from '@/config/i18n.config'
import { Link } from '@/lib/next-intl/navigation'
import { ChevronLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
  }
}

const page: FC<pageProps> = async ({ params: { locale } }) => {
  const t = await getTranslations({ namespace: 'Index.Link', locale })

  return (
    <>
      <Link href='/' className={buttonVariants({ variant: 'ghost', className: 'absolute left-4 top-24 space-x-2 md:left-12 md:top-32' })}>
        <ChevronLeft className='h-4 w-4' />
        {t('home')}
      </Link>
      <SignIn />
    </>
  )
}

export default page
