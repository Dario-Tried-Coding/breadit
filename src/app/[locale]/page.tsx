import SignoutBtn from '@/components/SignoutBtn'
import {getAuthSession} from '@/lib/next-auth/cache'

export default async function Home() {
  const session = await getAuthSession()
  return (
    <main>
      {JSON.stringify(session?.user)}
      <br />
      {session?.user && <SignoutBtn />}
    </main>
  )
}
