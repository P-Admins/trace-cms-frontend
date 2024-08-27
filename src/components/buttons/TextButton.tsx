import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function TextButton({
  text,
  onClick,
  isDisabled,
  isLoading,
  className = '',
}: Props) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="bordered"
      className={`text-content1 border-none text-md px-4 py-5 h-[28px] hover:bg-default-200 ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}
