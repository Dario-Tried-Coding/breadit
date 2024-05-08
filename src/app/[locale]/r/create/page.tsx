'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { SubredditCreationPayload, subredditCreationValidator } from '@/lib/validators/subreddit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const t = useTranslations('Pages.r.Create')
  const router = useRouter()
  const { toast } = useToast()
  const { signInToast } = useCustomToasts()

  const { mutate: createSubreddit, isPending } = trpc.createSubreddit.useMutation({
    onSuccess(subredditId) {
      router.push(`/r/${subredditId}`)
    },
    onError(error) {
      if (error instanceof ZodError)
        return toast({
          title: t('Client.Errors.Toast.Zod.title'),
          description: t('Client.Errors.Toast.Zod.description'),
          variant: 'destructive',
        })

      if (error.data?.code === 'UNAUTHORIZED') return signInToast()

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
      <Card className='mx-auto mt-8 max-w-4xl p-4'>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader className='p-0 pb-6 pt-2'>
            <CardTitle>{t('heading')}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className='p-0 pt-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex flex-col'>
                    <span className='text-lg'>{t('Fields.Name.label')}</span>
                    <span className='text-xs font-normal text-muted-foreground'>{t('Fields.Name.description')}</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-foreground-400'>r/</span>
                      <Input disabled={isPending} className='pl-6' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='flex justify-end gap-4 p-0 pt-4'>
            <Button type='button' variant='secondary' disabled={isPending} onClick={() => router.back()}>
              {t('Footer.cancel')}
            </Button>
            <Button type='submit' disabled={isPending || !form.formState.isValid} isLoading={isPending}>
              {t('Footer.submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  )
}

export default page
