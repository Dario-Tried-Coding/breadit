'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog'
import { FC, PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'

interface layoutProps extends PropsWithChildren {}

const layout: FC<layoutProps> = ({ children }) => {
  const router = useRouter()

  return (
    <Dialog defaultOpen onOpenChange={(isOpen) => (!isOpen ? router.push('/') : null)}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default layout
