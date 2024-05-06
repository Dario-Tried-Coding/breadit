import { signOut } from '@/actions/auth'
import { FC } from 'react'

interface SignoutBtnProps {}

const SignoutBtn: FC<SignoutBtnProps> = ({}) => {
  return (
    <form action={signOut}>
      <button type='submit'>Sign out</button>
    </form>
  )
}

export default SignoutBtn
