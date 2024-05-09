import { FC } from 'react'

interface pageProps {
  params: {
    locale: string
    subredditId: string
  }
}

const page: FC<pageProps> = ({ params: { locale, subredditId } }) => {
  return <div>page</div>
}

export default page
