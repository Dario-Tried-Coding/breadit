import { FC, PropsWithChildren } from 'react'

interface layoutProps extends PropsWithChildren {}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className='container relative flex h-[calc(100vh-3rem)] max-w-4xl items-center justify-center p-4 md:p-8'>
      <div className='container max-w-sm text-center flex flex-col items-center gap-2'>{children}</div>
    </div>
  )
}

export default layout
