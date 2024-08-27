import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from '@nextui-org/react';
import CloseButton from '@components/buttons/CloseButton';

interface Props extends ModalProps {
  footer: React.ReactNode;
}

export default function BasicModal({
  isOpen,
  onOpenChange,
  title,
  footer,
  children,
  ...props
}: Props) {
  const modalContainer = document.getElementById('modal-container') as HTMLElement;
  const { classNames, ...modalProps } = props;

  return (
    <Modal
      portalContainer={modalContainer}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="blur"
      classNames={{
        wrapper: ['pt-[25px]'],
        base: [
          'gap-y-[30px]',
          'rounded-[18px]',
          'bg-modal-fill',
          'backdrop-blur-modal',
          'border-[3px]',
          'overflow-y-visible',
          'max-w-[500px]',
          ...(classNames?.base || []),
        ],
        header: [
          'pt-[40px]',
          'px-[40px]',
          'pb-0',
          'text-3xl',
          'tracking-wider',
          'bg-gradient-main',
          'bg-clip-text',
          'text-transparent',
          ...(classNames?.header || []),
        ],
        body: ['px-[40px]', 'py-0', 'text-center', ...(classNames?.body || [])],
        footer: [
          'px-[40px]',
          'pb-8',
          'pt-0',
          'justify-normal',
          'gap-x-5',
          ...(classNames?.footer || []),
        ],
      }}
      {...modalProps}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <CloseButton onClick={onClose} className="absolute left-[-28px] top-[-28px]" />
            <ModalHeader className="text-center	break-all">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>{footer}</ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
