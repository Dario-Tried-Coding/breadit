import { Button, ButtonProps } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DestructiveToastButtonProps extends ButtonProps {}
const DestructiveToastButton: React.FC<DestructiveToastButtonProps> = ({ className, variant = 'outline', ...rest }) => {
  return <Button className={cn('text-primary-foreground hover:bg-accent/20', className)} variant={variant} {...rest} />
}

export const Buttons = {
  Toasts: {
    Destructive: DestructiveToastButton,
  }
}