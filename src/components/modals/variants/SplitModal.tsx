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
  imageSrc: string;
  secondImageSrc?: string;
  imagePosition?: 'right' | 'left';
  baseSlotClassNames?: string[];
  imageWrapperClassNames?: string;
}

export default function SplitModal({
  isOpen,
  onOpenChange,
  title,
  footer,
  children,
  imageSrc,
  secondImageSrc,
  imagePosition = 'left',
  baseSlotClassNames = [],
  imageWrapperClassNames = '',
  ...props
}: Props) {
  const modalContainer = document.getElementById('modal-container') as HTMLElement;

  return (
    <Modal
      portalContainer={modalContainer}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="blur"
      scrollBehavior="outside"
      classNames={{
        base: [
          'flex',
          imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row',
          'rounded-[18px]',
          'bg-modal-fill',
          'max-h-[calc(100vh-8rem)]',
          'backdrop-blur-modal',
          'overflow-y-visible',
          'max-w-[1004px]',
          'self-center',
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
        ],
        body: ['px-[40px]', 'py-0', 'gap-y-[30px]'],
        footer: ['px-[40px]', 'pb-8', 'pt-0', 'justify-normal', 'gap-x-5'],
      }}
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div
              className={`flex flex-col w-full max-w-[400px] overflow-clip ${imagePosition === 'right' ? 'rounded-r-[18px]' : 'rounded-l-[18px]'} ${imageWrapperClassNames}`}
            >
              <img src={imageSrc} className="w-full h-full object-cover object-center" />
              {secondImageSrc && (
                <img src={secondImageSrc} className="w-full h-full object-cover object-center" />
              )}
            </div>
            <div
              className={`flex flex-col w-full gap-y-[30px] border-y-[3px] border-r-[3px] ${imagePosition === 'right' ? 'rounded-l-[18px]' : 'rounded-r-[18px]'} `}
            >
              <CloseButton onClick={onClose} className="absolute left-[-28px] top-[-28px]" />
              <ModalHeader>{title}</ModalHeader>
              <div className="overflow-y-auto ">
                <ModalBody>{children}</ModalBody>
              </div>
              <ModalFooter className="mt-auto">{footer}</ModalFooter>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
