import { Skeleton } from '@nextui-org/react';

export default function FullPageLoading() {
  return (
    <Skeleton classNames={{ content: 'opacity-50' }}>
      <div className="bg-blue-pastel-bg-image bg-cover relative h-full min-w-screen min-h-screen"></div>
    </Skeleton>
  );
}
