'use client'

import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Textarea } from '@/components/ui/Textarea'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { CommentCreationPayload, commentCreationValidator } from '@/lib/validators/comment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC, HTMLAttributes, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface WriteCommentProps extends Omit<HTMLAttributes<HTMLFormElement>, 'children'> {
  postId: string
  replyToId?: string
  mention?: string
  closeForm?: () => void
  autofocus?: boolean
  label?: boolean
}

// TODO: Blur form on submit -> hint: form.control.register('content').ref...
// TODO: Add mention support

const WriteComment: FC<WriteCommentProps> = ({ postId, replyToId, mention, closeForm, autofocus = true, label = false, className, ...rest }) => {
  const t = useTranslations('Components.Comment.Client')
  const router = useRouter()
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<CommentCreationPayload>({
    resolver: zodResolver(commentCreationValidator),
    defaultValues: {
      postId,
      replyToId,
      content: mention ? `@${mention} ` : '',
    },
  })

  const { mutate: createComment, isPending } = trpc.createComment.useMutation({
    onSuccess() {
      form.reset()
      closeForm?.()
      router.refresh()
    },
    onError(err) {
      if (err instanceof ZodError)
        return toast({
          title: t('Toasts.Zod.title'),
          description: t('Toasts.Zod.description'),
          variant: 'destructive',
        })

      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      if (err.data?.code === 'FORBIDDEN')
        return toast({
          title: t('Toasts.Forbidden.title'),
          description: t('Toasts.Forbidden.description'),
          variant: 'destructive',
        })

      toast({
        title: t('Toasts.Generic.title'),
        description: t('Toasts.Generic.description'),
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CommentCreationPayload) => {
    createComment(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef} className={cn('', className)} {...rest}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel>{t('UI.Form.label')}</FormLabel>}
              <FormControl>
                <Textarea
                  placeholder={t('UI.Form.placeholder')}
                  autoFocus={autofocus}
                  onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey && form.formState.isDirty) formRef.current?.requestSubmit()
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-2 flex items-center justify-end gap-2'>
          {closeForm && (
            <Button disabled={isPending} onClick={() => closeForm()} variant='secondary'>
              {t('UI.Form.cancel')}
            </Button>
          )}
          <Button type='submit' disabled={isPending || !form.formState.isDirty} isLoading={isPending}>
            {t('UI.Form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WriteComment
