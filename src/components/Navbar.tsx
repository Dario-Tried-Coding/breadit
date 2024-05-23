import { Icons } from '@/components/Icons'
import SearchBar from '@/components/SearchBar'
import UserAccountNav from '@/components/UserAccountNav'
import { AuthLinks } from '@/components/auth/AuthLinks'
import { getAuthSession } from '@/lib/next-auth/cache'
import { Link } from '@/lib/next-intl/navigation'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await getAuthSession()
  const t = await getTranslations()

  return (
    <div className='fixed inset-x-0 top-0 z-10 h-12 border-b bg-background-100'>
      <div className='container flex h-full items-center justify-between gap-2 md:px-8'>
        <Link href='/' className='flex items-center gap-2 outline-offset-4'>
          <Icons.logo className='h-8 w-8 md:h-6 md:w-6' />
          <p className='hidden text-sm font-medium text-foreground-700 md:block'>{t('Project.title')}</p>
        </Link>

        <div className='my-1.5 flex max-w-2xl flex-1 items-start self-stretch'>
          <SearchBar />
        </div>

        {session?.user ? <UserAccountNav user={session.user} /> : <AuthLinks.SignIn size='sm' />}
      </div>
    </div>
  )
}

export default Navbar
