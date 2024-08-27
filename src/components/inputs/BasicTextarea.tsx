import { Textarea, TextAreaProps } from '@nextui-org/react';

interface Props extends TextAreaProps {
  className?: string;
  inputWrapperClassNames?: string;
  labelClassNames?: string;
}

export default function BasicTextarea({
  className = '',
  inputWrapperClassNames = '',
  labelClassNames = '',
  ...props
}: Props) {
  return (
    <Textarea
      variant="flat"
      labelPlacement="outside"
      classNames={{
        base: ['max-w-full'],
        inputWrapper: [
          'bg-background',
          'h-[50px]',
          'rounded-[5px]',
          props.isInvalid
            ? 'group-data-[focus=true]:outline outline-1 outline-solid outline-danger'
            : 'group-data-[focus=true]:outline outline-1 outline-solid outline-primary',
          inputWrapperClassNames,
        ],
        label: ['text-xl', 'font-medium', 'h-[35px]', labelClassNames],
        input: ['text-lg', 'placeholder:text-default-400'],
      }}
      className={className}
      {...props}
    />
  );
}
