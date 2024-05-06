import { SignIn } from '@/components/AuthLinks'
import { Icons } from '@/components/Icons'
import { auth } from '@/lib/next-auth'
import { Link } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await auth()

  return (
    <div className='fixed inset-x-0 top-0 h-12 border-b bg-background-100'>
      <div className='container flex h-full items-center justify-between gap-2 md:px-8'>
        <Link href='/' className='flex items-center gap-2'>
          <Icons.logo className='h-8 w-8 md:h-6 md:w-6' />
          <p className='hidden text-sm font-medium text-foreground-700 md:block'>Breadit</p>
        </Link>

        {session?.user ? <div>user nav</div> : <SignIn size='sm' />}
      </div>
    </div>
  )
}

export default Navbar
