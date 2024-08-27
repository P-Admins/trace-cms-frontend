import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
  withBorder?: boolean;
  withPadding?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  className = '',
  children,
  withBorder,
  withPadding = true,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-x-6 items-center cursor-pointer hover:bg-default-300/50  ${withPadding && 'px-8 py-5'} ${withBorder && 'border-b border-black/[0.09]'} ${className}`}
    >
      {children}
    </div>
  );
}
