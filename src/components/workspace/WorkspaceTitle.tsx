interface Props {
  text?: string;
  className?: string;
}
export default function WorkspaceTitle({ text = '', className = '' }: Props) {
  return <h3 className={`${className}`}>{text}</h3>;
}
