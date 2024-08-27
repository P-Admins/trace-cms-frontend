import { Image } from '@nextui-org/react';
import cubeImagePath from '@images/shapes/cube.png';
import torusImagePath from '@images/shapes/torus.png';
import smallCylinderImagePath from '@images/shapes/cylinder_small.png';
import largeCylinderImagePath from '@images/shapes/cylinder_large.png';
import sphereImagePath from '@images/shapes/sphere.png';

interface Props {
  children: React.ReactNode;
}

export default function WrapperWithShapes({ children }: Props) {
  return (
    <>
      {children}
      <Image
        src={torusImagePath}
        classNames={{ wrapper: 'absolute top-[-66px] left-[61px] z-0' }}
        width={135}
        height={135}
      />
      <Image
        src={smallCylinderImagePath}
        classNames={{ wrapper: 'absolute top-[-41px] right-[191px] z-0' }}
        width={85}
        height={84}
      />
      <Image
        classNames={{ wrapper: 'absolute bottom-[-95px] left-[-9px] z-0' }}
        src={cubeImagePath}
        width={128}
        height={127}
      />
      <Image
        src={largeCylinderImagePath}
        classNames={{ wrapper: 'absolute bottom-[-66px] right-[-83px]' }}
        width={144}
        height={143}
      />
      <Image
        src={sphereImagePath}
        classNames={{ wrapper: 'absolute left-[-88px] top-[29px]' }}
        width={41}
        height={41}
      />
    </>
  );
}
