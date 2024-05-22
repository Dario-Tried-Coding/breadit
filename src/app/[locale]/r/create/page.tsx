'use client'

import Card from '@/components/pages/Card'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { SUBREDDIT_CREATION_I18N_KEYS, SUBREDDIT_CREATION_I18N_PATH, SubredditCreationPayload, subredditCreationValidator } from '@/lib/validators/subreddit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const t = useTranslations('Pages.r.Create')
  const zodT = useTranslations(SUBREDDIT_CREATION_I18N_PATH)

  const router = useRouter()
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const { mutate: createSubreddit, isPending } = trpc.createSubreddit.useMutation({
    onSuccess(subredditName) {
      router.push(`/r/${subredditName}`)
    },
    onError(error) {
      if (error instanceof ZodError)
        return toast({
          title: t('Client.Errors.Toast.Zod.title'),
          description: t('Client.Errors.Toast.Zod.description'),
          variant: 'destructive',
        })

      if (error.data?.code === 'UNAUTHORIZED') return signInToast()

      if (error.data?.code === 'CONFLICT') {
        form.setError('name', {
          message: t('Client.Errors.Toast.Conflict.description')
        })

        return toast({
          title: t('Client.Errors.Toast.Conflict.title'),
          description: t('Client.Errors.Toast.Conflict.description'),
          variant: 'destructive',
        })
      }

      toast({
        title: t('Client.Errors.Toast.Generic.title'),
        description: t('Client.Errors.Toast.Generic.description'),
        variant: 'destructive',
      })
    },
  })

  const form = useForm<SubredditCreationPayload>({
    resolver: zodResolver(subredditCreationValidator),
    defaultValues: {
      name: '',
    },
  })

  const handleSubmit = (values: SubredditCreationPayload) => createSubreddit(values)

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card.Header>
            <Card.Header.Title>{t('heading')}</Card.Header.Title>
          </Card.Header>
          <Card.Separator />
          <Card.Content>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <Card.Form.Label className='flex flex-col'>
                    <Card.Form.Label.Name>{t('Fields.Name.label')}</Card.Form.Label.Name>
                    <Card.Form.Label.Description>{t('Fields.Name.description')}</Card.Form.Label.Description>
                  </Card.Form.Label>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-foreground-400'>r/</span>
                      <Input disabled={isPending} className='pl-6' {...field} />
                    </div>
                  </FormControl>
                  {form.formState.errors.name && <Card.Form.Message>{zodT(form.formState.errors.name.message as SUBREDDIT_CREATION_I18N_KEYS)}</Card.Form.Message>}
                </FormItem>
              )}
            />
          </Card.Content>
          <Card.Footer>
            <Button type='button' variant='secondary' disabled={isPending} onClick={() => router.back()}>
              {t('Footer.cancel')}
            </Button>
            <Button type='submit' disabled={isPending} isLoading={isPending}>
              {t('Footer.submit')}
            </Button>
          </Card.Footer>
        </form>
      </Card>
    </Form>
  )
}

export default Page
