import SmallAvatar from '@/components/avatars/SmallAvatar';

type Props = {
  name: string;
  avatar?: string | null;
  email?: string;
};

function UserNameAndAvatarCell({ name, avatar, email }: Props) {
  return (
    <div className="flex items-center gap-3.5">
      <SmallAvatar name={name || email} src={avatar || undefined} size="sm" />
      <span className="text-lg text-nowrap text-ellipsis overflow-hidden">{name || 'N/A'}</span>
    </div>
  );
}

export default UserNameAndAvatarCell;
