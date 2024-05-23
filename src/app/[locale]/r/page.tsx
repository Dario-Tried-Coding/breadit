import { redirect } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return redirect('/')
}

export default Page