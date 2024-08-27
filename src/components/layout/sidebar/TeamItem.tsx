import SmallAvatar from '@/components/avatars/SmallAvatar';

type Props = {
  name: string;
  profileImgSrc?: string;
  isActive?: boolean;
  showTopBorder?: boolean;
  className?: string;
};

export default function TeamItem({
  name,
  profileImgSrc,
  showTopBorder,
  isActive,
  className = '',
}: Props) {
  return (
    <div className={`rounded-l-lg ${isActive ? 'bg-content1' : ''} ${className}`}>
      <div
        className={`flex items-center border-b-1 border-default-900 border-opacity-10 flex gap-3 ml-5 mr-5 py-3 ${showTopBorder ? 'border-t-1' : ''}`}
      >
        <SmallAvatar shape="square" name={name} src={profileImgSrc} />
        <span className="text-lg text-nowrap text-ellipsis overflow-hidden">{name}</span>
      </div>
    </div>
  );
}
