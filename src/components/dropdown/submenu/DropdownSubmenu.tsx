import { SubmenuItemType } from './SubmenuItemType';
import DropdownSubmenuItem from './DropdownSubmenuItem';

interface Props {
  isOpen: boolean;
  list: SubmenuItemType[];
  onSelect: (id: string) => void;
  className?: string;
}

export default function DropdownSubmenu({ isOpen, list, onSelect, className = '' }: Props) {
  if (!isOpen) return;

  return (
    <div className={`min-w-[180px] rounded-[5px] bg-white/80 p-2 flex flex-col ${className}`}>
      {list.map((item) => (
        <DropdownSubmenuItem
          key={item.id}
          className="text-nowrap text-ellipsis overflow-hidden min-h-11"
          onClick={() => onSelect(item.id)}
        >
          {item.name}
        </DropdownSubmenuItem>
      ))}
    </div>
  );
}
