import { buttonVariants } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { Link } from '@/lib/next-intl/navigation'
import { useTranslations } from 'next-intl'

export const useCustomToasts = () => {
  const t = useTranslations('Auth')

  const signInToast = () => {
    const { dismiss } = toast({
      title: t('Errors.Toast.SignInToast.title'),
      description: t('Errors.Toast.SignInToast.description'),
      variant: 'destructive',
      action: (
        <Link href='/sign-in' className={buttonVariants({variant: 'outline', className: 'text-primary-foreground hover:bg-accent/20'})} onClick={() => dismiss()}>
          {t('CTA.sign-in')}
        </Link>
      ),
    })
  }

  return { signInToast }
}
