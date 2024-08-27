import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { TeamMember, TeamRole } from '@/types/Team';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
  Spinner,
} from '@nextui-org/react';
import BorderButton from '@components/buttons/BorderButton';
import RowsPerPageSelector from '@components/tables/RowsPerPageSelector';
import TablePagination from '@components/tables/TablePagination';
import MemberRoleCell from '@components/tables/cells/MemberRoleCell';
import UserNameAndAvatarCell from '@components/tables/cells/UserNameAndAvatarCell';
import { cn } from '@/lib/cn';

type Props = {
  members: TeamMember[];
  isGetMembersLoading: boolean;
  onRemoveMember?: (user: TeamMember) => void;
  onRoleUpdate?: (user: TeamMember, role: TeamRole) => void;
  permissionType: TeamRole | null;
  className?: string;
};

export default function TeamTable({
  members,
  isGetMembersLoading,
  onRemoveMember = () => {},
  onRoleUpdate = () => {},
  permissionType,
  className = '',
}: Props) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);

  const pages = Math.ceil(members.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return members.slice(start, end);
  }, [page, members, rowsPerPage]);

  const sortedItems = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) return items;

    return [...items].sort((a: TeamMember, b: TeamMember) => {
      const first = a[sortDescriptor.column as keyof TeamMember] || 0;
      const second = b[sortDescriptor.column as keyof TeamMember] || 0;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const ownerCount = useMemo(() => {
    return members.filter((member) => member.permissionType === TeamRole.OWNER).length;
  }, [members]);

  const renderCell = useCallback(
    (user: TeamMember, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof TeamMember];

      switch (columnKey) {
        case 'name':
          return (
            <UserNameAndAvatarCell
              name={user.firstName ? `${user.firstName} ${user.lastName || ''}` : ''}
              avatar={user.profileImageSmallThumbUrl}
              email={user.email}
            />
          );
        case 'permissionType':
          return (
            <MemberRoleCell
              value={(cellValue as string | undefined) || 'N/A'}
              member={user}
              onRoleUpdate={onRoleUpdate}
              enableRoleUpdate={
                !!user.userId &&
                permissionType === TeamRole.OWNER &&
                (user.permissionType !== TeamRole.OWNER || ownerCount > 1)
              }
              isInvited={!user.userId}
            />
          );
        case 'remove':
          return (
            !!user.userId &&
            permissionType === TeamRole.OWNER &&
            (user.permissionType !== TeamRole.OWNER || ownerCount > 1) && (
              <BorderButton text="Remove" onClick={() => onRemoveMember(user)} />
            )
          );
        case 'email':
          return cellValue || 'N/A';
        default:
          return cellValue;
      }
    },
    [members, permissionType, ownerCount]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => <RowsPerPageSelector onRowsPerPageChange={onRowsPerPageChange} />,
    [columns, onRowsPerPageChange, members.length]
  );

  const bottomContent = useMemo(() => {
    return (
      <TablePagination
        page={page}
        totalPages={pages}
        onPageChange={setPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    );
  }, [items.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Team Members Table"
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        className={`gap-0 ${className}`}
        classNames={{
          wrapper: 'shadow-none',
          thead: ['[&_tr]:border-b-0'],
          th: ['bg-background', 'text-default-900', 'text-lg', 'font-bold'],
          tr: ['border-b-[1px]', 'border-default-200', 'last:border-b-0'],
          td: ['py-[22px]'],
        }}
        topContent={topContent}
        topContentPlacement="inside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader className="" columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
              className=" "
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={'No users found'}
          loadingContent={<Spinner />}
          isLoading={isGetMembersLoading}
        >
          {sortedItems.map((item) => (
            <TableRow key={item.userId} className={cn(!item.userId && 'text-default-400')}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Email', uid: 'email', sortable: true },
  { name: 'Role', uid: 'permissionType', sortable: true },
  { name: '', uid: 'remove' },
];
