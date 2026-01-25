import DashboardNavbar from '../components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense } from "react";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main>
        <Suspense fallback={<div className="text-center text-2xl font-bold py-20">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
