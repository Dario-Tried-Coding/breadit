import { headingParser } from '@/lib/utils/editor-js-parsers/heading-parser'
import { linkParser } from '@/lib/utils/editor-js-parsers/link-parser'
import { tableParser } from '@/lib/utils/editor-js-parsers/table-parses'
import edjsHTML from 'editorjs-html'

export const edjsParser = edjsHTML({
  link: linkParser,
  header: headingParser,
  table: tableParser,
})
