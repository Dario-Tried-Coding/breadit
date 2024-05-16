'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Link } from '@/lib/next-intl/navigation'
import { User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface UserAccountNavProps {
  user: Pick<User, 'image' | 'name' | 'email'>
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const t = useTranslations('Components.Navbar.UserAccountNav')



  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={user.image!} alt={user.name ?? t('Trigger.alt')} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && <p className='w-[200px] truncate text-sm text-muted-foreground'>{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/'>{t('Content.feed')}</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/r/create'>{t('Content.create-community')}</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/settings'>{t('Content.settings')}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/auth/sign-in`,
            })
          }}
        >
          {t('Content.sign-out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
