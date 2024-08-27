import BasicModal from './variants/BasicModal';
import BasicInput from '../inputs/BasicInput';
import PrimaryGradientButton from '../buttons/PrimaryGradientButton';

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  label: string;
  isLoading?: boolean;
}

export default function CreateOrRenameModal({
  isOpen,
  onOpenChange,
  onConfirm,
  name,
  onChange,
  onClose,
  title,
  label,
  isLoading,
}: Props) {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onConfirm) {
      onConfirm();
    }
  };

  return (
    <BasicModal
      title={title}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      footer={
        <PrimaryGradientButton
          text="Confirm"
          className="w-full"
          onClick={onConfirm}
          isLoading={isLoading}
        />
      }
    >
      <BasicInput
        label={label}
        placeholder="Add name here..."
        value={name}
        onChange={onChange}
        onKeyDown={handleKeyPress}
      />
    </BasicModal>
  );
}
