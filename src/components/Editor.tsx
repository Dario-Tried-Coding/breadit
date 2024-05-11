'use client'

import { Button } from '@/components/ui/Button'
import { uploadFiles } from '@/lib/uploadthing'
import '@/styles/editor.css'
import EditorJS from '@editorjs/editorjs'
import { useMounted } from '@mantine/hooks'
import { FC, useCallback, useEffect, useRef } from 'react'

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<EditorJS>()

  const isMounted = useMounted()

  const initEditor = useCallback(async () => {
    const EditorJs = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const Link = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const Image = (await import('@editorjs/image')).default

    if (!editorRef.current) {
      const editor = new EditorJs({
        onReady() {
          editorRef.current = editor
        },
        minHeight: 16,
        placeholder: 'Write your post here...',
        inlineToolbar: true,
        tools: {
          header: Header,
          embed: Embed,
          table: Table,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles('imageUploader', { files: [file] })

                  return {
                    success: 1,
                    file: {
                      url: res.url
                    }
                  }
                }
              }
            }
          },
          link: {
            class: Link,
            config: {
              endpoint: '/api/publish/link-preview'
            }
          }
        }
      })
    }
  }, [])

  // Initialize editor on mount
  useEffect(() => {
    const init = async () => {
      await initEditor()
      
      setTimeout(() => {
        titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        editorRef.current?.destroy()
      }
    }
  }, [isMounted, initEditor])

  return (
    <form className='rounded-lg border bg-card p-4'>
      <input type='text' className='w-full text-5xl font-bold outline-none' placeholder='Title' ref={titleRef} />
      <div id='editorjs' className='mt-4 min-h-[300px] px-5 prose max-w-full' />
      <Button type='submit' size='lg' className='w-full'>Publish</Button>
    </form>
  )
}

export default Editor
