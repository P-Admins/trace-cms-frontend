import { MouseEvent, useState } from 'react';
import { appleSignInRedirectURI } from '@/api/config';
import { ZodError, z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { checkUserEmail } from '@/api/auth';
import { AuthStep } from '@/routes/Auth';
import { useGoogleLogin } from '@react-oauth/google';
import { APPLE_CLIENT_ID } from '@/lib/constants';
import { useLoginWithGoogleMutation } from '@/hooks/auth';
import { useAuth } from '@/hooks/useAuth';
import AppleSignInButton from 'react-apple-signin-auth';
import GoogleLogoIcon from '@icons/GoogleLogo.svg?react';
import AppleLogoIcon from '@icons/AppleLogo.svg?react';
import TransparentInput from '@components/inputs/TransparentInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';
import WhiteButton from '@components/buttons/WhiteButton';

interface Props {
  email: string;
  onChange: (name: string, value: string) => void;
  displayNextStep: (step: AuthStep) => void;
}

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email({ message: 'Invalid email address' });

function SignUpOrSignInForm({ email, onChange, displayNextStep }: Props) {
  const { setAuth } = useAuth();

  const [error, setError] = useState('');

  const { mutate: handleCheckIsRegistered, isPending } = useMutation({
    mutationFn: checkUserEmail,
    retry: 0,
  });

  const { handleLoginWithGoogle, isLoginWithGooglePending } = useLoginWithGoogleMutation({
    onSuccess: (data) => setAuth(data.access_token),
    onError: (error) => {
      setError(typeof error === 'string' ? error : error?.message || 'An error occurred');
    },
  });

  const handleSubmit = (e?: MouseEvent) => {
    e?.preventDefault();
    setError('');
    try {
      emailSchema.parse(email);
      handleCheckIsRegistered(email, {
        onSuccess: (data) => {
          if (data.accountExists && data.isRegistered) {
            displayNextStep(AuthStep.SIGN_IN);
          } else if (data.accountExists && !data.isRegistered) {
            displayNextStep(AuthStep.RESEND_CONFIRMATION_EMAIL);
          } else if (!data.accountExists && !data.isRegistered) {
            displayNextStep(AuthStep.CREATE_PASSWORD);
          }
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0]?.message || 'Invalid email');
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const signInWithApple = (data: any) => {
    // https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple#3331292
    console.log('data', data);
    const { authorization, user } = data;

    // Here you can send data to your backend service and process the response
    // further based on your requirements
  };

  const signInWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    state: 'state',
    scope: 'email profile openid',
    onSuccess: (response) => handleLoginWithGoogle(response.code),
  });

  console.log(
    'ENV',
    import.meta.env.VITE_APPLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.DEV
  );

  console.log('appleSignInRedirectURI', appleSignInRedirectURI);

  return (
    <div>
      <p className="text-2xl text-content1 font-light mb-[54px] opacity-90">
        The Simplest Way to Create AR Experiences
      </p>
      <p className="text-2xl text-content1 font-extrabold mb-5 opacity-90">Sign Up or Sign In</p>
      <TransparentInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        name="email"
        onChange={(event) => onChange(event.target.name, event.target.value)}
        isInvalid={!!error}
        errorMessage={error}
        onKeyDown={handleKeyPress}
      />
      <PrimaryGradientButton
        onClick={handleSubmit}
        variant="light"
        text="Continue with Email"
        className="mt-[26px] w-full max-w-[402px]"
        isLoading={isPending}
      />
      <div className="w-[402px] flex flex-col gap-[18px] mt-6">
        <div className="flex items-center gap-4 opacity-90">
          <div className="border-b-[1px] grow"></div>
          <span className="grow-0 text-sm text-content1">Or</span>
          <div className="border-b-[1px] grow"></div>
        </div>
        <WhiteButton
          startContent={<GoogleLogoIcon width={24} height={24} />}
          text="Continue with Google"
          className="text-sm text-default-900 font-semibold w-full"
          isLoading={isLoginWithGooglePending}
          onClick={signInWithGoogle}
        />
        <AppleSignInButton
          authOptions={{
            clientId: APPLE_CLIENT_ID,
            scope: 'email name',
            redirectURI: appleSignInRedirectURI,
            nonce: 'nonce',
            usePopup: true,
            state: '',
          }}
          uiType="light"
          noDefaultStyle={false}
          onSuccess={signInWithApple}
          onError={(error: string) => console.error('apple error', error)}
          render={(props: any) => (
            <WhiteButton
              {...props}
              startContent={<AppleLogoIcon width={24} height={24} />}
              text="Continue with Apple"
              className="text-sm text-default-900 font-semibold w-full"
            />
          )}
        />
      </div>
    </div>
  );
}

export default SignUpOrSignInForm;
