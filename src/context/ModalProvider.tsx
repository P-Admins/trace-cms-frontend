import { createContext, PropsWithChildren } from 'react';
import { UseDisclosureProps, useDisclosure } from '@nextui-org/react';
import { useCreateTeamMutation } from '@/hooks/team';
import CreateTeamModal from '@/components/modals/CreateTeamModal';
import { useAuth } from '@/hooks/useAuth';
import { getUserDisplayName } from '@/lib/utils';

export interface ModalContext {
  createModalProps?: UseDisclosureProps;
}

type ModalProviderProps = PropsWithChildren & {};

const ModalContext = createContext<ModalContext>({ createModalProps: undefined });

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const createModalProps = useDisclosure();

  const {
    isOpen: isCreateTeamModalOpen,
    onOpenChange: onCreateTeamModalOpenChange,
    onOpen: onCreateTeamModalOpen,
    onClose: onCreateTeamModalClose,
  } = createModalProps;

  const { handleCreateTeam, isCreateTeamPending } = useCreateTeamMutation({
    onSuccess: onCreateTeamModalClose,
  });

  const { user } = useAuth();
  const name = getUserDisplayName(user);

  return (
    <ModalContext.Provider value={{ createModalProps }}>
      <>
        {children}
        {user && (
          <CreateTeamModal
            currentMemberName={{
              email: user?.email || '',
              fullName: name,
              profileImageSmallThumbnailUrl: user?.profileImageSmallThumbnailUrl,
            }}
            isOpen={isCreateTeamModalOpen}
            onOpenChange={onCreateTeamModalOpenChange}
            onConfirm={handleCreateTeam}
            isLoading={isCreateTeamPending}
          />
        )}
      </>
    </ModalContext.Provider>
  );
};

export default ModalContext;
