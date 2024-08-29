import { Button } from '@nextui-org/react';
import AddIcon from '@icons/Add.svg?react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export default function CreateNewAssetItemButton({ onClick, className = '' }: Props) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`relative text-lg bg-white w-[272px] h-[272px] [@media(max-width:1824px)]:w-[224px] [@media(max-width:1824px)]:h-[224px] rounded-xl flex flex-col justify-center backdrop-blur-[37px] gap-5 ${className}`}
    >
      <div className="grow-1">
        <AddIcon fill="#293038" width={50} height={50} />
      </div>
      <p className="absolute left-5 font-medium bottom-6 self-end grow-0">Create New</p>
    </Button>
  );
}
