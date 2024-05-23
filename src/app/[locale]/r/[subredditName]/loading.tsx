import { Loader2 } from 'lucide-react'
import { FC } from 'react'

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return <div className='col-span-2 flex items-center justify-center'><Loader2 className='h-5 w-5 animate-spin' /></div>
}

export default Loading