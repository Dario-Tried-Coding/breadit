import { SignIn } from '@/components/pages/SignIn'
import { getAuthSession } from '@/lib/next-auth/cache'
import { redirect } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession()

  if (session) return redirect('/')

  return (
    <SignIn />
  )
}

export default page
