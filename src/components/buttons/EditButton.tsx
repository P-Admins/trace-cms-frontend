import { Button, ButtonProps } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/cn';

interface Props extends ButtonProps {
  className?: string;
}

export default function EditButton({ className = '', ...props }: Props) {
  return (
    <Button
      isIconOnly
      variant="faded"
      aria-label="Edit"
      radius="full"
      className={cn('h-6 w-6 text-sm min-w-0', className)}
      {...props}
    >
      <Icon icon="solar:pen-linear" />
    </Button>
  );
}
