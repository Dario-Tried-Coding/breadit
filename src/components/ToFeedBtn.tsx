'use client'

import { buttonVariants } from '@/components/ui/Button'
import { Link } from '@/lib/next-intl/navigation'
import { cn } from '@/lib/utils'
import { I18nLinkProps } from '@/types/utils'
import { VariantProps } from 'class-variance-authority'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface ToFeedBtnProps extends VariantProps<typeof buttonVariants>, I18nLinkProps {}

const ToFeedBtn: FC<ToFeedBtnProps> = ({ size, variant = 'ghost', className, ...props }) => {
  const t = useTranslations('Index.Link')
  const pathname = usePathname()

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom
  const subredditPath = getSubredditPath(pathname)

  return (
    <Link href={subredditPath} className={cn(buttonVariants({ size, variant }), className)} {...props}>
      <ChevronLeft className='h-4 w-4' />
      {subredditPath === '/' ? t('back-home') : t('back-to-community')}
    </Link>
  )
}

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/' as const
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}` as const
  else return '/' as const
}

export default ToFeedBtn
