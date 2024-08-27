import { Button, Image } from '@nextui-org/react';
import AddIcon from '@icons/Add.svg?react';
import cubeImagePath from '@images/shapes/cube.png';
import torusImagePath from '@images/shapes/torus.png';
import smallCylinderImagePath from '@images/shapes/cylinder_small.png';
import largeCylinderImagePath from '@images/shapes/cylinder_large.png';
import sphereImagePath from '@images/shapes/sphere.png';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
}

export default function CreateNewButton({ onClick, isDisabled, className }: Props) {
  return (
    <div className="relative w-[615px] h-[402px] flex flex-col justify-center items-center">
      <div className="w-[420px] h-[223px] bg-gradient-to-b from-content1 to-[rgba(102, 102, 102, 0)] flex flex-col justify-center items-center z-10 rounded-lg backdrop-blur-[37px]">
        <Button
          onClick={onClick}
          size="lg"
          className={`text-lg bg-light-transparent w-[416px] h-[219px] rounded-lg flex flex-col backdrop-blur-[37px] gap-5 ${className}`}
          isDisabled={isDisabled}
        >
          <div>
            <AddIcon fill="#293038" width={50} height={50} />
          </div>
          Create New
        </Button>
      </div>
      <Image
        src={torusImagePath}
        classNames={{ wrapper: 'absolute top-0 left-[72px] z-0' }}
        width={145}
        height={145}
      />
      <Image
        src={smallCylinderImagePath}
        classNames={{ wrapper: 'absolute top-[30px] right-[80px]' }}
        width={85}
        height={84}
      />
      <Image
        classNames={{ wrapper: 'absolute bottom-[20px] left-[6px] z-0' }}
        src={cubeImagePath}
        width={137}
        height={136}
      />
      <Image
        src={largeCylinderImagePath}
        classNames={{ wrapper: 'absolute bottom-0 right-0 transform rotate-[-178deg]' }}
        width={207}
        height={205}
      />
      <Image
        src={sphereImagePath}
        classNames={{ wrapper: 'absolute left-0 top-[105px]' }}
        width={41}
        height={41}
      />
    </div>
  );
}
