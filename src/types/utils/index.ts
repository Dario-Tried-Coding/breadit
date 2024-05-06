import { Locale } from '@/config/i18n.config'
import { LinkProps as NextLink_Props } from 'next/link'
import { AnchorHTMLAttributes, RefAttributes } from 'react'

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLink_Props | 'children'>,
    NextLink_Props,
    Omit<RefAttributes<HTMLAnchorElement>, 'children'> {}

export type I18nLinkProps = Omit<LinkProps, 'href'> & { locale?: Locale }