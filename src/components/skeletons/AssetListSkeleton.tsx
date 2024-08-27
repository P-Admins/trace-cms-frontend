import AssetSkeleton from '@components/skeletons/AssetSkeleton';

type Props = {
  className?: string;
};
function AssetListSkeleton({ className = '' }: Props) {
  return (
    <div className={`flex gap-x-[23px] ${className}`}>
      <AssetSkeleton />
      <AssetSkeleton />
      <AssetSkeleton />
    </div>
  );
}

export default AssetListSkeleton;
