import { useEffect } from 'react';
import { useDisclosure } from '@nextui-org/react';

interface Props {
  preventOpen?: boolean;
  beforeOpen?: () => void;
}

const useDragAndDropVisibility = ({ preventOpen = false, beforeOpen = () => {} }: Props = {}) => {
  const {
    isOpen: isDragAndDropOpen,
    onOpenChange: onDragAndDropOpenChange,
    onOpen: onDragAndDropOpen,
    onClose: onDragAndDropClose,
  } = useDisclosure();

  useEffect(() => {
    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault();
      if (!preventOpen && !isDragAndDropOpen) {
        if (beforeOpen) {
          beforeOpen();
        }
        onDragAndDropOpen();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
    };
  }, [preventOpen, beforeOpen]);

  return {
    isDragAndDropOpen,
    onDragAndDropOpenChange,
    onDragAndDropClose,
  };
};

export default useDragAndDropVisibility;
