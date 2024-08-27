import { Divider, useDisclosure } from '@nextui-org/react';
import { useAuth } from '@/hooks/useAuth';
import GrayButton from '@/components/buttons/GrayButton';
import BlackTextButton from '@/components/buttons/BlackTextButton';
import DeleteModal from '@/components/modals/DeleteModal';
import UpdatePasswordModal from '@/components/modals/UpdatePasswordModal';

interface Props {
  onDeleteAccount: () => void;
  isDeleteAccountLoading: boolean;
}

export default function LoginAndSecurity({ onDeleteAccount, isDeleteAccountLoading }: Props) {
  const { user, logout, isLoggingOut } = useAuth();

  const {
    isOpen: isDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isUpdatePasswordModalOpen,
    onOpenChange: onUpdatePasswordModalOpenChange,
    onOpen: onUpdatePasswordModalOpen,
    onClose: onUpdatePasswordModalClose,
  } = useDisclosure();

  return (
    <>
      <div className="flex flex-col gap-9 pt-4">
        <h5 className="font-extrabold mb-4">Log in</h5>
        <div className="flex justify-between items-center">
          <div>
            <p>Password</p>
            <p className="text-md text-default-400 mt-1">
              Password last updated: {user?.datePasswordChanged || 'Never'}
            </p>
          </div>
          <GrayButton text="Update" className="w-[145px]" onClick={onUpdatePasswordModalOpen} />
        </div>
        <Divider />
        <div>
          <p>Sign Out From All Devices</p>
          <p className="text-md text-default-400 mt-1">
            Logged in on a shared device but forgot to sign out? End all sessions by signing out
            from all devices.
          </p>
          <BlackTextButton
            text="Sign Out From All Devices"
            className="ml-10 mt-6"
            onClick={logout}
            isLoading={isLoggingOut}
          />
        </div>
        <Divider />
        <div>
          <p>Delete Your Account</p>
          <p className="text-md text-default-400 mt-1">
            By deleting your account, you'll no longer be able to access any of your designs or log
            in to Trace.
          </p>
          <BlackTextButton
            text="Delete Account"
            className="ml-10 mt-6"
            onClick={onDeleteModalOpen}
          />
        </div>
      </div>
      <DeleteModal
        onConfirm={onDeleteAccount}
        isLoading={isDeleteAccountLoading}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onClose={onDeleteModalClose}
        title="Delete Account"
        message="Are you sure you want to delete your account?"
        additionalMessage="By deleting your account, you'll no longer be able to access any of your designs or log in to Trace."
      />
      <UpdatePasswordModal
        email={user?.email}
        isOpen={isUpdatePasswordModalOpen}
        onOpenChange={onUpdatePasswordModalOpenChange}
        onClose={onUpdatePasswordModalClose}
      />
    </>
  );
}
