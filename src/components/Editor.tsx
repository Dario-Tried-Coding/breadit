'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { uploadFiles } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { POST_CREATION_I18N_PATH, PostCreationPayload, postCreationValidator } from '@/lib/validators/post'
import '@/styles/editor.css'
import { I18nValues } from '@/types/utils'
import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMounted } from '@mantine/hooks'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface EditorProps {
  subredditId: string
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<EditorJS>()

  const zodT = useTranslations(POST_CREATION_I18N_PATH)
  const router = useRouter()
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const isMounted = useMounted()

  const [isEditorReady, setIsEditorReady] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<PostCreationPayload>({
    resolver: zodResolver(postCreationValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: {
        blocks: [],
        version: '2.29.1',
        time: Date.now(),
      },
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
          setIsEditorReady(true)
        },
        async onChange({ saver }) {
          const blocks = await saver.save()
          clearErrors('content')
          setValue('content', blocks)
        },
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
        setIsEditorReady(false)
      }
    }
  }, [isMounted, initEditor])

  const onSubmit = async (data: PostCreationPayload) => {
    const editorOutput = await editorRef.current?.save()

    if (!editorOutput || editorOutput.blocks.length === 0) return

    const payload: PostCreationPayload = {
      title: data.title,
      content: editorOutput,
      subredditId,
    }
    publishPost(payload)
  }

  const { ref: _titleRef, ...rest } = register('title')

  const firstError = Object.entries(errors)[0]?.[1]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg border bg-card p-4'>
      <input
        type='text'
        className={cn('w-full text-5xl font-bold outline-none')}
        placeholder='Title'
        ref={(e) => {
          _titleRef(e)
          titleRef.current = e
        }}
        {...rest}
      />
      <div id='editorjs' className='prose mt-4 min-h-[500px] max-w-full px-5' />
      <p className='mt-4 hidden text-sm text-muted-foreground md:block'>
        Use <kbd className='rounded-md border bg-muted px-1 text-sm uppercase'>/</kbd> to open the command menu.
      </p>
      {firstError && (
        <div className='mt-2 flex items-center rounded-md bg-destructive-100 px-4 py-2'>
          <AlertTriangle className='h-5 w-5 text-destructive-500' />
          &nbsp;
          <p className='text-sm text-destructive-500'>{zodT(firstError.message as I18nValues<typeof POST_CREATION_I18N_PATH>)}</p>
        </div>
      )}
      <Button type='submit' size='lg' disabled={isPending || !isEditorReady} isLoading={isPending} className='mt-2 w-full'>
        Publish
      </Button>
    </form>
  )
}

export default Editor
