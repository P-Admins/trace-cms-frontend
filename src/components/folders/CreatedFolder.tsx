import { useRef, useState } from 'react';
import { DropdownTrigger, DropdownItem, Tooltip } from '@nextui-org/react';
import { Folder } from '@/types/Folder';
import useHasTextOverflow from '@/hooks/useHasTextOverflow';
import DropdownMenuStyled from '@components/dropdown/DropdownMenuStyled';
import FolderIcon from '@icons/Folder.svg?react';
import MoreIcon from '@icons/ThreeDots.svg?react';
import PencilIcon from '@icons/Pencil.svg?react';
import UploadIcon from '@icons/Upload.svg?react';
import TrashIcon from '@icons/Trash.svg?react';
import SharedFolderIcon from '@icons/FolderShared.svg?react';
import DropdownWrapper from '@components/dropdown/DropdownWrapper';

export enum FolderActions {
  RENAME = 'rename',
  SHARE = 'share',
  DELETE = 'delete',
  CREATE = 'create',
}

interface Props {
  folder: Pick<Folder, 'folderId' | 'title'>;
  isActive?: boolean;
  isShared?: boolean;
  onClick?: (folderId: string) => void;
  onFolderActionClick?: (
    action: FolderActions,
    folder: { folderId: string; title: string }
  ) => void;
  enableFolderActions?: boolean;
}

export default function CreatedFolder({
  folder,
  isActive,
  isShared,
  onClick = () => {},
  onFolderActionClick = () => {},
  enableFolderActions,
}: Props) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const hasEllipsis = useHasTextOverflow(textRef, folder.title);
  const [isHovered, setIsHovered] = useState(false);

  const getFolderIcon = (): React.ReactNode => {
    switch (true) {
      case isActive && !isShared:
        return <FolderIcon color="white" width={24} height={24} />;
      case isActive && isShared:
        return <SharedFolderIcon color="white" width={24} height={24} />;
      case !isActive && isShared:
        return <SharedFolderIcon color="white" width={24} height={24} />;
      default:
        return <FolderIcon width={24} height={24} />;
    }
  };

  return (
    <DropdownWrapper>
      <Tooltip
        color="foreground"
        placement="top"
        content={folder.title}
        isOpen={isHovered && hasEllipsis}
      >
        <div
          onClick={() => onClick(folder.folderId)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex h-[60px] items-center justify-between w-40 rounded-[5px] cursor-pointer transition-all ease-in-out duration-500 ${isActive ? 'bg-primary hover:bg-primary-600' : 'bg-default-100 hover:bg-default-300'}`}
        >
          <div className="flex h-full w-[calc(100%-29px)] items-center gap-2 py-3.5 pl-3.5">
            <div>{getFolderIcon()}</div>
            <p
              ref={textRef}
              className={`text-sm line-clamp-1 break-all ${isActive ? 'text-content1' : 'text-default-800'}`}
            >
              {folder.title}
            </p>
          </div>
          {enableFolderActions && (
            <DropdownTrigger>
              <div className="h-full flex flex-col justify-center mr-1">
                {isActive ? (
                  <MoreIcon width={24} height={24} color="white" />
                ) : isHovered ? (
                  <MoreIcon width={24} height={24} color="#A1A1AA" />
                ) : (
                  <MoreIcon width={24} height={24} color="#D4D4D8" />
                )}
              </div>
            </DropdownTrigger>
          )}
        </div>
      </Tooltip>
      <DropdownMenuStyled aria-label={`DropdownMenu${folder.title}Folder`}>
        <DropdownItem
          key="rename"
          onClick={() => onFolderActionClick(FolderActions.RENAME, folder)}
          startContent={
            <div className="w-4">
              <PencilIcon width={24} height={24} />
            </div>
          }
        >
          Rename
        </DropdownItem>
        <DropdownItem
          key="share"
          onClick={() => onFolderActionClick(FolderActions.SHARE, folder)}
          startContent={
            <div className="w-4">
              <UploadIcon width={24} height={24} />
            </div>
          }
        >
          Share
        </DropdownItem>
        <DropdownItem
          key="delete"
          onClick={() => onFolderActionClick(FolderActions.DELETE, folder)}
          startContent={
            <div className="w-4">
              <TrashIcon width={24} height={24} />
            </div>
          }
        >
          Delete
        </DropdownItem>
      </DropdownMenuStyled>
    </DropdownWrapper>
  );
}
