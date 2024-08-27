import { Skeleton } from '@nextui-org/react';

function FolderPermissionsSkeleton() {
  return (
    <div className="flex ml-2">
      <Skeleton className="rounded-full h-[30px] w-[30px]"></Skeleton>
      <Skeleton className="rounded-full h-[30px] w-[30px] -ml-2"></Skeleton>
      <Skeleton className="rounded-full h-[30px] w-[30px] -ml-2"></Skeleton>
      <Skeleton className="rounded-lg h-[30px] w-[250px] ml-2"></Skeleton>
    </div>
  );
}

export default FolderPermissionsSkeleton;
