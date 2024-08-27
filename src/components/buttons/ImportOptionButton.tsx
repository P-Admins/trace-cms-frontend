import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  icon?: React.ReactNode;
  secondaryText?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
}
export default function ImportOptionButton({
  text,
  icon,
  secondaryText,
  onClick,
  isDisabled,
  className = '',
}: Props) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="light"
      className={`rounded-[12px] py-[4px] px-[20px] h-[159px] text-content1 flex flex-col text-default-900 text-xl w-[293px] bg-background ${className}`}
      isDisabled={isDisabled}
    >
      {icon}
      {text}
      {secondaryText && <span className="text-default-500 text-xl">{secondaryText}</span>}
    </Button>
  );
}
