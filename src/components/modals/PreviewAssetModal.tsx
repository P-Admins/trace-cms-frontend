import '@google/model-viewer';
import { useEffect, useState } from 'react';
import { getStorageUrl } from '@/lib/utils';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
  Image,
} from '@nextui-org/react';
import { Asset, AssetType } from '@/types/Asset';
import PencilIcon from '@icons/Pencil.svg?react';
import CloseButton from '@components/buttons/CloseButton';
import WhiteButton from '@components/buttons/WhiteButton';
import CreatorInfo from '@components/CreatorInfo';
import JsonEditor from '@components/jsonEditor';

interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  onOpenChange: () => void;
  onClose?: () => void;
  onRename: () => void;
  onDelete: () => void;
  onUpdateMetadata: (params: { assetId: string; metadata: Object }) => void;
  isUpdateAssetPending: boolean;
  asset: Asset | null;
}

export default function PreviewAssetModal({
  isOpen,
  isLoading,
  onOpenChange,
  onClose,
  onRename,
  onDelete,
  onUpdateMetadata,
  isUpdateAssetPending,
  asset,
}: Props) {
  const modalContainer = document.getElementById('modal-container') as HTMLElement;
  const [displayJsonEditor, setDisplayJsonEditor] = useState(false);
  const [json, setJson] = useState<Object>({});
  const [isJsonChanged, setIsJsonChanged] = useState(false);
  const [isJsonInvalid, setIsJsonInvalid] = useState(false);

  const handleJsonChange = (value: Object) => {
    if (!asset) return;
    setJson(value);
    const isChanged = JSON.stringify(value) !== JSON.stringify(asset.metadata);
    setIsJsonChanged(isChanged);
  };

  useEffect(() => {
    return () => {
      setDisplayJsonEditor(false);
    };
  }, [isOpen]);

  useEffect(() => {
    if (asset?.metadata) {
      setJson(asset.metadata);
      setIsJsonChanged(false);
    }
  }, [asset?.metadata]);

  return (
    <Modal
      portalContainer={modalContainer}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="opaque"
      onClose={onClose}
      classNames={{
        wrapper: ['p-[25px]'],
        base: [
          'rounded-[18px]',
          'bg-white/40',
          'backdrop-blur-md',
          'border-[3px]',
          'overflow-y-visible',
          'min-h-[50vh]',
          'max-h-[80vh]',
          'min-w-[700px]',
          'min-w-[40vw]',
        ],
        body: ['px-0', 'py-0', 'text-center', 'rounded-t-[18px]', 'overflow-hidden', 'grid'],
        footer: ['p-[30px]', 'justify-between', 'items-center'],
        backdrop: 'bg-custom-backdrop',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <CloseButton onClick={onClose} className="absolute left-[-28px] top-[-28px] z-10" />
            <ModalBody className="h-full">
              {isLoading && asset?.fileType !== AssetType.IMAGE ? (
                <Skeleton className="rounded-tl-lg rounded-tr-lg w-full h-[50vh]"></Skeleton>
              ) : (
                <div className="flex justify-center rounded-[18px] relative">
                  {displayJsonEditor && (
                    <div className="w-full h-[calc(100%-26px)] absolute">
                      <JsonEditor
                        json={json}
                        onChange={handleJsonChange}
                        setIsJsonInvalid={setIsJsonInvalid}
                      />
                    </div>
                  )}
                  {asset?.fileType === AssetType.IMAGE && (
                    <Image
                      src={getStorageUrl(asset.url)}
                      className={`object-contain max-h-[50vh] rounded-none ${displayJsonEditor && 'invisible'}`}
                      draggable={false}
                      classNames={{
                        wrapper: ['rounded-none'],
                      }}
                    />
                  )}
                  {asset?.fileType === AssetType.VIDEO && (
                    <video
                      controls
                      className={`object-contain max-h-[50vh] ${displayJsonEditor && 'invisible'}`}
                    >
                      <source src={getStorageUrl(asset.url)} type="video/mp4" />
                    </video>
                  )}
                  {asset?.fileType === AssetType.MODEL && (
                    <model-viewer
                      src={getStorageUrl(asset.url)}
                      shadow-intensity="1"
                      camera-controls
                      touch-action="pan-y"
                      style={{
                        minHeight: '50vh',
                        width: '100%',
                        visibility: displayJsonEditor ? 'hidden' : 'visible',
                        background:
                          'radial-gradient(circle, #ffffff 50%, rgba(222, 222, 222, 1) 100%)',
                      }}
                      crossOrigin="use-credentials"
                    ></model-viewer>
                  )}
                  {asset?.fileType === AssetType.TRACE && (
                    <div className="h-[calc(50vh-126px)] flex flex-col justify-center items-center">
                      <div className="text-xl">Asset cannot be previewed.</div>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="w-full flex flex-wrap">
              <div className="flex flex-wrap max-w-[65%] gap-2 items-center mr-5">
                {isLoading ? (
                  <Skeleton className="rounded-xl h-[40px] w-[300px]"></Skeleton>
                ) : (
                  <>
                    <span className="text-3xl mr-10 line-clamp-1 break-all">{asset?.title}</span>
                    <CreatorInfo
                      name={asset?.creator.name}
                      avatarSrc={asset?.creator.profileImageSmallThumbnailUrl}
                    />
                  </>
                )}
              </div>
              <div className="flex gap-x-4 items-center justify-end mt-3 grow ml-auto">
                <Button
                  className={`bg-content1 rounded-[5px] h-[60px] w-[60px] ${displayJsonEditor && 'border-2 border-primary-500'}`}
                  isIconOnly
                  startContent={<PencilIcon width={36} height={36} />}
                  onClick={() => setDisplayJsonEditor(!displayJsonEditor)}
                  isDisabled={isLoading || isUpdateAssetPending}
                ></Button>
                {displayJsonEditor ? (
                  <WhiteButton
                    text="Save"
                    isLoading={isUpdateAssetPending}
                    className="font-extrabold text-black w-[140px] h-[60px]"
                    isDisabled={
                      !isJsonChanged || isJsonInvalid || isLoading || isUpdateAssetPending
                    }
                    onClick={() =>
                      onUpdateMetadata({ assetId: asset?.assetId as string, metadata: json })
                    }
                  />
                ) : (
                  <WhiteButton
                    text="Rename"
                    className="font-extrabold text-black w-[140px] h-[60px]"
                    onClick={onRename}
                    isDisabled={isLoading || isUpdateAssetPending}
                  />
                )}
                <WhiteButton
                  text="Delete"
                  className="font-extrabold text-black w-[140px] h-[60px]"
                  onClick={onDelete}
                  isDisabled={isLoading || isUpdateAssetPending}
                />
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
