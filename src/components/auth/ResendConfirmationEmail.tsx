import TextButton from '@components/buttons/TextButton';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';
import { Icon } from '@iconify/react';
interface Props {
  email: string;
  isLoading: boolean;
  isResent: boolean;
  displaySignIn: () => void;
  resendConfirmationEmail: () => void;
}
export default function ResendConfirmationEmail({
  email,
  isLoading,
  isResent,
  resendConfirmationEmail,
  displaySignIn,
}: Props) {
  return (
    <div className="mt">
      <p className="text-2xl text-content1 font-extrabold opacity-90">
        You have already signed up with this email.
      </p>
      <p className="text-2xl text-content1 font-extrabold mb-8 opacity-90">
        Please check your mailbox and click the link in the email.
      </p>
      <p className="text-lg text-content1 opacity-90 mb-10">
        If you haven't received the email, click the button below to resend the confirmation email.
      </p>
      <PrimaryGradientButton
        variant="light"
        endContent={isResent && <Icon icon="fa-solid:check" />}
        text={isResent ? 'Confirmation Email Resent' : 'Resend Confirmation Email'}
        isLoading={isLoading}
        isDisabled={isResent}
        onClick={resendConfirmationEmail}
      />
      <div className="flex mt-5 items-center gap-2">
        <p className="text-md text-content1 opacity-90 leading-normal">
          After confirming the mail, you can
        </p>
        <TextButton
          text="sign in to your account."
          onClick={displaySignIn}
          className="text-primary-600 text-md leading-normal p-0 hover:bg-transparent"
        />
      </div>
    </div>
  );
}
