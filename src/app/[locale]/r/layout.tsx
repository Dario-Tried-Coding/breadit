import { FC, PropsWithChildren } from 'react'

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({children}) => {
  return children
}

export default Layout