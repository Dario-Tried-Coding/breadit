import { FC, HTMLAttributes } from 'react'
import { CardContent, CardHeader, Card as Card_UI, CardTitle, CardFooter } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/Separator'
import { FormLabel, FormMessage } from '@/components/ui/Form'

interface Header_Comp_Props extends HTMLAttributes<HTMLDivElement> {}
const Header_Comp: FC<Header_Comp_Props> = ({ className, ...rest }) => {
  return <CardHeader className={cn('p-0 pb-6 pt-2', className)} {...rest} />
}

interface Header_Props extends FC<Header_Comp_Props> {
  Title: typeof CardTitle
}
const Header: Header_Props = Object.assign(Header_Comp, {
  Title: CardTitle,
})

interface Content_Comp_Props extends HTMLAttributes<HTMLDivElement> {}
const Content_Comp: FC<Content_Comp_Props> = ({ className, ...rest }) => {
  return <CardContent className={cn('p-0 pt-4', className)} {...rest} />
}

interface Label_Comp_Props extends HTMLAttributes<HTMLLabelElement> {}
const Label_Comp: FC<Label_Comp_Props> = ({ className, ...rest }) => {
  return <FormLabel className={cn('flex flex-col', className)} {...rest} />
}

interface Label_Name_Comp_Props extends HTMLAttributes<HTMLSpanElement> {}
const Label_Name_Comp: FC<Label_Name_Comp_Props> = ({ className, ...rest }) => {
  return <span className={cn('text-lg', className)} {...rest} />
}

interface Label_Description_Comp_Props extends HTMLAttributes<HTMLSpanElement> {}
const Label_Description_Comp: FC<Label_Description_Comp_Props> = ({ className, ...rest }) => {
  return <span className={cn('text-xs font-normal text-muted-foreground', className)} {...rest} />
}

interface Label_Props extends FC<Label_Comp_Props> {
  Name: FC<Label_Name_Comp_Props>
  Description: FC<Label_Description_Comp_Props>
}
const Label: Label_Props = Object.assign(Label_Comp, {
  Name: Label_Name_Comp,
  Description: Label_Description_Comp,
})

interface Message_Comp_Props extends HTMLAttributes<HTMLParagraphElement> { }
const Message_Comp: FC<Message_Comp_Props> = ({ className, ...rest }) => {
  return <p className={cn('text-destructive-400 text-sm mt-2', className)} {...rest} />
}

interface Footer_Comp_Props extends HTMLAttributes<HTMLDivElement> { }
const Footer_Comp: FC<Footer_Comp_Props> = ({ className, ...rest }) => {
  return <CardFooter className={cn('flex justify-end gap-4 p-0 pt-4', className)} {...rest} />
}

interface Card_Comp_Props extends HTMLAttributes<HTMLDivElement> {}
const Card_Comp: FC<Card_Comp_Props> = ({ className, ...rest }) => {
  return <Card_UI className={cn('mx-auto mt-8 max-w-4xl p-4', className)} {...rest} />
}

interface Card_Props extends FC<Card_Comp_Props> {
  Header: Header_Props
  Separator: typeof Separator
  Content: FC<Content_Comp_Props>
  Form: {
    Label: Label_Props
    Message: FC<Message_Comp_Props>
  },
  Footer: FC<Footer_Comp_Props>
}
const Card: Card_Props = Object.assign(Card_Comp, {
  Header: Header,
  Separator: Separator,
  Content: Content_Comp,
  Form: {
    Label: Label,
    Message: Message_Comp,
  },
  Footer: Footer_Comp,
})
export default Card
