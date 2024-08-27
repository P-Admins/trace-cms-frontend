interface Props {
  text: string;
  className?: string;
}

export default function FolderDescription({ text, className = '' }: Props) {
  return <div className={`text-sm text-default-500 my-1 ${className}`}>{text}</div>;
}
