import { edjsParser } from '@/lib/editor-js'
import { cn } from '@/lib/utils'
import { OutputData } from '@editorjs/editorjs'
import { Post } from '@prisma/client'
import { Interweave } from 'interweave'
import { FC, HTMLAttributes } from 'react'

type EditorOutputProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & ({ parsedOutput: string } | { output: Post['content'] })

const EditorOutput: FC<EditorOutputProps> = ({ className, ...rest }) => {
  let content
  if ('parsedOutput' in rest) content = rest.parsedOutput
  else {
    const parsedContent = edjsParser.parse(rest.output as unknown as OutputData).join('')
    content = parsedContent
  }

  return <Interweave content={content} className={cn('prose prose-sm', className)} {...rest} />
}

export default EditorOutput
