import { CircularProgress } from '@nextui-org/react';

interface Props {
  progress: number;
  name: string;
}

export default function UploadingAsset({ progress, name }: Props) {
  return (
    <div className="relative rounded-xl h-[272px] w-[272px] [@media(max-width:1824px)]:w-[224px] [@media(max-width:1824px)]:h-[224px] bg-light-blue-gradient flex justify-center items-center">
      <CircularProgress
        aria-label="Loading..."
        size="lg"
        value={progress === 100 ? undefined : progress}
        color="primary"
        showValueLabel={true}
        strokeWidth={1.5}
        classNames={{
          svg: 'w-[107px] h-[107px] [@media(max-width:1824px)]:w-[92px] [@media(max-width:1824px)]:h-[92px]',
          value: 'text-primary-400 text-3xl [@media(max-width:1824px)]:text-2xl',
          indicator: 'stroke-primary-300',
          track: 'stroke-default-100',
        }}
      />
      <span className="absolute bottom-4 left-3.5 right-3.5 text-xl [@media(max-width:1824px)]:text-md text-primary-300 line-clamp-2 break-all">
        {name}
      </span>
    </div>
  );
}
