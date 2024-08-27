import { Link, useNavigation } from 'react-router-dom';
import { useDisclosure } from '@nextui-org/react';
import { members } from '@/lib/mocks/members';
import { AssetType } from '@/types/Asset';
import AddIcon from '@icons/Add.svg?react';
import CloseIcon from '@icons/Close.svg?react';
import ContentIcon from '@icons/Content.svg?react';
import FolderIcon from '@icons/Folder.svg?react';
import MoveIcon from '@icons/Folder_Move.svg?react';
import OptionsIcon from '@icons/Options.svg?react';
import PencilIcon from '@icons/Pencil.svg?react';
import TrashIcon from '@icons/Trash.svg?react';
import UploadIcon from '@icons/Upload.svg?react';
import UserMaleIcon from '@icons/User_Male.svg?react';
import UserFemaleIcon from '@icons/User_Female.svg?react';
import TechnologyIcon from '@icons/Technology.svg?react';
import VideoIcon from '@icons/Video.svg?react';
import ImageIcon from '@icons/Image.svg?react';
import BackButton from '@/components/buttons/BackButton';
import DeleteButton from '@/components/buttons/DeleteButton';
import PrimaryGradientButton from '@/components/buttons/PrimaryGradientButton';
import WhiteButton from '@/components/buttons/WhiteButton';
import TextButton from '@/components/buttons/TextButton';
import CreateNewButton from '@/components/buttons/CreateNewButton';
import CreateNewFolderModal from '@/components/modals/CreateOrRenameModal';
import DeleteFolderModal from '@/components/modals/DeleteModal';
import ShareFolderModal from '@/components/modals/ShareFolderModal';
import DefaultFolder from '@/components/folders/DefaultFolder';
import CreatedFolder from '@/components/folders/CreatedFolder';
import ImportOptionButton from '@/components/buttons/ImportOptionButton';
import ImportModal from '@/components/modals/ImportModal';
import BasicInput from '@/components/inputs/BasicInput';
import TransparentInput from '@/components/inputs/TransparentInput';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import CreateTeamModal from '@/components/modals/CreateTeamModal';
import UserAvatar from '@/components/UserAvatar';
import CreatorInfo from '@/components/CreatorInfo';
import AssetList from '@/components/lists/assets/AssetList';
import DragAndDropFileModal from '@/components/modals/DragAndDropFileModal';
import useDragAndDropVisibility from '@/hooks/useDragAndDropVisibility';
import BorderButton from '@/components/buttons/BorderButton';
import InviteSection from '@/components/InviteSection';

import FolderShareInfo from '@/components/folders/FolderShareInfo';

