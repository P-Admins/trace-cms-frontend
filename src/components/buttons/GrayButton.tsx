import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function GrayButton({
  text,
  onClick,
  isDisabled,
  isLoading,
  className = '',
}: Props) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`bg-default-100 text-lg rounded-[5px] leading-5 tracking-wide h-[54px] font-extrabold ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}
