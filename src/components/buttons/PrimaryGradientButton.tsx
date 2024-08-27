import { Button } from '@nextui-org/react';
import { MouseEvent } from 'react';

interface Props {
  text: string;
  type?: 'reset' | 'button' | 'submit';
  onClick?: (e: MouseEvent) => void;
  variant?: 'dark' | 'light';
  isDisabled?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}

export default function PrimaryGradientButton({
  text,
  type,
  onClick,
  variant = 'dark',
  isDisabled,
  isLoading,
  startContent,
  endContent,
  className,
}: Props) {
  const darkClassNames = 'bg-gradient-main text-content1';
  const lightClassNames = 'bg-gradient-light text-black';

  return (
    <Button
      startContent={startContent}
      endContent={endContent}
      type={type}
      onClick={onClick}
      size="lg"
      className={`${variant === 'dark' ? darkClassNames : lightClassNames} text-lg rounded-[5px] font-extrabold leading-5 tracking-wide h-[54px] ${className}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}
