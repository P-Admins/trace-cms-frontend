import FolderSkeleton from '@components/skeletons/FolderSkeleton';

function FolderListSkeleton() {
  return (
    <div className="flex gap-x-6">
      <FolderSkeleton />
      <FolderSkeleton />
      <FolderSkeleton />
    </div>
  );
}

export default FolderListSkeleton;
