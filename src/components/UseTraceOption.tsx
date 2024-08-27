import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  value: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onChooseOption: (option: string) => void;
}

export default function UseTraceOption({
  text,
  icon,
  value,
  isActive,
  className = '',
  onChooseOption,
}: Props) {
  return (
    <Button
      onClick={() => onChooseOption(value)}
      disableRipple
      className={`flex flex-col w-[90px] h-[90px] items-center gap-3 bg-white/20 w text-content1 opacity-90 p-2.5 border-[1px] rounded-[5px] cursor-pointer ${isActive ? 'shadow-[0_4px_5px_0px_rgba(0,0,0,0.25)] font-semibold' : ''} ${className}`}
    >
      {icon}
      <p className="text-sm">{text}</p>
    </Button>
  );
}
