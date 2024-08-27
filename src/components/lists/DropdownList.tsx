import SmallAvatar from '@components/avatars/SmallAvatar';
import { Icon } from '@iconify/react';

type Props = {
  className?: string;
  list: { text: string; value: string; avatar?: string; icon?: string; onClick?: () => void }[];
};
function DropdownList({ className, list }: Props) {
  return (
    <ul
      className={`bg-content1 rounded-[5px] flex flex-col gap-1.5 p-2 drop-shadow-xl border-slate-900 ${className}`}
    >
      {list.map((item) => (
        <li
          className="hover:bg-primary-200 p-2 pr-4 rounded-[5px] flex items-center gap-2 cursor-pointer"
          key={item.value}
          onClick={item.onClick}
        >
          <SmallAvatar name={item.value} src={item.avatar} showTooltip />
          <span className="grow">{item.text}</span>
          {item.icon && <Icon icon={item.icon} className="justify-self-end text-primary" />}
        </li>
      ))}
    </ul>
  );
}

export default DropdownList;
