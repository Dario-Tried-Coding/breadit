'use client'

import { Button } from '@/components/ui/Button'
import { Buttons } from '@/components/utils/Buttons'
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
import { Subreddit } from '@prisma/client'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface EditorProps {
  subreddit: Pick<Subreddit, 'id' | 'name'>
}

const Editor: FC<EditorProps> = ({ subreddit: { id: subredditId, name: subredditName } }) => {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<EditorJS>()

  const t = useTranslations('Components.Editor')
  const zodT = useTranslations(POST_CREATION_I18N_PATH)
  const joinT = useTranslations('Components.JoinLeaveBtn')

  const router = useRouter()
  const { toast, dismiss } = useToast()
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
      toast({
        title: t('Toasts.Success.title'),
        description: t('Toasts.Success.description'),
      })
      router.push(`/r/${subredditName}/${postId}`)
    },
    onError(err) {
      if (err instanceof ZodError)
        return toast({
          title: t('Toasts.Errors.Validation.title'),
          description: t('Toasts.Errors.Validation.description'),
          variant: 'destructive',
        })

      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      if (err.data?.code === 'FORBIDDEN')
        return toast({
          title: t('Toasts.Errors.Forbidden.title'),
          description: t('Toasts.Errors.Forbidden.description'),
          variant: 'destructive',
          action: (
            <Buttons.Toasts.Destructive onClick={() => joinSubreddit({ subredditId })} disabled={isJoiningPending} isLoading={isJoiningPending}>
              {joinT('join')}
            </Buttons.Toasts.Destructive>
          ),
        })

      return toast({
        title: t('Toasts.Errors.Generic.title'),
        description: t('Toasts.Errors.Generic.description'),
        variant: 'destructive',
      })
    },
  })

  const { mutate: joinSubreddit, isPending: isJoiningPending } = trpc.joinLeaveSubreddit.useMutation({
    onSuccess() {
      dismiss()
      router.refresh()
      toast({
        title: joinT('Toasts.Subscribed.title'),
        description: joinT('Toasts.Subscribed.description', { subredditName }),
      })
    },
    onError() {
      return toast({
        title: joinT('Toasts.GenericError.title'),
        description: joinT('Toasts.GenericError.description', { action: 'join' }),
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
        placeholder: t('placeholder'),
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
        i18n: {
          messages: {
            ui: {
              blockTunes: {
                toggler: {
                  'Click to tune': t('I18n.UI.BlockTunes.click-to-tune'),
                  'or drag to move': t('I18n.UI.BlockTunes.or-drag'),
                },
              },
              inlineToolbar: {
                converter: {
                  'Convert to': t('I18n.UI.InlineToolbar.convert-to'),
                },
              },
              toolbar: {
                toolbox: {
                  Add: t('I18n.UI.Toolbar.Toolbox.add'),
                },
              },
              popover: {
                Filter: t('I18n.UI.Toolbar.Popover.filter'),
                'Nothing found': t('I18n.UI.Toolbar.Popover.nothing-found'),
              },
            },
            toolNames: {
              Text: t('I18n.ToolNames.text'),
              Heading: t('I18n.ToolNames.heading'),
              List: t('I18n.ToolNames.list'),
              Code: t('I18n.ToolNames.code'),
              Embed: t('I18n.ToolNames.embed'),
              Table: t('I18n.ToolNames.table'),
              Link: t('I18n.ToolNames.link'),
              InlineCode: t('I18n.ToolNames.inline-code'),
              Bold: t('I18n.ToolNames.bold'),
              Italic: t('I18n.ToolNames.italic'),
            },
            blockTunes: {
              delete: {
                Delete: t('I18n.BlockTunes.delete'),
                'Click to delete': t('I18n.BlockTunes.click-to-delete'),
              },
              moveUp: {
                'Move up': t('I18n.BlockTunes.move-up'),
              },
              moveDown: {
                'Move down': t('I18n.BlockTunes.move-down'),
              },
            },
            tools: {
              table: {
                'Add column to left': t('I18n.Tools.Table.add-column-to-left'),
                'Add column to right': t('I18n.Tools.Table.add-column-to-right'),
                'Add row above': t('I18n.Tools.Table.add-row-above'),
                'Add row below': t('I18n.Tools.Table.add-row-below'),
                'Delete column': t('I18n.Tools.Table.delete-column'),
                'Delete row': t('I18n.Tools.Table.delete-row'),
                'With headings': t('I18n.Tools.Table.with-headings'),
                'Without headings': t('I18n.Tools.Table.without-headings'),
              },
              list: {
                Unordered: t('I18n.Tools.List.unordered'),
                Ordered: t('I18n.Tools.List.ordered'),
              },
              image: {
                Caption: t('I18n.Tools.Image.caption'),
                'With border': t('I18n.Tools.Image.with-border'),
                'Stretch image': t('I18n.Tools.Image.stretch-image'),
                'With background': t('I18n.Tools.Image.with-background'),
              },
            },
          },
        },
      })
    }
  }, [clearErrors, setValue, t])

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
        placeholder={t('title')}
        ref={(e) => {
          _titleRef(e)
          titleRef.current = e
        }}
        {...rest}
      />
      <div id='editorjs' className='prose mt-4 min-h-[500px] max-w-full pl-12 pr-5' />
      <p className='mt-4 hidden text-sm text-muted-foreground md:block'>
        {t.rich('suggestion', { kbd: (chunks) => <kbd className='rounded-md border bg-muted px-1 text-sm uppercase'>{chunks}</kbd> })}
      </p>
      {firstError && (
        <div className='mt-2 flex items-center rounded-md bg-destructive-100 px-4 py-2'>
          <AlertTriangle className='h-5 w-5 text-destructive-500' />
          &nbsp;
          <p className='text-sm text-destructive-500'>{zodT(firstError.message as I18nValues<typeof POST_CREATION_I18N_PATH>)}</p>
        </div>
      )}
      <Button type='submit' size='lg' disabled={isPending || !isEditorReady || isJoiningPending} isLoading={isPending} className='mt-2 w-full'>
        {t('submit')}
      </Button>
    </form>
  )
}

export default Editor
