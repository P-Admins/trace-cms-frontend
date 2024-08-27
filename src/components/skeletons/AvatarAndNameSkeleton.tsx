import { Skeleton } from '@nextui-org/react';

function AvatarAndNameSkeleton() {
  return (
    <div className="flex ml-2 gap-3.5">
      <Skeleton className="rounded-full h-[30px] w-[30px]"></Skeleton>
      <Skeleton className="rounded-lg h-[30px] w-[180px]"></Skeleton>
    </div>
  );
}

export default AvatarAndNameSkeleton;
