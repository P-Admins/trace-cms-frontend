import { TeamMember, TeamRole } from '@/types/Team';
import BasicDropdown from '@/components/dropdown/BasicDropdown';

type Props = {
  value: string | number;
  member: TeamMember;
  onRoleUpdate: (user: TeamMember, role: TeamRole) => void;
  enableRoleUpdate: boolean;
  isInvited: boolean;
};

function MemberRoleCell({ value, member, onRoleUpdate, enableRoleUpdate, isInvited }: Props) {
  return (
    <div className="flex items-center">
      <p className="text-bold text-small capitalize w-14">{`${isInvited ? '(Invited)' : ''} ${value}`}</p>
      {enableRoleUpdate && (
        <div className="relative flex justify-end items-center gap-2 ">
          <BasicDropdown
            className="min-w-32"
            dropdownItems={[
              { text: 'Owner', onClick: () => onRoleUpdate(member, TeamRole.OWNER) },
              { text: 'Editor', onClick: () => onRoleUpdate(member, TeamRole.EDITOR) },
              { text: 'Viewer', onClick: () => onRoleUpdate(member, TeamRole.VIEWER) },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default MemberRoleCell;
