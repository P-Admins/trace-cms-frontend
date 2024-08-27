import { useMemo } from 'react';
import { FolderPermission, FolderPermissionLabel } from '@/types/Folder';
import { Icon } from '@iconify/react';
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Selection,
} from '@nextui-org/react';

interface Props {
  isDisabled?: boolean;
  selectedPermissionKeys: Selection;
  setSelectedPermissionKeys: (selection: Selection) => void;
}

export default function PermissionDropdown({
  isDisabled,
  selectedPermissionKeys,
  setSelectedPermissionKeys,
}: Props) {
  const selectedPermission = useMemo(
    () => Array.from(selectedPermissionKeys).map((key) => key as FolderPermission)[0],
    [selectedPermissionKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="text-default-400 text-lg"
          endContent={
            <span className="hidden sm:flex text-default-500">
              <Icon icon="solar:alt-arrow-down-linear" />
            </span>
          }
          size="sm"
          variant="light"
          isDisabled={isDisabled}
        >
          {FolderPermissionLabel[selectedPermission]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Permission selection"
        selectedKeys={selectedPermissionKeys}
        selectionMode="single"
        onSelectionChange={setSelectedPermissionKeys}
        disallowEmptySelection
      >
        <DropdownItem key={FolderPermission.VIEWER}>
          {FolderPermissionLabel[FolderPermission.VIEWER]}
        </DropdownItem>
        <DropdownItem key={FolderPermission.EDITOR}>
          {FolderPermissionLabel[FolderPermission.EDITOR]}
        </DropdownItem>
        <DropdownItem key={FolderPermission.OWNER}>
          {FolderPermissionLabel[FolderPermission.OWNER]}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