export default function Components() {
  const navigation = useNavigation();

  const {
    isOpen: isCreateNewFolderOpen,
    onOpenChange: onCreateNewFolderOpenChange,
    onOpen: onCreateNewFolderOpen,
  } = useDisclosure();

  const {
    isOpen: isDeleteFolderOpen,
    onOpenChange: onDeleteFolderOpenChange,
    onOpen: onDeleteFolderOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isShareFolderOpen,
    onOpenChange: onShareFolderOpenChange,
    onOpen: onShareFolderOpen,
    onClose: onShareClose,
  } = useDisclosure();

  const {
    isOpen: isImportModalOpen,
    onOpenChange: onImportOpenChange,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();

  const {
    isOpen: isCreateNewTeamOpen,
    onOpenChange: onCreateNewTeamOpenChange,
    onOpen: onCreateNewTeamOpen,
  } = useDisclosure();

  const isSomeModalOpen =
    isCreateNewFolderOpen || isDeleteFolderOpen || isShareFolderOpen || isCreateNewTeamOpen;

  const { isDragAndDropOpen, onDragAndDropOpenChange, onDragAndDropClose } =
    useDragAndDropVisibility({ preventOpen: isSomeModalOpen, beforeOpen: onImportClose });

  return (
    <div className="p-4">
      <CreateNewFolderModal
        isOpen={isCreateNewFolderOpen}
        onOpenChange={onCreateNewFolderOpenChange}
        title="Create New Folder"
        label="Folder Name"
      />
      <DeleteFolderModal
        isOpen={isDeleteFolderOpen}
        onOpenChange={onDeleteFolderOpenChange}
        onClose={onDeleteClose}
        title="Example Folder"
        message="Are you sure you want to delete Example Folder and all of its content?"
      />
      <ShareFolderModal isOpen={isShareFolderOpen} onOpenChange={onShareFolderOpenChange} />
      <ImportModal
        isOpen={isImportModalOpen}
        onOpenChange={onImportOpenChange}
        onClose={onImportClose}
        onUploadStart={() => {}}
        onUploadProgress={() => {}}
        onUploadComplete={() => {}}
      />
      <CreateTeamModal
        currentMemberName={{
          email: 'valentina.vukovic@pontistechnology.com',
          fullName: 'Valentina Vuković',
          profileImageSmallThumbnailUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        }}
        isOpen={isCreateNewTeamOpen}
        onOpenChange={onCreateNewTeamOpenChange}
      />
      <DragAndDropFileModal
        isOpen={isDragAndDropOpen}
        onOpenChange={onDragAndDropOpenChange}
        onClose={onDragAndDropClose}
        folderName="Test"
        onUploadStart={() => {}}
        onUploadProgress={() => {}}
        onUploadComplete={() => {}}
      />

      <div className="p-8 flex-col gap-2">
        <h2>TRACE</h2>
        <h5 className="">The Simplest Way to Create AR Experiences</h5>
        <div className="mt-2 flex flex-col">
          <Link to="/my-workspace">Go to my workspace</Link>
          <Link to="/my-workspace/folder">Go to my workspace folder</Link>
          <Link to="/signin">Sign in</Link>
        </div>
        {navigation.state === 'loading' && <div>Loading...</div>}
      </div>
      <hr />

      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">HEADINGS:</div>
        <h1>Some text heading 1</h1>
        <h2>Some text heading 2</h2>
        <h3>Some text heading 3</h3>
        <h4>Some text heading 4</h4>
        <h5>Some text heading 5</h5>
        <h6>Some text heading 6</h6>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">BODY TEXT SIZES:</div>
        <p className="text-2xl">Body-1</p>
        <p className="text-lg">Body-2</p>
        <p className="text-sm">Body-3</p>
        <p className="text-xs">Body-4</p>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">AVAILABLE TEXT SIZES:</div>
        <p className="text-sm">Some text sm size</p>
        <p className="text-md">Some text md size</p>
        <p className="text-lg">Some text lg size</p>
        <p className="text-xl">Some text xl size</p>
        <p className="text-2xl">Some text 2xl size</p>
        <p className="text-3xl">Some text 3xl size</p>
        <p className="text-4xl">Some text 4xl size</p>
        <p className="text-5xl">Some text 5xl size</p>
        <p className="text-6xl">Some text 6xl size</p>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">GRADIENTS:</div>
        <div className="flex gap-6">
          <div className="w-[200px] h-[200px] bg-gradient-main rounded-md"></div>
          <div className="w-[200px] h-[200px] bg-gradient-light rounded-md"></div>
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">ICONS:</div>
        <div className="flex gap-6 mb-10">
          <TrashIcon />
          <PencilIcon />
          <UploadIcon />
          <UserMaleIcon />
          <UserFemaleIcon />
          <MoveIcon />
        </div>
        <div className="flex gap-6">
          <AddIcon />
          <CloseIcon />
          <ContentIcon />
          <FolderIcon fill="white" />
          <FolderIcon fill="black" />
          <OptionsIcon />
          <TechnologyIcon />
          <VideoIcon />
          <ImageIcon />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">BUTTONS:</div>
        <div className="flex gap-6">
          <DeleteButton />
          <PrimaryGradientButton text="PrimaryGradientButton" />
          <WhiteButton text="WhiteButton" />
          <BackButton />
          <TextButton text="+ New Folder" />
          <BorderButton text="BorderButton" />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">FORM INPUTS:</div>
        <div className="flex gap-6">
          <BasicInput label="Input label" placeholder="Placeholder" />
          <TransparentInput label="Input label" placeholder="Placeholder" />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">CLICK TO OPEN MODALS:</div>
        <div className="flex gap-x-4">
          <PrimaryGradientButton text="Add New Folder" onClick={onCreateNewFolderOpen} />
          <WhiteButton text="Share Folder" onClick={onShareFolderOpen} />
          <DeleteButton text="Delete Folder" onClick={onDeleteFolderOpen} />
          <WhiteButton text="Import..." onClick={onImportOpen} />
          <PrimaryGradientButton text="Create New Team" onClick={onCreateNewTeamOpen} />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">FOLDERS:</div>
        <div className="flex gap-6">
          <DefaultFolder folder={{ title: 'Default folder', folderId: '0' }} />
          <DefaultFolder folder={{ title: 'Folder Active', folderId: '0' }} isActive />
          <CreatedFolder folder={{ folderId: '1', title: 'Created Folder' }} />
          <CreatedFolder folder={{ folderId: '1', title: 'Created Folder' }} isShared />
          <CreatedFolder folder={{ folderId: '1', title: 'Created Folder' }} isShared isActive />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">CUSTOM BUTTONS:</div>
        <div className="flex gap-6">
          <CreateNewButton />
          <InviteSection />
        </div>
      </div>
      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">IMPORT OPTION BUTTONS:</div>
        <div className="flex gap-6">
          <ImportOptionButton
            text="3D Models"
            secondaryText="GLBs"
            icon={<TechnologyIcon width={32} height={32} />}
          />
          <ImportOptionButton
            text="Images"
            secondaryText="GLBs"
            icon={<ImageIcon width={32} height={32} />}
          />
          <ImportOptionButton
            text="Videos"
            secondaryText="GLBs"
            icon={<VideoIcon width={32} height={32} />}
          />
        </div>
      </div>
      <div className="h-[1040px] m-10 p-8 bg-background-light">
        <Sidebar />
      </div>
      <div className="m-10 p-8 pb-52 bg-divider">
        <div className="text-lg font-semibold mb-8">ASSET LIST:</div>
        <AssetList
          onCreateNewAssetClick={onImportOpen}
          folderId="abcd"
          folderList={[
            { folderId: '1', title: 'Folder 1' },
            { folderId: '2', title: 'Folder 2' },
            { folderId: '3', title: 'Folder 3' },
            { folderId: '4', title: 'Folder 4' },
          ]}
          list={[
            {
              assetId: '1',
              title: 'Image Object',
              fileType: AssetType.IMAGE,
              url: 'https://picsum.photos/1000/700',
              thumbnailUrl: '',
              originalFilename: 'image.png',
              folderId: '1',
              metadata: { color: 'green' },
              creator: {
                email: 'timmy@email.com',
                firstName: 'Timmy',
                lastName: 'Doe',
                userAlias: 'timmydoe',
                profileImageSmallThumbnailUrl: null,
                name: 'Timmy Doe',
              },
            },
            {
              assetId: '2',
              title: 'Video Object',
              fileType: AssetType.VIDEO,
              url: 'https://www.w3schools.com/html/mov_bbb.mp4',
              thumbnailUrl: '',
              originalFilename: 'image.png',
              folderId: '2',
              metadata: { a: 1, b: 2, c: 3 },
              creator: {
                email: 'tommy@email.com',
                firstName: 'Tommy',
                lastName: 'Doe',
                userAlias: 'tommydoe',
                profileImageSmallThumbnailUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                name: 'Tommy Doe',
              },
            },
            {
              assetId: '3',
              title: 'Model Object',
              fileType: AssetType.MODEL,
              url: 'https://picsum.photos/1000/700',
              thumbnailUrl: '',
              originalFilename: 'image.png',
              folderId: '3',
              metadata: { a: 1 },
              creator: {
                email: 'jenny@email.com',
                firstName: 'Jenny',
                lastName: 'Doe',
                userAlias: 'jennydoe',
                profileImageSmallThumbnailUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                name: 'Jenny Doe',
              },
            },
          ]}
        />
      </div>

      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">AVATAR:</div>
        <div className="flex gap-4">
          <UserAvatar name="Jim" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
          <UserAvatar name="test" />
          <UserAvatar
            name="Jane"
            src="http://localhost:5173/storage/trace-cms-images/NjM4NTY3MzY3NjMyOTgzMjMwLWF2YXRhcl9pbWFnZS5wbmc=.png"
          />
        </div>
        <div className="flex gap-3 items-end my-5">
          <FolderShareInfo users={[]} teams={[]} />
        </div>
      </div>

      <div className="m-10 p-8 bg-divider">
        <div className="text-lg font-semibold mb-8">CREATOR INFO:</div>
        <CreatorInfo
          name="Feroz Tahir"
          avatarSrc="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
      </div>
    </div>
  );
}
