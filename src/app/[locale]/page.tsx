import SignoutBtn from '@/components/SignoutBtn'
import { auth } from '@/lib/next-auth'

export default async function Home() {
  const session = await auth()
  return (
    <main>
      {JSON.stringify(session?.user)}
      <br />
      {session?.user && <SignoutBtn />}
    </main>
  )
}
