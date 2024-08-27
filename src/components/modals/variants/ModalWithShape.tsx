import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from '@nextui-org/react';
import CloseButton from '@components/buttons/CloseButton';
import WrapperWithShapes from '@/components/wrappers/WrapperWithShapes';

interface Props extends ModalProps {
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  baseSlotClassNames?: string[];
  headerSlotClassNames?: string[];
}

export default function ModalWithShape({
  isOpen,
  onOpenChange,
  title,
  footer,
  showCloseButton = true,
  baseSlotClassNames = [],
  headerSlotClassNames = [],
  children,
  ...props
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="blur"
      classNames={{
        wrapper: ['pt-[25px]'],
        base: [
          'relative',
          'gap-y-[30px]',
          'rounded-[18px]',
          'bg-transparent',
          'overflow-y-visible',
          'max-w-[500px]',
          ...baseSlotClassNames,
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
          'rounded-[18px]',
          ...headerSlotClassNames,
        ],
        body: ['px-[40px]', `py-${footer ? 0 : '[40px]'}`, 'text-center'],
        footer: ['px-[40px]', 'pb-8', 'pt-0', 'justify-normal', 'gap-x-5'],
      }}
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <WrapperWithShapes>
              <div className="z-10 bg-modal-fill backdrop-blur-modal rounded-[18px] border-[3px]">
                {showCloseButton && (
                  <CloseButton onClick={onClose} className="absolute left-[-28px] top-[-28px]" />
                )}
                <ModalHeader className="flex justify-center">{title}</ModalHeader>
                <ModalBody className="z-10">{children}</ModalBody>
                {footer && <ModalFooter>{footer}</ModalFooter>}
              </div>
            </WrapperWithShapes>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
