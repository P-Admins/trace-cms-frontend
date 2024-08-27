import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SubmenuItem({ children, onClick, className = '' }: Props) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-primary-200 p-2 rounded-[5px] flex flex-col justify-center ${className}`}
    >
      {children}
    </div>
  );
}
