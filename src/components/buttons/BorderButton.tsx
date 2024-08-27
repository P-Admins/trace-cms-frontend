import { Button } from '@nextui-org/react';

interface Props {
  text?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function BorderButton({ text, onClick, isDisabled, isLoading, className }: Props) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="bordered"
      className={`text-lg rounded-full text-default-500 py-1 px-6 border-[1px] border-default-500 ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}
