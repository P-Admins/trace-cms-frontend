import { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export default function UserListWrapper({ children, className }: Props) {
  return (
    <div
      className={`flex flex-col bg-white/80 rounded-xl max-h-[272px] overflow-auto ${className}`}
    >
      {children}
    </div>
  );
}
