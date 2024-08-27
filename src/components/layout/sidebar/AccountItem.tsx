import SmallAvatar from '@/components/avatars/SmallAvatar';

type Props = {
  isActive?: boolean;
  className?: string;
  showTopBorder?: boolean;
  name: string | undefined;
  avatarUrl?: string;
  isLoading?: boolean;
};

export default function AccountItem({
  isActive,
  showTopBorder,
  name,
  avatarUrl,
  className = '',
  isLoading,
}: Props) {
  return (
    <div className={`rounded-l-lg ${isActive ? 'bg-content1' : ''} ${className}`}>
      <div
        className={`flex items-center border-b-1 border-default-900 border-opacity-10 flex gap-3 ml-5 mr-5 py-3 ${showTopBorder ? 'border-t-1' : ''}`}
      >
        <SmallAvatar src={avatarUrl} name={name} />
        <span className="text-lg text-nowrap text-ellipsis overflow-hidden">{name}</span>
      </div>
    </div>
  );
}
