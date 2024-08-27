import { useState, useRef } from 'react';
import UserAvatar from '@/components/UserAvatar';
import BasicInput from '@/components/inputs/BasicInput';
import EditButton from '@/components/buttons/EditButton';
import GrayButton from '@/components/buttons/GrayButton';

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  avatarUrl: string | null | undefined;
};
type Props = {
  data: UserData;
  isLoading?: boolean;
  onUpdateClick?: (data: UserData | null, avatar: File | null) => void;
};

export default function Profile({ data, isLoading, onUpdateClick = () => {} }: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<UserData>(data);

  const handleEditClick = () => {
    avatarInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files && e.target.files[0];

    setAvatarFile(uploadedFile);
  };

  const handleUpdate = () => {
    const isDataChanged =
      values.firstName !== data.firstName ||
      values.lastName !== data.lastName ||
      values.email !== data.email;
    const isAvatarChanged = !!avatarFile;
    onUpdateClick(isDataChanged ? values : null, isAvatarChanged ? avatarFile : null);
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h5 className="font-extrabold mb-4">Profile</h5>
      <div className="bg-default-100 rounded-lg p-3 flex gap-4 items-center">
        <div className="relative">
          <UserAvatar
            name={data?.name}
            className="h-16 w-16 text-4xl"
            src={avatarFile ? URL.createObjectURL(avatarFile) : data.avatarUrl || undefined}
          />
          <EditButton className="absolute bottom-0 right-0" onClick={handleEditClick} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={avatarInputRef}
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
        <div>
          <p className="text-md">{data?.name}</p>
          <p className="text-default-400 text-sm mt-1">{data?.email}</p>
        </div>
      </div>
      <BasicInput
        placeholder="Enter your first name"
        inputWrapperClassNames="bg-default-100"
        label="First name"
        labelClassNames="text-lg"
        value={values.firstName}
        onChange={(e) => setValues({ ...values, firstName: e.target.value })}
        isDisabled={isLoading}
      />
      <BasicInput
        placeholder="Enter your last name"
        inputWrapperClassNames="bg-default-100"
        label="Last name"
        labelClassNames="text-lg"
        value={values.lastName}
        onChange={(e) => setValues({ ...values, lastName: e.target.value })}
        isDisabled={isLoading}
      />
      <BasicInput
        placeholder="Enter your email address"
        inputWrapperClassNames="bg-default-100"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        label="Email Address"
        labelClassNames="text-lg"
        isDisabled={true}
      />
      <div className="mt-4">
        <GrayButton
          text="Update"
          className="w-[145px]"
          onClick={handleUpdate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
