import Close from '@icons/Close.svg?react';

interface Props {
  onClick: () => void;
  className?: string;
}

export default function CloseButton({ onClick, className = '' }: Props) {
  return (
    <div
      onClick={onClick}
      className={`rounded-full bg-[#BCBCBC] bg-opacity-20 backdrop-blur-[5px] w-fit cursor-pointer p-3 drop-shadow-xl ${className}`}
    >
      <Close width={30} height={30} color="white" />
    </div>
  );
}
