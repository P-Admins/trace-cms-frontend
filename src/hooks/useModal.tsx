import ModalContext from '@/context/ModalProvider';
import { useContext } from 'react';

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within an ModalProvider');
  }
  return context;
}
