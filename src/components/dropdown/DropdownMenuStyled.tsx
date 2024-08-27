import { DropdownMenu, DropdownMenuProps } from '@nextui-org/react';

interface Props extends DropdownMenuProps {
  className?: string;
}

export default function DropdownMenuStyled({ className = '', children, ...props }: Props) {
  return (
    <DropdownMenu
      className={className}
      classNames={{ list: ['gap-1.5'] }}
      itemClasses={{
        base: [
          'rounded-[5px]',
          'gap-4',
          'px-3',
          'py-2.5',
          'text-default-700',
          'data-[focus=true]:bg-primary-200',
          'data-[hover=true]:bg-primary-200',
          'data-[hover=true]:text-default-700',
          'data-[selectable=true]:focus:bg-primary-200',
          'data-[selectable=true]:focus:text-default-700',
        ],
        title: ['text-lg'],
      }}
      {...props}
    >
      {children}
    </DropdownMenu>
  );
}
