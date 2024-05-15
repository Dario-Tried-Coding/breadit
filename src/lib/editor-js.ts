import { headingParser, linkParser, tableParser } from '@/lib/utils/editorjs-parser'
import edjsHTML from 'editorjs-html'

export const edjsParser = edjsHTML({
  link: linkParser,
  header: headingParser,
  table: tableParser,
})