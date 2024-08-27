import { UseTraceOptionText } from '@/types/Other';
import UseTraceOption from '@components/UseTraceOption';
import CrownIcon from '@icons/Crown.svg?react';
import WrenchIcon from '@icons/Wrench.svg?react';
import BuildingIcon from '@icons/Building.svg?react';
import InstitutionIcon from '@icons/Institution.svg?react';
import UserFemaleIcon from '@icons/User_Female.svg?react';
import TradesIcon from '@icons/Trades.svg?react';

interface Props {
  activeOption: UseTraceOptionText | null;
  onChooseOption: (option: string) => void;
  className?: string;
}

export default function UseTraceOptionList({
  activeOption,
  onChooseOption,
  className = '',
}: Props) {
  return (
    <ul className={`flex gap-6 flex-wrap ${className}`}>
      <li>
        <UseTraceOption
          text="My Brand"
          value="my brand"
          isActive={activeOption === 'my brand'}
          icon={<CrownIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
      <li>
        <UseTraceOption
          text="Training"
          value="training"
          isActive={activeOption === 'training'}
          icon={<WrenchIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
      <li>
        <UseTraceOption
          text="Real Estate"
          value="real estate"
          isActive={activeOption === 'real estate'}
          icon={<BuildingIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
      <li>
        <UseTraceOption
          text="Museums"
          value="museums"
          isActive={activeOption === 'museums'}
          icon={<InstitutionIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
      <li>
        <UseTraceOption
          text="Personal"
          value="personal"
          isActive={activeOption === 'personal'}
          icon={<UserFemaleIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
      <li>
        <UseTraceOption
          text="Other"
          value="other"
          isActive={activeOption === 'other'}
          icon={<TradesIcon width={32} height={32} color="white" />}
          onChooseOption={onChooseOption}
        />
      </li>
    </ul>
  );
}
