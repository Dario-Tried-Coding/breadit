'use client'

import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Textarea } from '@/components/ui/Textarea'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { CommentCreationPayload, commentCreationValidator } from '@/lib/validators/comment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FC, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface WriteCommentProps {
  postId: string
  replyToId?: string
  mention?: string
  closeForm?: () => void
}

const WriteComment: FC<WriteCommentProps> = ({ postId, replyToId, mention, closeForm }) => {
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
          title: 'Comment content not valid',
          description: 'Please make sure your comment is not empty and does not exceed 1.000 characters',
          variant: 'destructive',
        })

      if (err.data?.code === 'UNAUTHORIZED') return signInToast()

      toast({
        title: 'An error occurred',
        description: 'Please try again later',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CommentCreationPayload) => {
    createComment(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Write here your reply...'
                    autoFocus
                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey && form.formState.isDirty) formRef.current?.requestSubmit()
                    }}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-2 flex items-center justify-end gap-2'>
          {closeForm && (
            <Button disabled={isPending} onClick={() => closeForm()} variant='secondary'>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending || !form.formState.isDirty} isLoading={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WriteComment
