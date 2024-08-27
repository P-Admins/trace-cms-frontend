import { useState } from 'react';
import { Asset, UploadingAsset as UploadingAssetType } from '@/types/Asset';
import { useDisclosure } from '@nextui-org/react';
import {
  useDeleteAssetMutation,
  useGetAssetDetailsQuery,
  useUpdateAssetMutation,
} from '@/hooks/asset';
import AssetItem from './AssetItem';
import PreviewAssetModal from '@/components/modals/PreviewAssetModal';
import CreateOrRenameModal from '@/components/modals/CreateOrRenameModal';
import DeleteModal from '@/components/modals/DeleteModal';
import CreateNewAssetItemButton from '@/components/buttons/CreateNewAssetItemButton';
import UploadingAsset from './UploadingAsset';

interface Props {
  folderId?: string;
  folderList: { folderId: string; title: string }[];
  list: Asset[];
  onCreateNewAssetClick?: () => void;
  className?: string;
  uploadingAssetsList?: UploadingAssetType[];
  enableFolderActions?: boolean;
}

export default function AssetList({
  folderId,
  folderList,
  list,
  uploadingAssetsList = [],
  onCreateNewAssetClick,
  enableFolderActions,
  className = '',
}: Props) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const {
    isOpen: isPreviewAssetOpen,
    onOpenChange: onPreviewAssetOpenChange,
    onOpen: onPreviewAssetOpen,
    onClose: onPreviewAssetModalClose,
  } = useDisclosure();

  const {
    isOpen: isRenameModalOpen,
    onOpenChange: onRenameModalOpenChange,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onPreviewAssetOpen();
  };

  const handleRenameClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onRenameModalOpen();
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onDeleteModalOpen();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAsset) return;
    setSelectedAsset({ ...selectedAsset, title: e.target.value });
  };

  const { assetDetails, isGetAssetDetailsLoading } = useGetAssetDetailsQuery(
    selectedAsset?.assetId,
    folderId
  );

  const { handleUpdateAsset, isUpdateAssetPending } = useUpdateAssetMutation(folderId as string, {
    onSuccess: () => {
      onDeleteModalClose();
      onRenameModalClose();
    },
  });

  const { handleDeleteAsset, isDeleteAssetPending } = useDeleteAssetMutation(folderId as string, {
    onSuccess: () => {
      setSelectedAsset(null);
      onDeleteModalClose();
      onPreviewAssetModalClose();
    },
  });

  return (
    <>
      <div className={`flex flex-wrap gap-[23px] ${className}`}>
        {enableFolderActions && <CreateNewAssetItemButton onClick={onCreateNewAssetClick} />}
        {list.map((asset) => (
          <AssetItem
            asset={asset}
            folderList={folderList.filter((f) => f.folderId !== folderId)}
            key={asset.assetId}
            onClick={() => handleAssetClick(asset)}
            onRename={() => handleRenameClick(asset)}
            onMove={handleUpdateAsset}
            onDelete={() => handleDeleteClick(asset)}
            isPreviewAssetOpen={isPreviewAssetOpen}
            enableFolderActions={enableFolderActions}
          />
        ))}
        {uploadingAssetsList.map((item) => (
          <UploadingAsset key={item.id} progress={item.progress} name={item.name} />
        ))}
      </div>
      <PreviewAssetModal
        isLoading={isGetAssetDetailsLoading}
        isOpen={isPreviewAssetOpen}
        onClose={() => setSelectedAsset(null)}
        onOpenChange={onPreviewAssetOpenChange}
        onRename={onRenameModalOpen}
        onDelete={onDeleteModalOpen}
        onUpdateMetadata={handleUpdateAsset}
        isUpdateAssetPending={isUpdateAssetPending}
        asset={assetDetails}
      />
      <CreateOrRenameModal
        isOpen={isRenameModalOpen}
        isLoading={isUpdateAssetPending}
        onOpenChange={onRenameModalOpenChange}
        title="Rename Asset"
        label="Asset Name"
        name={selectedAsset?.title || ''}
        onChange={handleNameChange}
        onConfirm={() => {
          if (!selectedAsset) return;
          handleUpdateAsset({ assetId: selectedAsset.assetId, title: selectedAsset.title });
        }}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteAssetPending}
        onOpenChange={onDeleteModalOpenChange}
        onClose={onDeleteModalClose}
        title="Delete Asset"
        message={`Are you sure you want to delete ${selectedAsset?.title}?`}
        onConfirm={() => {
          if (selectedAsset) {
            handleDeleteAsset(selectedAsset.assetId);
          }
        }}
      />
    </>
  );
}
