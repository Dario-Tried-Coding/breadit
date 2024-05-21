'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog'
import { FC, PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { REDIRECT_URL_COOKIE } from '@/config/auth.config'

interface layoutProps extends PropsWithChildren {}

const Layout: FC<layoutProps> = ({ children }) => {
  const router = useRouter()
  const redirectUrl = parseCookies()[REDIRECT_URL_COOKIE]

  return (
    <Dialog defaultOpen onOpenChange={(isOpen) => (!isOpen ? router.push(redirectUrl) : null)}>
      <DialogContent className='pb-8 pt-12'>
        <div className='container flex max-w-sm flex-col items-center gap-2 text-center'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default Layout
