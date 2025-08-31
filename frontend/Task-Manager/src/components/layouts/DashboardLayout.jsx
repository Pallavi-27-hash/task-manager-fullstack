import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import ErrorBoundary from '../charts/ErrorBoundary'; // adjust if needed

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />
      {user ? (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <ErrorBoundary>
              <SideMenu activeMenu={activeMenu} />
            </ErrorBoundary>
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default DashboardLayout;
