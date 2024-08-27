import { ZodError, z } from 'zod';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { passwordSchema } from '@/lib/validationSchemas';
import TransparentInput from '@components/inputs/TransparentInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';

interface Props {
  email: string;
  password: string;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
}

function CreatePasswordForm({ email, password, onChange, onSubmit }: Props) {
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const handleSubmit = (password: string) => {
    setError('');
    try {
      passwordSchema.parse(password);
      onSubmit();
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0]?.message || 'Invalid password');
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(password);
    }
  };

  return (
    <div>
      <p className="text-2xl text-content1 font-extrabold mb-5 opacity-90">Finish Signing Up</p>
      <TransparentInput
        value={password}
        label={`You're creating an account with ${email}`}
        placeholder="Create Password"
        onChange={(event) => onChange(event.target.name, event.target.value)}
        type="password"
        name="password"
        isInvalid={!!error}
        errorMessage={error}
        autoComplete="new-password"
        onKeyDown={handleKeyPress}
      />
      <PrimaryGradientButton
        variant="light"
        text="Create Account"
        className="mt-[26px] w-full max-w-[402px]"
        onClick={() => handleSubmit(password)}
      />
      <p className="text-sm text-content1 mb-5 mt-5 opacity-90 max-w-[252px]">
        By selecting 'Create Account,' I agree to the Trace{' '}
        <Link to="/" className="text-primary-600">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/" className="text-primary-600">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

export default CreatePasswordForm;
