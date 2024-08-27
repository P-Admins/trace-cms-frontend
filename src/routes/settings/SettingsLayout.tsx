import { Outlet } from 'react-router-dom';
import SettingSidebar from '@/components/layout/sidebar/SettingsSidebar';

export default function SettingsLayout() {
  return (
    <div className=" relative h-full min-w-screen min-h-screen flex ">
      <div className="basis-[330px] shrink-0">
        <SettingSidebar className="h-full fixed" />
      </div>
      <div className="grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
