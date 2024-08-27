interface Props {
  text: string;
  className?: string;
}

export default function FolderTitle({ text, className = '' }: Props) {
  return <p className={`text-2xl font-medium ${className}`}>{text}</p>;
}
