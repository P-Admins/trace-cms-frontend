import { DropdownTrigger, DropdownItem, DropdownMenu, DropdownProps } from '@nextui-org/react';
import DropdownWrapper from '@components/dropdown/DropdownWrapper';

interface Props extends Omit<DropdownProps, 'children'> {
  dropdownTriggerChildren?: React.ReactNode;
  dropdownItems: {
    icon?: React.ReactNode;
    text: string;
    onClick: React.MouseEventHandler<HTMLLIElement> | undefined;
  }[];
  className?: string;
}

export default function CustomDropdown({
  dropdownTriggerChildren,
  dropdownItems,
  className = '',
  ...props
}: Props) {
  return (
    <DropdownWrapper className={className} {...props}>
      <DropdownTrigger>{dropdownTriggerChildren}</DropdownTrigger>
      <DropdownMenu
        className={'max-h-[300px] overflow-y-auto'}
        itemClasses={{
          wrapper: 'p-0',
          base: [
            'rounded-[5px]',
            'gap-4',
            'px-3',
            'text-default-700',
            'data-[hover=true]:bg-primary-200',
            'data-[hover=true]:text-default-700',
          ],
          title: ['text-lg'],
        }}
      >
        {dropdownItems.map((item, index) => (
          <DropdownItem startContent={item.icon} key={index} onClick={item.onClick}>
            {item.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownWrapper>
  );
}
