import { Button } from '@nextui-org/react';
import { cn } from '@/lib/cn';

interface Props {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function BlackTextButton({
  text,
  onClick,
  isDisabled,
  isLoading,
  className = '',
}: Props) {
  return (
    <Button
      variant="light"
      size="lg"
      className={cn(
        'rounded-[5px] font-extrabold h-[54px] data-[hover=true]:bg-default-100',
        className
      )}
      onClick={onClick}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}
