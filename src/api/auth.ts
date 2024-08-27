import api from './config';
import { getErrorFromResponse, getErrorMessageFromResponse } from '@/lib/utils';
import { GenericResponse } from '@/types/Other';

export type SignUpRequestParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  usageType: string | null;
  receiveNewsletter: boolean;
};
export type SignUpResponse = { isRegistered: boolean };
export const signUp = async (params: SignUpRequestParams): Promise<{ isRegistered: boolean }> => {
  try {
    const response = await api.post('/authentication/register', params);
    return { isRegistered: response.data.isRegistered };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type LoginRequestParams = {
  email: string;
  password: string;
};
export type LoginResponse = { access_token: string };
export const login = async (params: LoginRequestParams): Promise<LoginResponse> => {
  try {
    const response = await api.post('/authentication/authenticate', params);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const logout = async (): Promise<GenericResponse> => {
  try {
    await api.post('/authentication/logout', '');
    return { ok: true };
  } catch (err: unknown) {
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type CheckUserEmailResponse = { accountExists: boolean; isRegistered: boolean };
export const checkUserEmail = async (email: string): Promise<CheckUserEmailResponse> => {
  try {
    const response = await api.post(
      '/authentication/check-email?email=' + encodeURIComponent(email)
    );
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const resendConfirmationEmail = async (email: string): Promise<GenericResponse> => {
  try {
    await api.post('/authentication/resend-email?email=' + encodeURIComponent(email));
    return { ok: true };
  } catch (err: unknown) {
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type ResetPasswordRequestParams = {
  email: string;
  currentPassword: string;
  newPassword: string;
};
export const updatePassword = async (
  params: ResetPasswordRequestParams
): Promise<GenericResponse> => {
  try {
    const res = await api.post('/authentication/update-password', params);
    return { ok: true };
  } catch (err: unknown) {
    const error = getErrorFromResponse(err);
    throw new Error(error.message);
  }
};

export type SignInWithGoogleResponse = { access_token: string };
export const loginWithGoogle = async (code: string): Promise<SignInWithGoogleResponse> => {
  try {
    const response = await api.post(
      '/authentication/authenticate-google?code=' + encodeURIComponent(code)
    );
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};
