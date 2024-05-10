import { cn } from '@/lib/utils'
import { Children, FC, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

interface TitleProps extends PropsWithChildren, HTMLAttributes<HTMLHeadingElement> {}
const Heading: FC<TitleProps> = ({ children, className, ...props }) => {
  return (
    <h1 className={cn('text-3xl font-bold md:text-4xl', className)} {...props}>
      {children}
    </h1>
  )
}

interface LayoutProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}
const Layout: FC<LayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('grid grid-cols-1 gap-y-6 py-6 md:grid-cols-3 md:gap-x-4', className)} {...props}>
      {children}
    </div>
  )
}

interface InfoProps extends HTMLAttributes<HTMLDivElement> {}
const InfoComp: FC<InfoProps> = ({ className, children, ...props }) => {
  const [heading, ...body] = Children.toArray(children)

  return (
    <div className={cn('order-first h-fit overflow-hidden rounded-lg border border-border-200 md:order-last', className)} {...props}>
      {heading}
      <div className='px-6 py-4 bg-card'>{body}</div>
    </div>
  )
}

interface InfoHeaderProps extends HTMLAttributes<HTMLDivElement> {}
const InfoHeading: FC<InfoHeaderProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cn('bg-brand px-6 py-4', className)} {...rest}>
      <h3 className='flex items-center gap-1.5 py-3 font-semibold' {...rest}>
        {children}
      </h3>
    </div>
  )
}

interface InfoItemListProps extends HTMLAttributes<HTMLDListElement> { }
const InfoItemList: FC<InfoItemListProps> = ({ children, className, ...rest }) => {
  return (
    <dl className={cn('divide-y divide-border text-sm leading-6', className)} {...rest}>
      {children}
    </dl>
  )
}

interface InfoItemProps extends HTMLAttributes<HTMLDivElement> {}
const InfoItemComp: FC<InfoItemProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cn('flex justify-between gap-x-4 py-3 text-foreground-500', className)} {...rest}>
      {children}
    </div>
  )
}

interface InfoItemTermProps extends HTMLAttributes<HTMLDListElement> {}
const InfoItemTerm: FC<InfoItemTermProps> = ({ children, className, ...rest }) => {
  return (
    <dt className={cn(className)} {...rest}>
      {children}
    </dt>
  )
}

interface InfoItemDescriptionProps extends HTMLAttributes<HTMLDListElement> {}
const InfoItemDescription: FC<InfoItemDescriptionProps> = ({ children, className, ...rest }) => {
  return (
    <dd className={cn('flex items-start gap-x-2 text-foreground-900', className)} {...rest}>
      {children}
    </dd>
  )
}

interface InfoItem extends FC<InfoItemProps> {
  Term: typeof InfoItemTerm
  Description: typeof InfoItemDescription
}
const InfoItem: InfoItem = Object.assign(InfoItemComp, { Term: InfoItemTerm, Description: InfoItemDescription})

interface InfoFooter extends HTMLAttributes<HTMLDivElement> {}
const InfoFooter: FC<InfoFooter> = ({ className, children, ...rest }) => {
  return <div className={cn('mb-4 mt-2 space-y-2', className)} {...rest}>{children}</div>
}

interface Info extends FC<InfoProps> {
  Heading: typeof InfoHeading
  List: typeof InfoItemList
  Item: typeof InfoItem
  Footer: typeof InfoFooter
}
const Info: Info = Object.assign(InfoComp, { Heading: InfoHeading, List: InfoItemList, Item: InfoItem, Footer: InfoFooter })

interface FeedProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}
const FeedComp: FC<FeedProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

interface Feed extends FC<FeedProps> {
  Heading: typeof Heading
  Layout: typeof Layout
  Info: typeof Info
}
export const Feed: Feed = Object.assign(FeedComp, { Heading, Layout, Info })
