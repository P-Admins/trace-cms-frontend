import { Button, DropdownTrigger, DropdownItem, DropdownProps } from '@nextui-org/react';
import ThreeDotsIcon from '@icons/ThreeDots.svg?react';
import DropdownWrapper from '@components/dropdown/DropdownWrapper';
import DropdownMenuStyled from '@components/dropdown/DropdownMenuStyled';

interface Props extends Omit<DropdownProps, 'children'> {
  dropdownItems: {
    icon?: React.ReactNode;
    text: string;
    onClick: React.MouseEventHandler<HTMLLIElement> | undefined;
  }[];
  className?: string;
}

export default function BasicDropdown({ dropdownItems, className = '', ...props }: Props) {
  return (
    <DropdownWrapper className={className} {...props}>
      <DropdownTrigger>
        <Button
          className="rounded-2xl data-[hover=true]:bg-default-200 data-[hover=true]:bg-opacity-50"
          isIconOnly
          size="sm"
          variant="light"
        >
          <ThreeDotsIcon width={24} height={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenuStyled>
        {dropdownItems.map((item, index) => (
          <DropdownItem startContent={item.icon} key={index} onClick={item.onClick}>
            {item.text}
          </DropdownItem>
        ))}
      </DropdownMenuStyled>
    </DropdownWrapper>
  );
}
