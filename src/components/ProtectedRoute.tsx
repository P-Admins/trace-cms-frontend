import { PropsWithChildren } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FullPageLoading from '@components/FullPageLoading';

type Props = PropsWithChildren;

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();

  if (user) {
    return children;
  }

  return <FullPageLoading />;
}
