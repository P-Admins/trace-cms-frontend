import { MouseEvent } from 'react';
import { Button } from '@nextui-org/react';
import ChevronUpIcon from '@icons/ChevronUp.svg?react';

interface Props {
  onClick?: (e: MouseEvent) => void;
  isDisabled?: boolean;
  className?: string;
}

export default function BackButton({ onClick, isDisabled, className = '' }: Props) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="bordered"
      className={`rounded-[5px] text-content1 border-default-300 border-[1px] text-md pr-[14px] pl-2 pt-[4px] pb-[2px] h-[28px] gap-1.5 ${className}`}
      isDisabled={isDisabled}
      startContent={
        <div className="rotate-[270deg]">
          <ChevronUpIcon color="white" width={20} height={20} />
        </div>
      }
    >
      Back
    </Button>
  );
}
