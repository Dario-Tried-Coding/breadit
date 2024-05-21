'use client'

import Card from '@/components/pages/Card'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { USERNAME_CHANGE_I18N_PATH, USERNAME_CHANGE_I18N_KEYS, UsernameChangePayload, usernameChangeValidator } from '@/lib/validators/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Session, User } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

interface SettingsFormProps {
  user: User
}

const SettingsForm: FC<SettingsFormProps> = ({user}) => {
  const t = useTranslations('Pages.Settings.Client')
  const zodT = useTranslations(USERNAME_CHANGE_I18N_PATH)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<UsernameChangePayload>({
    resolver: zodResolver(usernameChangeValidator),
    defaultValues: {
      username: user.username,
    },
  })

  const { mutate: updateUsername, isPending } = trpc.changeUsername.useMutation({
    onSuccess(_, { username }) {
      form.reset({ username })
      toast({
        title: t('Toasts.Success.title'),
        description: t('Toasts.Success.description'),
      })
      router.refresh()
    },
    onError(error) {
      if (error.data?.code === 'CONFLICT') {
        return toast({
          title: t('Toasts.UsernameAlreadyExists.title'),
          description: t('Toasts.UsernameAlreadyExists.description'),
          variant: 'destructive',
        })
      }

      toast({
        title: t('Toasts.GenericError.title'),
        description: t('Toasts.GenericError.description'),
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = (data: UsernameChangePayload) => updateUsername(data)

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card.Header>
            <Card.Header.Title>{t('UI.heading')}</Card.Header.Title>
          </Card.Header>
          <Card.Separator />
          <Card.Content>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <Card.Form.Label>
                    <Card.Form.Label.Name>{t('UI.Fields.Username.label')}</Card.Form.Label.Name>
                    <Card.Form.Label.Description>{t('UI.Fields.Username.description')}</Card.Form.Label.Description>
                  </Card.Form.Label>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 flex w-8 items-center justify-center text-sm text-muted-foreground'>u/</span>
                      <Input disabled={isPending} className='pl-6' {...field} />
                    </div>
                  </FormControl>
                  {form.formState.errors.username && (
                    <Card.Form.Message>{zodT(form.formState.errors.username?.message as USERNAME_CHANGE_I18N_KEYS)}</Card.Form.Message>
                  )}
                </FormItem>
              )}
            />
          </Card.Content>
          <Card.Footer>
            <Button type='submit' disabled={isPending || !form.formState.isDirty} isLoading={isPending}>{t(isPending ? 'UI.Buttons.saving' : 'UI.Buttons.submit')}</Button>
          </Card.Footer>
        </form>
      </Card>
    </Form>
  )
}

export default SettingsForm