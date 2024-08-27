import bgImagePath from '@images/backgrounds/bg_with_shapes.png';
import bgImageCroppedPath from '@images/backgrounds/bg_with_shapes_cropped.png';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';

type Props = {
  onInviteClick?: () => void;
};

export default function InviteSection({ onInviteClick }: Props) {
  return (
    <div className="relative">
      <img
        src={bgImagePath}
        className="object-cover absolute bottom-0 rounded-bl-2xl rounded-tl-2xl opacity-90 "
      />
      <img src={bgImageCroppedPath} className="object-cover invisible" />
      <div className="absolute bottom-0 flex flex-col justify-end min-[1600px]:px-14 min-[1600px]:py-9 p-6 max-[1460px]:flex-row max-[1460px]:gap-8">
        <div>
          <h4
            className={`text-content1 ${styles.h4.default} ${styles.h4['1600']} ${styles.h4['1700']} ${styles.h4['1800']}`}
          >
            Great Ideas Are Meant To Be Shared
          </h4>
          <h6
            className={`text-content1 ${styles.h6.default} ${styles.h6['1600']} ${styles.h6['1700']} ${styles.h6['1800']}`}
          >
            Get collaboration and creativity flowing so jobs get done, fast.
          </h6>
        </div>
        <PrimaryGradientButton
          text="Invite People"
          variant="light"
          className={`mt-4 ${styles.button.default} ${styles.button['1600']} ${styles.button['1700']} ${styles.button['1800']}`}
          onClick={onInviteClick}
        />
      </div>
    </div>
  );
}

const styles = {
  h4: {
    default: 'text-xl leading-6',
    1600: 'min-[1600px]:text-xl min-[1600px]:leading-6',
    1700: 'min-[1700px]:text-2xl min-[1700px]:leading-8',
    1800: 'min-[1800px]:text-3xl min-[1800px]:leading-10',
  },
  h6: {
    default: 'text-sm leading-6',
    1600: 'min-[1600px]:text-md min-[1600px]:leading-6',
    1700: 'min-[1700px]:text-lg min-[1700px]:leading-8',
    1800: 'min-[1800px]:text-xl min-[1800px]:leading-10',
  },
  button: {
    default: 'w-28 text-md h-10',
    1600: 'min-[1600px]:w-32 min-[1600px]:text-lg min-[1600px]:h-[54px]',
    1700: 'min-[1700px]:w-40 min-[1700px]:text-lg min-[1700px]:h-[54px]',
    1800: 'min-[1800px]:w-56 min-[1800px]:text-lg min-[1800px]:h-[54px]',
  },
};
