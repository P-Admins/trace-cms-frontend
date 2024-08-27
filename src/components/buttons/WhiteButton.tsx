import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  startContent?: JSX.Element;
}

export default function WhiteButton({
  text,
  onClick,
  isDisabled,
  isLoading,
  startContent,
  className,
}: Props) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`bg-content1 text-default-500 text-lg rounded-[5px] leading-5 tracking-wide h-[54px] ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
      startContent={startContent}
    >
      {text}
    </Button>
  );
}
