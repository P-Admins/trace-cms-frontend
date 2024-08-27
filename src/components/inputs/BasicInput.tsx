import { Input, InputProps } from '@nextui-org/react';

interface Props extends Omit<InputProps, 'classNames'> {
  className?: string;
  inputWrapperClassNames?: string;
  labelClassNames?: string;
}

export default function BasicInput({
  className = '',
  inputWrapperClassNames = '',
  labelClassNames = '',
  ...props
}: Props) {
  return (
    <Input
      variant="flat"
      labelPlacement="outside"
      classNames={{
        base: ['max-w-full', 'data-[has-label=true]:mt-[calc(theme(fontSize.xl)_+_20px)]'],
        inputWrapper: [
          'bg-background',
          'h-[50px]',
          'rounded-[5px]',
          'data-[hover=true]:bg-default-50',
          props.isInvalid
            ? 'group-data-[focus=true]:outline outline-1 outline-solid outline-danger'
            : 'group-data-[focus=true]:outline outline-1 outline-solid outline-primary',
          inputWrapperClassNames,
        ],
        label: ['text-xl', 'font-medium', 'h-[35px]', labelClassNames],
        input: ['text-lg', 'placeholder:text-default-400'],
        errorMessage: ['text-left'],
      }}
      className={className}
      {...props}
    />
  );
}
