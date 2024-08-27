import { useState } from 'react';
import { useResendConfirmationEmailMutation, useSignUpMutation } from '@/hooks/auth';
import { UseTraceOptionText } from '@/types/Other';
import { Image } from '@nextui-org/react';
import logoPath from '@images/Trace_Logo_White.png';
import BackButton from '@/components/buttons/BackButton';
import TransparentWrapper from '@/components/wrappers/TransparentWrapper';
import platedSphereImagePath from '@images/shapes/Plated_sphere.png';
import hemisphereImagePath from '@images/shapes/Hemisphere.png';
import capsuleImagePath from '@images/shapes/Capsule.png';
import bottomTubeImagePath from '@images/shapes/Long_tube_bottom.png';
import topTubeImagePath from '@images/shapes/Long_tube_top.png';
import platedCylinderImagePath from '@images/shapes/Plated_cylinder.png';
import platonicImagePath from '@images/shapes/Platonic.png';
import SignUpOrSignInForm from '@/components/auth/SignUpOrSignInForm';
import CreatePasswordForm from '@/components/auth/CreatePasswordForm';
import VerifyEmail from '@/components/auth/VerifyEmail';
import SignInForm from '@/components/auth/SignInForm';
import UserDetailsForm from '@/components/auth/UserDetailsForm';
import ResendConfirmationEmail from '@/components/auth/ResendConfirmationEmail';

export enum AuthStep {
  EMAIL = 'email',
  USER_DETAILS = 'user_details',
  CREATE_PASSWORD = 'create_password',
  CONFIRM_EMAIL = 'confirm_email',
  SIGN_IN = 'sign_in',
  RESEND_CONFIRMATION_EMAIL = 'resend_confirmation_email',
}

