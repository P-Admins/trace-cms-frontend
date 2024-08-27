import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, Tab } from '@nextui-org/react';
import { Key } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateUserProfileMutation, useDeleteUserAccountMutation } from '@/hooks/user';
import Profile, { UserData } from '@/components/settings/user/Profile';
import LoginAndSecurity from '@/components/settings/user/LoginAndSecurity';
import Privacy from '@/components/settings/user/Privacy';
import Billing from '@/components/settings/user/Billing';

export default function UserSettings() {
  const navigate = useNavigate();
  const { tab } = useParams();

  const handleTabChange = (key: Key) => {
    navigate(`/settings/user/${key}`);
  };

  const selectedKey = tab || 'profile';

  const { user } = useAuth();
  const data = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    name: user?.name || '',
    avatarUrl: user?.profileImageThumbnailUrl || undefined,
  };

  const { handleUpdateUserProfile, isUpdateUserProfilePending } = useUpdateUserProfileMutation();
  const { handleDeleteUserAccount, isDeleteUserAccountPending } = useDeleteUserAccountMutation();

  const handleUpdateProfile = async (data: UserData | null, avatar: File | null) => {
    if (!user?.userId) return;

    handleUpdateUserProfile({
      userData: data
        ? {
            userId: user.userId,
            firstName: data.firstName,
            lastName: data.lastName,
          }
        : null,
      profileImage: avatar || null,
    });
  };

  const handleDeleteAccount = () => {
    if (!user?.userId) return;

    handleDeleteUserAccount(user.userId);
  };

  return (
    <div className="bg-content1 h-full p-20 w-full">
      <div className="w-full max-w-2xl">
        <Tabs
          aria-label="User Settings"
          classNames={{ base: 'w-full', tabList: 'w-full', panel: 'px-0' }}
          selectedKey={selectedKey}
          onSelectionChange={handleTabChange}
        >
          <Tab key="profile" title="Profile">
            <Profile
              data={data}
              onUpdateClick={handleUpdateProfile}
              isLoading={isUpdateUserProfilePending}
            />
          </Tab>
          <Tab key="login&security" title="Login & Security">
            <LoginAndSecurity
              onDeleteAccount={handleDeleteAccount}
              isDeleteAccountLoading={isDeleteUserAccountPending}
            />
          </Tab>
          <Tab key="privacy" title="Privacy">
            <Privacy />
          </Tab>
          <Tab key="billing" title="Billing">
            <Billing />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
