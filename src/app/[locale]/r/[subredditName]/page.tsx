import { sleep } from '@/helpers'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({ }) => {
  await sleep(5000)

  return (
    <>page</>
  )
}
export default page