export default function Auth() {
  const [values, setValues] = useState<{
    email: string;
    password: string;
    fullName: string;
    organization: string;
    usageType: UseTraceOptionText | null;
    receiveNewsletter: boolean;
  }>({
    email: '',
    password: '',
    fullName: '',
    organization: '',
    usageType: null,
    receiveNewsletter: true,
  });
  const [step, setStep] = useState<AuthStep>(AuthStep.EMAIL);
  const [isConfirmationEmailResent, setIsConfirmationEmailResent] = useState(false);

  const handleSubmitPassword = () => {
    setStep(AuthStep.USER_DETAILS);
  };

  const { handleSignUp, isSignUpPending } = useSignUpMutation({
    onSuccess: () => setStep(AuthStep.CONFIRM_EMAIL),
  });

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = () => {
    const nameArr = values.fullName.split(' ');
    handleSignUp({
      firstName: nameArr[0],
      lastName: nameArr.splice(1).join(' '),
      email: values.email,
      password: values.password,
      organization: values.organization,
      usageType: values.usageType,
      receiveNewsletter: values.receiveNewsletter,
    });
  };

  const { handleResendConfirmationEmail, isResendConfirmationEmailPending } =
    useResendConfirmationEmailMutation({ onSuccess: () => setIsConfirmationEmailResent(true) });

  return (
    <div className="bg-dark-bg-image bg-cover bg-fixed h-full relative flex ">
      <Image
        src={platedSphereImagePath}
        classNames={{
          wrapper:
            'z-10 fixed top-[50%] left-[50%] -translate-y-[15%] -translate-x-[calc(50%_+_78px)] 2xl:w-[348px] xl:w-[220px] lg:w-[200px] md:w-[190px] sm:w-[180px] max-[960px]:hidden [@media(max-height:300px)]:hidden [@media(max-height:700px)]:w-[270px]',
        }}
      />
      <Image
        src={hemisphereImagePath}
        classNames={{
          wrapper:
            'fixed left-0 top-[8%] 2xl:w-[141px] xl:w-[126px] lg:w-[90px] md:w-[80px] sm:w-[70px] w-[60px] max-[700px]:hidden',
        }}
      />
      <Image
        src={topTubeImagePath}
        classNames={{
          wrapper:
            'z-10 fixed right-[8%] top-0 2xl:w-[451px] xl:w-[300px] lg:w-[280px] md:w-[260px] sm:w-[220px] w-[200px] [@media(max-height:800px)]:hidden',
        }}
      />
      <Image
        src={capsuleImagePath}
        classNames={{
          wrapper:
            'z-10 fixed right-0 top-[30%] 2xl:w-[49px] xl:w-[44px] lg:w-[29px] md:w-[34px] sm:w-[29px] w-[24px]',
        }}
      />
      <Image
        src={bottomTubeImagePath}
        classNames={{
          wrapper:
            'z-10 fixed bottom-0 left-[12%] 2xl:w-[451px] xl:w-[270px] lg:w-[240px] md:w-[200px] sm:w-[180px] w-[150px] [@media(max-height:800px)]:hidden max-[700px]:hidden',
        }}
      />
      <Image
        src={platonicImagePath}
        classNames={{
          wrapper:
            'z-10 fixed top-0 left-[27%] 2xl:w-[209px] xl:w-[188px] lg:w-[115px] md:w-[100px] sm:w-[95px] w-[80px] max-[700px]:hidden',
        }}
      />
      <Image
        src={platedCylinderImagePath}
        classNames={{
          wrapper:
            'z-10 fixed bottom-[20%] left-[12%] md:left-[5%] 2xl:w-[172px] xl:w-[140px] lg:w-[110px] md:w-[100px] sm:w-[95px] w-[86px] [@media(max-height:400px)]:hidden max-[700px]:hidden [@media(max-height:800px)]:bottom-[5%] [@media(max-height:600px)]:hidden',
        }}
      />
      <div className="basis-6/12 h-[100vh] max-[700px]:hidden"></div>
      <div className="basis-0 h-[100vh]"></div>
      <div className="basis-6/12 grow">
        <TransparentWrapper>
          <div className="my-[195px] 2xl:pl-[150px] xl:pl-[100px] md:pl-[80px] px-[30px] [@media(max-height:800px)]:my-12 max-[700px]:center max-[700px]:my-12">
            <BackButton
              className="mb-10"
              onClick={() => {
                if (step === AuthStep.EMAIL) {
                  window.location.href = 'https://www.trace3d.app';
                } else if (step === AuthStep.CREATE_PASSWORD) {
                  setStep(AuthStep.EMAIL);
                } else if (step === AuthStep.CONFIRM_EMAIL || step === AuthStep.SIGN_IN) {
                  setStep(AuthStep.EMAIL);
                } else if (step === AuthStep.USER_DETAILS) {
                  setStep(AuthStep.CREATE_PASSWORD);
                } else if (step === AuthStep.RESEND_CONFIRMATION_EMAIL) {
                  setStep(AuthStep.EMAIL);
                }
              }}
            />
            <Image src={logoPath} className="mb-[18px] ml-[-18px] z-50" width={238} height={54} />
            {step === AuthStep.EMAIL && (
              <SignUpOrSignInForm
                email={values.email}
                onChange={handleChange}
                displayNextStep={(step) => setStep(step)}
              />
            )}
            {step === AuthStep.CREATE_PASSWORD && (
              <CreatePasswordForm
                email={values.email}
                password={values.password}
                onChange={handleChange}
                onSubmit={handleSubmitPassword}
              />
            )}
            {step === AuthStep.USER_DETAILS && (
              <UserDetailsForm
                values={values}
                onChange={handleChange}
                isLoading={isSignUpPending}
                onSubmit={handleSubmitRegistration}
              />
            )}
            {step === AuthStep.CONFIRM_EMAIL && (
              <VerifyEmail email={values.email} displaySignIn={() => setStep(AuthStep.SIGN_IN)} />
            )}
            {step === AuthStep.SIGN_IN && <SignInForm email={values.email} />}
            {step === AuthStep.RESEND_CONFIRMATION_EMAIL && (
              <ResendConfirmationEmail
                email={values.email}
                displaySignIn={() => setStep(AuthStep.SIGN_IN)}
                resendConfirmationEmail={() => handleResendConfirmationEmail(values.email)}
                isLoading={isResendConfirmationEmailPending}
                isResent={isConfirmationEmailResent}
              />
            )}
          </div>
        </TransparentWrapper>
      </div>
    </div>
  );
}
