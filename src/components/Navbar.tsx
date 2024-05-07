import { SignIn } from '@/components/auth/AuthLinks'
import { Icons } from '@/components/Icons'
import { Link } from '@/lib/next-intl/navigation'
import { FC } from 'react'
import { getAuthSession } from '@/lib/next-auth/cache'
import UserAccountNav from '@/components/UserAccountNav'
import { getTranslations } from 'next-intl/server'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await getAuthSession()
  const t = await getTranslations('Project')

  return (
    <div className='fixed inset-x-0 top-0 h-12 border-b bg-background-100'>
      <div className='container flex h-full items-center justify-between gap-2 md:px-8'>
        <Link href='/' className='flex items-center gap-2 outline-offset-4'>
          <Icons.logo className='h-8 w-8 md:h-6 md:w-6' />
          <p className='hidden text-sm font-medium text-foreground-700 md:block'>{t('title')}</p>
        </Link>

        {session?.user ? <UserAccountNav user={session.user}  /> : <SignIn size='sm' />}
      </div>
    </div>
  )
}

export default Navbar
