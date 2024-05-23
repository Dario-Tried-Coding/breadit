import { SignUp } from '@/components/pages/SignUp'
import { getAuthSession } from '@/lib/next-auth/cache'
import { redirect } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession()

  if (session) return redirect('/')

  return <SignUp />
}

export default page
