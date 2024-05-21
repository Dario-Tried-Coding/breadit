'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageIcon, Link2, UserIcon } from 'lucide-react'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

interface MiniCreatePostProps {
  user: Session['user']
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ user }) => {
  const t = useTranslations('Components.MiniCreatePost')

  const pathname = usePathname()
  const router = useRouter()

  return (
    <li className='flex justify-between gap-6 overflow-hidden rounded-md bg-card px-6 py-4 shadow'>
      <div className='relative'>
        <Avatar>
          <AvatarImage src={user?.image!} alt={user?.name ?? t('alt')} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <span className='absolute right-0 top-0 h-3 w-3 rounded-full bg-success outline outline-2 outline-card' />
      </div>
      <Input readOnly onClick={() => router.push(pathname + '/publish')} placeholder={t('placeholder')} />
      <Button variant='ghost' size='icon' onClick={() => router.push(pathname + '/publish')} className='shrink-0'>
        <ImageIcon />
      </Button>
      <Button variant='ghost' size='icon' onClick={() => router.push(pathname + '/publish')} className='shrink-0'>
        <Link2 />
      </Button>
    </li>
  )
}

export default MiniCreatePost
