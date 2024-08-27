import { CircularProgress } from '@nextui-org/react';

interface Props {
  progress: number;
  name: string;
}

export default function UploadingAsset({ progress, name }: Props) {
  return (
    <div className="relative rounded-xl h-[272px] w-[272px] bg-light-blue-gradient flex justify-center items-center">
      <CircularProgress
        aria-label="Loading..."
        size="lg"
        value={progress === 100 ? undefined : progress}
        color="primary"
        showValueLabel={true}
        strokeWidth={1.5}
        classNames={{
          svg: 'w-[107px] h-[107px]',
          value: 'text-primary-400 text-3xl',
          indicator: 'stroke-primary-300',
          track: 'stroke-default-100',
        }}
      />
      <span className="absolute bottom-4 left-3.5 right-3.5 text-xl text-primary-300 line-clamp-2 break-all">
        {name}
      </span>
    </div>
  );
}
