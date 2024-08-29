import BasicModal from './variants/BasicModal';
import WhiteButton from '@components/buttons/WhiteButton';
import DeleteButton from '@components/buttons/DeleteButton';

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  title?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  message: string;
  additionalMessage?: string;
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  onClose,
  title,
  onConfirm,
  isLoading,
  message,
  additionalMessage,
}: Props) {
  return (
    <BasicModal
      title={title}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        header: ['justify-center'],
      }}
      footer={
        <>
          <WhiteButton text="Cancel" className="w-full" onClick={onClose} isDisabled={isLoading} />
          <DeleteButton
            text="Delete"
            className="w-full"
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </>
      }
    >
      <p>{message}</p>
      {!!additionalMessage && <p className="text-left">{additionalMessage}</p>}
    </BasicModal>
  );
}
