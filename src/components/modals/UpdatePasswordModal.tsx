import { Link } from 'react-router-dom';
import { useUpdatePasswordMutation } from '@/hooks/auth';
import { ChangeEvent, useEffect, useState } from 'react';
import { passwordSchema } from '@/lib/validationSchemas';
import { ZodError } from 'zod';
import BasicModal from '@components/modals/variants/BasicModal';
import BasicInput from '@components/inputs/BasicInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';
import { toast } from 'react-toastify';

interface Props {
  email?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function UpdatePasswordModal({ email, isOpen, onOpenChange, onClose }: Props) {
  const initialState = { currentPassword: '', newPassword: '', repeatPassword: '' };

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const newErrors: { currentPassword?: string; newPassword?: string; repeatPassword?: string } =
      {};

    try {
      passwordSchema.parse(values.newPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        newErrors.newPassword = error.errors[0]?.message || 'Invalid password';
      }
    }

    if (!values.currentPassword) {
      newErrors.currentPassword = 'Field is mandatory';
    }

    if (!values.newPassword) {
      newErrors.newPassword = 'Field is mandatory';
    }

    if (!values.repeatPassword) {
      newErrors.repeatPassword = 'Field is mandatory';
    }

    if (values.newPassword !== values.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    if (
      values.newPassword &&
      values.currentPassword &&
      values.newPassword === values.currentPassword
    ) {
      newErrors.newPassword = 'Password cannot be the same as the current password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...initialState, ...newErrors });
      return;
    }

    if (!email) return;

    setErrors(initialState);
    handleUpdatePassword({
      email,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const { handleUpdatePassword, isUpdatePasswordPending } = useUpdatePasswordMutation({
    onSuccess: onClose,
    onError: (error) => {
      if (error.includes('Incorrect password')) {
        setErrors({ ...errors, currentPassword: 'Invalid current password' });
      } else {
        toast.error(error);
      }
    },
  });

  useEffect(() => {
    return () => {
      setValues(initialState);
      setErrors(initialState);
    };
  }, [isOpen]);

  return (
    <BasicModal
      title="Update Password"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      footer={
        <PrimaryGradientButton
          text="Update"
          className="w-full"
          onClick={handleSubmit}
          isLoading={isUpdatePasswordPending}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <BasicInput
          label="Current Password"
          type="password"
          name="currentPassword"
          value={values.currentPassword}
          onChange={handleChange}
          placeholder="Enter Current Password"
          onKeyDown={handleKeyPress}
          isInvalid={!!errors.currentPassword}
          errorMessage={errors.currentPassword}
        />
        <p className="text-sm mb-2 opacity-90 max-w-[100px] hover:text-primary-600 transition-all ease-in-out text-left">
          <Link to="/">Forgot Password?</Link>
        </p>
        <BasicInput
          label="New Password"
          type="password"
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
          placeholder="Enter New Password"
          onKeyDown={handleKeyPress}
          isInvalid={!!errors.newPassword}
          errorMessage={errors.newPassword}
        />
        <BasicInput
          label="Repeat Password"
          type="password"
          name="repeatPassword"
          value={values.repeatPassword}
          onChange={handleChange}
          placeholder="Repeat New Password"
          onKeyDown={handleKeyPress}
          isInvalid={!!errors.repeatPassword}
          errorMessage={errors.repeatPassword}
        />
      </div>
    </BasicModal>
  );
}
