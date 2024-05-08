'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog'
import { FC, PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { REDIRECT_URL_COOKIE } from '@/config/auth.config'

interface layoutProps extends PropsWithChildren {}

const layout: FC<layoutProps> = ({ children }) => {
  const router = useRouter()
  const redirectUrl = parseCookies()[REDIRECT_URL_COOKIE]

  return (
    <Dialog defaultOpen onOpenChange={(isOpen) => (!isOpen ? router.push(redirectUrl) : null)}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default layout
