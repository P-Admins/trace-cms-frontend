import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar/Sidebar';

export default function Layout() {
  return (
    <div className="bg-blue-pastel-bg-image bg-cover relative h-full min-w-screen min-h-screen flex">
      <div className="basis-[276px] shrink-0">
        <Sidebar className="h-[calc(100%-5rem)] fixed ml-4 my-5" />
      </div>
      <div className="grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
