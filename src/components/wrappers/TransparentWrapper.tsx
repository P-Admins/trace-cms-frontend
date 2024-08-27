import bluishImagePath from '@images/backgrounds/bluish.jpg';

interface Props {
  children: React.ReactNode;
}

export default function TransparentWrapper({ children }: Props) {
  return (
    <div className="w-full h-full bg-cover bg-no-repeat backdrop-blur-[70px] drop-shadow-[0_1.2px_30px_0px_rgba(69, 42, 124, 0.1)] border-[3px] border-[rgba(255,255,255,0.5)] relative rounded-bl-3xl rounded-tl-3xl ">
      <img
        src={bluishImagePath}
        className="w-full h-full object-cover absolute rounded-bl-2xl rounded-tl-2xl opacity-50"
      />
      <div className="w-full h-full absolute bg-gradient-to-r from-white/10 from-40% to-white/10 to-7% rounded-bl-2xl rounded-tl-2xl"></div>
      <div>{children}</div>
    </div>
  );
}
