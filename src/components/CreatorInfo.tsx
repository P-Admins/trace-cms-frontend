import SmallAvatar from '@components/avatars/SmallAvatar';
import AvatarAndNameSkeleton from '@components/skeletons/AvatarAndNameSkeleton';

interface Props {
  name: string | undefined | null;
  avatarSrc?: string | null;
  isLoading?: boolean;
  showFallback?: boolean;
}

export default function CreatorInfo({ name, avatarSrc, isLoading, showFallback = true }: Props) {
  if (isLoading && showFallback) {
    return <AvatarAndNameSkeleton />;
  }

  return (
    <div className="flex items-center gap-3.5">
      <SmallAvatar name={name || ''} src={avatarSrc || undefined} size="sm" />
      <span className="text-2xl text-nowrap text-ellipsis overflow-hidden">{name}</span>
    </div>
  );
}
