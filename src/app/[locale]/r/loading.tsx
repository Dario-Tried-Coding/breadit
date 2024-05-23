import { Loader2 } from 'lucide-react'
import { FC } from 'react'

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className='mt-8 flex justify-center'>
      <Loader2 className='h-5 w-5 animate-spin' />
    </div>
  )
}

export default Loading
