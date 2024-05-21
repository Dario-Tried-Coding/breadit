import SettingsForm from '@/components/SettingsForm'
import { getAuthSession } from '@/lib/next-auth/cache'
import { redirect } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession()

  if (!session || !session.user) return redirect('/auth/sign-in')
  
  return <SettingsForm user={session.user} />
}

export default page
