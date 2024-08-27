import TextButton from '@components/buttons/TextButton';

interface Props {
  email: string;
  displaySignIn: () => void;
}
export default function VerifyEmail({ email, displaySignIn }: Props) {
  return (
    <div className="mt">
      <p className="text-2xl text-content1 font-extrabold mb-5 opacity-90">
        Registration almost complete!
      </p>
      <p className="text-lg text-content1  opacity-90">
        We have sent a verification email to {email}.
      </p>
      <p className="text-lg text-content1 opacity-90">
        After verifying email, you will be able to
        <TextButton
          text="sign in"
          onClick={displaySignIn}
          className="text-primary-600 text-lg p-0 hover:bg-transparent"
        />
        with your account.
      </p>
    </div>
  );
}
