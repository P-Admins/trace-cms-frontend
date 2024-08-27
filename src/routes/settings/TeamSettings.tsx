import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Tabs, Tab } from '@nextui-org/react';
import { Key } from 'react';
import YourTeam from '@/components/settings/team/YourTeam';
import TeamMembers from '@/components/settings/team/TeamMembers';
import Billing from '@/components/settings/team/Billing';
import PurchaseHistory from '@/components/settings/team/PurchaseHistory';
import { useGetTeamDetailsQuery } from '@/hooks/team';

export default function TeamSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const navigate = useNavigate();
  const { tab } = useParams();

  const handleTabChange = (key: Key) => {
    navigate(`/settings/team/${key}?teamId=${teamId}`);
  };

  const selectedKey = tab || 'your-team';

  const { team, isGetTeamDetailsLoading } = useGetTeamDetailsQuery(teamId);

  return (
    <div className="bg-content1 h-full 2xl:p-20 p-5 w-full z-10">
      <div className="w-full">
        <Tabs
          aria-label="Team Settings"
          classNames={{ base: 'w-full max-w-2xl', tabList: 'w-full max-w-2xl', panel: 'px-0' }}
          selectedKey={selectedKey}
          onSelectionChange={handleTabChange}
        >
          <Tab key="your-team" title="Your Team">
            <YourTeam
              teamId={teamId || ''}
              teamName={team?.name || ''}
              teamDescription={team?.description || ''}
              teamProfileImgSrc={team?.profileImageThumbnailUrl || ''}
              permissionType={team?.permissionType || null}
              isLoading={isGetTeamDetailsLoading}
            />
          </Tab>
          <Tab key="team-members" title="Team Members">
            <TeamMembers permissionType={team?.permissionType || null} />
          </Tab>
          <Tab key="billing" title="Billing">
            <Billing />
          </Tab>
          <Tab key="purchase-history" title="Purchase History">
            <PurchaseHistory />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
