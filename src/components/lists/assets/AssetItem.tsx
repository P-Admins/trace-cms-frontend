import genericThumbnailPath from '@images/AssetGenericThumbnail.png';
import { useState, useRef, useMemo, useEffect } from 'react';
import { DropdownItem, DropdownTrigger, Image } from '@nextui-org/react';
import { Asset } from '@/types/Asset';
import { getStorageUrl } from '@/lib/utils';
import { cn } from '@/lib/cn';
import ThreeDotsIcon from '@icons/ThreeDots.svg?react';
import PencilIcon from '@icons/Pencil.svg?react';
import MoveIcon from '@icons/Folder_Move.svg?react';
import TrashIcon from '@icons/Trash.svg?react';
import DropdownWrapper from '@components/dropdown/DropdownWrapper';
import DropdownMenuStyled from '@components/dropdown/DropdownMenuStyled';
import DropdownSubmenu from '@components/dropdown/submenu/DropdownSubmenu';

interface Props {
  asset: Asset;
  folderList: { folderId: string; title: string }[];
  onClick?: () => void;
  onRename?: () => void;
  onMove?: (params: { folderId: string; assetId: string }) => void;
  onDelete?: () => void;
  isPreviewAssetOpen?: boolean;
  enableFolderActions?: boolean;
}

export default function AssetItem({
  asset,
  folderList,
  onClick,
  onRename,
  onMove = () => {},
  onDelete,
  isPreviewAssetOpen,
  enableFolderActions,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const submenuContainerRef = useRef<HTMLDivElement>(null);

  const folders = useMemo(
    () => folderList.map((folder) => ({ id: folder.folderId, name: folder.title })),
    [folderList]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isPreviewAssetOpen) setIsHovered(false);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
    setIsSubmenuOpen(false);
  };

  const handleOpenSubmenu = () => {
    setIsSubmenuOpen(true);
  };

  const handleCloseSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  const submenuContainerClassNames = useMemo(() => {
    if (submenuContainerRef.current) {
      const rect = submenuContainerRef.current.getBoundingClientRect();
      if (!isSubmenuOpen) return '';
      if (rect.right > document.body.clientWidth) {
        return 'left-0 -translate-x-full pl-0 pr-5 ';
      } else {
        return 'right-0 translate-x-full pr-0 pl-5 ';
      }
    }
  }, [isSubmenuOpen]);

  const handleMove = (folderId: string) => {
    setIsSubmenuOpen(false);
    handleCloseDropdown();
    onMove({ folderId, assetId: asset.assetId });
  };

  useEffect(() => {
    return () => {
      setIsSubmenuOpen(false);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isPreviewAssetOpen) setIsHovered(false);
  }, [isPreviewAssetOpen]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownWrapper
        offset={42}
        className="min-w-[180px]"
        isOpen={isDropdownOpen}
        onOpenChange={(open) => setIsDropdownOpen(open)}
      >
        <div
          className="relative rounded-xl h-[272px] w-[272px] [@media(max-width:1824px)]:w-[224px] [@media(max-width:1824px)]:h-[224px] cursor-pointer bg-white-gradient"
          onClick={onClick}
        >
          <div className="absolute">
            <Image
              src={asset.thumbnailUrl ? getStorageUrl(asset.thumbnailUrl) : genericThumbnailPath}
              classNames={{ img: isHovered && 'scale-110', wrapper: 'overflow-hidden' }}
              draggable={false}
            />
          </div>
          <div className="rounded-xl h-full w-full flex items-end">
            <div
              className={cn(
                'flex w-full justify-between items-center py-3 pl-3.5 pr-1 z-10 relative bg-white/50 rounded-b-xl backdrop-blur transition-all duration-150',
                isHovered && 'py-4'
              )}
            >
              <span
                className={cn(
                  'w-[200px] m-1 mr-5 line-clamp-1 break-all text-sm',
                  isHovered && 'text-lg'
                )}
              >
                {asset.title}
              </span>
              {enableFolderActions && (
                <DropdownTrigger className={cn('hidden', isHovered && 'block')}>
                  <ThreeDotsIcon width={40} height={40} />
                </DropdownTrigger>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuStyled aria-label={`Dropdown-menu-${asset.title}-asset`}>
          <DropdownItem
            key="rename"
            startContent={
              <div className="w-4">
                <PencilIcon width={24} height={24} />
              </div>
            }
            onClick={onRename}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            onMouseEnter={handleOpenSubmenu}
            onMouseLeave={handleCloseSubmenu}
            key="move"
            startContent={
              <div className="w-4">
                <MoveIcon width={24} height={24} />
              </div>
            }
            isReadOnly
            className="hover:bg-primary-200"
            textValue="Move"
          >
            Move
            <div
              ref={submenuContainerRef}
              className={cn(
                'absolute top-0 w-[200px] right-0 translate-x-full pl-5',
                submenuContainerClassNames
              )}
            >
              <DropdownSubmenu
                isOpen={isSubmenuOpen}
                className="max-h-[192px] overflow-y-auto"
                list={folders}
                onSelect={handleMove}
              />
            </div>
          </DropdownItem>
          <DropdownItem
            key="delete"
            startContent={
              <div className="w-4">
                <TrashIcon width={24} height={24} />
              </div>
            }
            onClick={onDelete}
          >
            Delete
          </DropdownItem>
        </DropdownMenuStyled>
      </DropdownWrapper>
    </div>
  );
}
