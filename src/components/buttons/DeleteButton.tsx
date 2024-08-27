import { Button } from '@nextui-org/react';

interface Props {
  text?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function DeleteButton({ text, onClick, isDisabled, isLoading, className }: Props) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      variant="ghost"
      color="danger"
      className={`text-lg rounded-[5px] font-extrabold leading-5 tracking-wide h-[54px] ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text || 'Delete'}
    </Button>
  );
}
