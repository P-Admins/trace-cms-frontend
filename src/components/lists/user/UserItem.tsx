import { cn } from '@/lib/cn';
import { Button, Divider } from '@nextui-org/react';
import SmallAvatar from '@/components/avatars/SmallAvatar';

export type UserItemType = {
  id: string | number;
  avatar?: string;
  name: string;
  label: string;
};

interface Props {
  user: UserItemType;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  showButton?: boolean;
  buttonText?: string;
  buttonClassName?: string;
  showBottomBorder?: boolean;
  isDeleted?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: (id: string | number) => void;
}

export default function UserItem({
  user,
  showAvatar,
  avatarSize,
  showButton = true,
  buttonText,
  buttonClassName,
  showBottomBorder = true,
  isDeleted,
  isDisabled,
  className,
  onClick = () => {},
}: Props) {
  return (
    <>
      <div
        className={cn(
          'group flex items-center justify-between gap-2 pl-8 pr-5 py-2.5 h-[60px] transition-all duration-500',
          (isDisabled || !showButton) && 'pointer-events-none',
          isDisabled && 'text-default-400',
          className
        )}
      >
        <div className="flex items-center gap-5 group-hover:max-w-[339px] max-w-[360px]">
          {showAvatar && (
            <SmallAvatar
              size={avatarSize}
              src={user.avatar}
              name={user.name}
              className={`shrink-0 ${isDeleted ? 'opacity-60' : ''}`}
            />
          )}
          <p
            className={cn('truncate group-hover:text-clip', isDeleted && 'italic text-default-400')}
          >
            {user.name}
          </p>
        </div>
        {showButton && (
          <Button
            color="primary"
            radius="full"
            className={cn(
              'hidden group-hover:block min-h-[32px] min-w-[107px] text-lg',
              buttonClassName
            )}
            onClick={() => onClick(user.id)}
          >
            {buttonText}
          </Button>
        )}
        {isDeleted ? (
          <p className="block group-hover:hidden text-danger-400 mr-3">Deleted</p>
        ) : (
          <p className="block group-hover:hidden text-default-400 mr-3 text-right">{`${!user.id ? '(Invited)' : ''} ${user.label}`}</p>
        )}
      </div>
      {showBottomBorder && (
        <div className="px-3">
          <Divider />
        </div>
      )}
    </>
  );
}
