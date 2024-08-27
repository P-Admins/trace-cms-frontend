import { Folder } from '@/types/Folder';
import { Tooltip } from '@nextui-org/react';
import FolderIcon from '@icons/Folder.svg?react';

interface Props {
  folder: Pick<Folder, 'folderId' | 'title'>;
  isActive?: boolean;
  onClick?: (folderId: string) => void;
}

export default function DefaultFolder({ folder, isActive, onClick = () => {} }: Props) {
  return (
    <Tooltip color="foreground" placement="top" content={folder.title}>
      <div
        onClick={() => onClick(folder.folderId)}
        className={`flex items-center w-40 gap-2 py-[18px] px-3.5 rounded-[5px] cursor-pointer ${isActive ? 'bg-primary hover:bg-primary-600' : 'bg-default-100 hover:bg-default-300'}`}
      >
        <FolderIcon color={isActive ? 'white' : 'black'} width={24} height={24} />
        <p
          className={`text-sm w-24 line-clamp-1 break-all ${isActive ? 'text-content1' : 'text-default-800'}`}
        >
          {folder.title}
        </p>
      </div>
    </Tooltip>
  );
}
