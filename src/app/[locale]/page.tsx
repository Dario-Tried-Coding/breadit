import SignoutBtn from '@/components/SignoutBtn'
import { getAuthSession } from '@/lib/next-auth/cache'
import { Link } from '@/lib/next-intl/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession()

  return (
    <div>
      main
      {session?.user && (
        <span>
          <pre>{JSON.stringify(session.user)}</pre>
          <SignoutBtn />
        </span>
      )}
    </div>
  )
}

export default page
