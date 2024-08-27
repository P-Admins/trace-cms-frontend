interface Props {
  mainText?: string;
  subText?: string;
  className?: string;
}

export default function NoContentText({
  mainText = 'Welcome to Trace!',
  subText = 'Add any content here to use it in AR within the Trace App',
  className = '',
}: Props) {
  return (
    <div className={`${className}`}>
      <p className="text-4xl mb-4">{mainText}</p>
      <p className="text-2xl">{subText}</p>
    </div>
  );
}
