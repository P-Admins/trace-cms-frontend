import { stringToColor } from '@/lib/utils';
import { Avatar, AvatarProps } from '@nextui-org/react';

interface Props extends AvatarProps {
  className?: string;
}

export default function UserAvatar({ className = '', src, name, ...props }: Props) {
  const initial = name && name[0].toUpperCase();
  const bgColor = stringToColor(name || '');

  return (
    <Avatar
      style={{ backgroundColor: bgColor }}
      className={`h-8 w-8 ${className}`}
      color="primary"
      src={src}
      showFallback
      name={initial}
      {...props}
    />
  );
}
