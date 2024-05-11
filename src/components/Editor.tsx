'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { uploadFiles } from '@/lib/uploadthing'
import { PostCreationPayload, postCreationValidator } from '@/lib/validators/post'
import '@/styles/editor.css'
import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMounted } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface EditorProps {
  subredditId: string
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<EditorJS>()

  const router = useRouter()
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const isMounted = useMounted()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationPayload>({
    resolver: zodResolver(postCreationValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: {},
    },
  })

  const { mutate: publishPost, isPending } = trpc.publishPost.useMutation({
    onSuccess(postId) {
      router.push(`/r/${subredditId}/${postId}`)
    },
    onError(err) {
      if (err instanceof ZodError)
        return toast({
          title: 'Validation error',
          description: 'Please check the form for errors',
          variant: 'destructive',
        })

      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      if (err.data?.code === 'FORBIDDEN')
        return toast({
          title: 'You must be subscribed to post',
          description: 'Subscribe to the subreddit to post',
          variant: 'destructive',
        })
    },
  })

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
                      url: res.url,
                    },
                  }
                },
              },
            },
          },
          link: {
            class: Link,
            config: {
              endpoint: '/api/publish/link-preview',
            },
          },
        },
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

  const onSubmit = async (data: PostCreationPayload) => {
    const editorOutput = await editorRef.current?.save()

    if (!editorOutput) return

    const payload: PostCreationPayload = {
      title: data.title,
      content: editorOutput,
      subredditId,
    }
    publishPost(payload)
  }

  const { ref: _titleRef, ...rest } = register('title')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border bg-card p-4'>
      <input
        type='text'
        className='w-full text-5xl font-bold outline-none'
        placeholder='Title'
        ref={(e) => {
          _titleRef(e)
          titleRef.current = e
        }}
        {...rest}
      />
      <div id='editorjs' className='prose mt-4 min-h-[300px] max-w-full px-5' />
      <Button type='submit' size='lg' disabled={isPending} isLoading={isPending} className='w-full'>
        Publish
      </Button>
    </form>
  )
}

export default Editor
