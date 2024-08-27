import { Dropdown, DropdownProps } from '@nextui-org/react';

interface Props extends DropdownProps {
  className?: string;
}

export default function DropdownWrapper({ className = '', children, ...props }: Props) {
  const dropdownContainer = document.getElementById('dropdown-container') as HTMLElement;

  return (
    <Dropdown
      portalContainer={dropdownContainer}
      placement="bottom-end"
      offset={10}
      className={`min-w-40 rounded-[5px] bg-white/90 px-0 ${className}`}
      {...props}
    >
      {children}
    </Dropdown>
  );
}
