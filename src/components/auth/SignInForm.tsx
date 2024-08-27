import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginMutation } from '@/hooks/auth';
import TransparentInput from '@components/inputs/TransparentInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';

interface Props {
  email: string;
}

function SignInForm({ email }: Props) {
  const { setAuth } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      setPassword('');
    };
  }, []);

  const { handleLogin, isLoginPending } = useLoginMutation({
    onSuccess: (data) => setAuth(data.access_token),
    onError: (error) => {
      setError(typeof error === 'string' ? error : error?.message || 'An error occurred');
    },
  });

  const handleLogIn = () => {
    handleLogin({ email, password });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogIn();
    }
  };

  return (
    <div>
      <p className="text-2xl text-content1 font-extrabold mb-5 opacity-90">Sign In</p>
      <TransparentInput
        value={password}
        placeholder="Enter Password"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        isInvalid={!!error}
        errorMessage={error}
        onKeyDown={handleKeyPress}
        autoFocus
      />
      <PrimaryGradientButton
        isLoading={isLoginPending}
        variant="light"
        text="Sign In"
        className="mt-[26px] w-full max-w-[402px]"
        isDisabled={password.length === 0}
        onClick={handleLogIn}
      />
      <p className="text-sm text-content1 mb-5 mt-5 opacity-90 max-w-[252px] hover:text-primary-600 transition-all ease-in-out">
        <Link to="/">Forgot Password?</Link>
      </p>
    </div>
  );
}

export default SignInForm;
