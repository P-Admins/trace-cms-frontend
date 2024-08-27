import { stringToColor } from '@/lib/utils';
import { Avatar, AvatarProps, Tooltip } from '@nextui-org/react';

interface Props extends AvatarProps {
  shape?: 'circle' | 'square';
  showTooltip?: boolean;
}

export default function SmallAvatar({
  src,
  shape = 'circle',
  name = '',
  showTooltip = false,
  ...props
}: Props) {
  const bgColor = stringToColor(name);

  return (
    <Tooltip color="foreground" content={name} isDisabled={!showTooltip}>
      <Avatar
        style={{ backgroundColor: bgColor }}
        showFallback
        color="primary"
        name={name && name[0]?.toUpperCase()}
        classNames={{ base: shape === 'square' ? 'rounded-md' : 'rounded-full' }}
        className={`shrink-0 ${shape === 'square' ? 'rounded-md' : 'rounded-full'}`}
        radius="lg"
        src={src}
        {...props}
      />
    </Tooltip>
  );
}
