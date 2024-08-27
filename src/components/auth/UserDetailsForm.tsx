import { UseTraceOptionText } from '@/types/Other';
import { Checkbox } from '@nextui-org/react';
import TransparentInput from '@components/inputs/TransparentInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';
import UseTraceOptionList from '@components/UseTraceOptionList';

interface Props {
  isLoading?: boolean;
  values: {
    fullName: string;
    organization: string;
    usageType: UseTraceOptionText | null;
    receiveNewsletter: boolean;
  };
  onChange: (name: string, value: string | boolean) => void;
  onSubmit: () => void;
}

function UserDetailsForm({ isLoading, values, onChange, onSubmit }: Props) {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-[30px]">
        <p className="text-xl mt-[22px] text-content1 font-extrabold opacity-90">User Details</p>
        <TransparentInput
          value={values.fullName}
          placeholder="Full Name"
          onChange={(e) => onChange(e.target.name, e.target.value)}
          type="text"
          name="fullName"
          onKeyDown={handleKeyPress}
        />
        <TransparentInput
          value={values.organization}
          placeholder="Organization (Optional)"
          onChange={(e) => onChange(e.target.name, e.target.value)}
          type="text"
          name="organization"
          onKeyDown={handleKeyPress}
        />
        <p className="text-xl text-content1 font-extrabold opacity-90">
          I plan on using Trace for...
        </p>
        <div>
          <UseTraceOptionList
            activeOption={values.usageType}
            onChooseOption={(option) => onChange('usageType', option)}
          />
        </div>

        <Checkbox
          isSelected={values.receiveNewsletter}
          onValueChange={(value) => onChange('receiveNewsletter', value)}
          size="sm"
          classNames={{
            label: 'text-content1 text-sm',
          }}
        >
          I would like to receive news and updates from Trace.
        </Checkbox>
      </div>
      <PrimaryGradientButton
        isLoading={isLoading}
        variant="light"
        text="Complete Sign Up"
        className="mt-9 w-full max-w-[402px]"
        isDisabled={values.fullName.trim().length === 0}
        onClick={onSubmit}
      />
    </div>
  );
}

export default UserDetailsForm;
