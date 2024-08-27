import {
  LoginResponse,
  SignUpResponse,
  login,
  resendConfirmationEmail,
  signUp,
  updatePassword,
  loginWithGoogle,
} from '@/api/auth';
import { GenericResponse } from '@/types/Other';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from './user';

export const useSignUpMutation = (options: {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (err: any) => void;
}) => {
  const { mutate: handleSignUp, isPending: isSignUpPending } = useMutation({
    mutationFn: signUp,
    retry: 0,
    onSuccess: (data) => {
      options.onSuccess && options.onSuccess(data);
    },
    onError: (error) => {
      console.error('error', error);
      toast.error(typeof error === 'string' ? error : 'An error ocurred when registering user');
      options.onError && options.onError(error);
    },
  });

  return { handleSignUp, isSignUpPending };
};

export const useLoginMutation = (options: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (err: any) => void;
}) => {
  const navigate = useNavigate();
  const { mutate: handleLogin, isPending: isLoginPending } = useMutation({
    mutationFn: login,
    retry: 0,
    onSuccess: (data) => {
      navigate('/my-workspace');
      options.onSuccess && options.onSuccess(data);
    },
    onError: (error) => {
      console.error('error', error);
      options.onError && options.onError(error);
    },
  });

  return { handleLogin, isLoginPending };
};

export const useLoginWithGoogleMutation = (options: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (err: any) => void;
}) => {
  const navigate = useNavigate();
  const { mutate: handleLoginWithGoogle, isPending: isLoginWithGooglePending } = useMutation({
    mutationFn: loginWithGoogle,
    retry: 0,
    onSuccess: (data) => {
      navigate('/my-workspace');
      options.onSuccess && options.onSuccess(data);
    },
    onError: (error) => {
      console.error('error', error);
      options.onError && options.onError(error);
    },
  });

  return { handleLoginWithGoogle, isLoginWithGooglePending };
};

export const useResendConfirmationEmailMutation = (
  options: {
    onSuccess?: (data: GenericResponse) => void;
    onError?: (err: any) => void;
  } = {}
) => {
  const { mutate: handleResendConfirmationEmail, isPending: isResendConfirmationEmailPending } =
    useMutation({
      mutationFn: resendConfirmationEmail,
      retry: 0,
      onSuccess: (data) => {
        options.onSuccess && options.onSuccess(data);
      },
      onError: (error) => {
        console.error('error', error);
        toast.error(
          typeof error === 'string' ? error : 'An error ocurred when resending confirmation email'
        );
        options.onError && options.onError(error);
      },
    });

  return { handleResendConfirmationEmail, isResendConfirmationEmailPending };
};

export const useUpdatePasswordMutation = (
  options: {
    onSuccess?: (data: GenericResponse) => void;
    onError?: (err: string) => void;
    showErrorToast?: boolean;
  } = {}
) => {
  const queryClient = useQueryClient();
  const { mutate: handleUpdatePassword, isPending: isUpdatePasswordPending } = useMutation({
    mutationFn: updatePassword,
    retry: 0,
    onSuccess: (data) => {
      options.onSuccess && options.onSuccess(data);
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      toast.success('Password has been successfully updated');
    },
    onError: (error) => {
      const errorMessage =
        typeof error === 'string'
          ? error
          : typeof error === 'object' && error.message
            ? error.message
            : 'An error ocurred when updating password';

      options.showErrorToast && toast.error(errorMessage);
      options.onError && options.onError(errorMessage);
    },
  });

  return { handleUpdatePassword, isUpdatePasswordPending };
};
