import { Input, InputProps } from '@nextui-org/react';

interface Props extends InputProps {
  className?: string;
}

export default function TransparentInput({ ...props }: Props) {
  return (
    <Input
      variant="bordered"
      labelPlacement="outside"
      color="primary"
      classNames={{
        base: [
          'max-w-[402px]',
          'data-[has-label=true]:pt-[calc(theme(fontSize.medium)_+_20px)]',
          'data-[has-label=true]:mt-0',
        ],
        inputWrapper: ['h-[41px]', 'rounded-[5px]', 'border', 'border-content1'],
        label: ['text-md', 'text-content1', 'font-medium'],
        input: ['text-md', 'text-content1', 'placeholder:text-content1'],
      }}
      {...props}
    />
  );
}
