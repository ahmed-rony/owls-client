import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { DarkModeContext } from '../../context/darkModeContext';
import LeftBar from '../leftBar/LeftBar';
import Navbar from '../navbar/Navbar';
import RightBar from '../rightBar/RightBar';

const Layout = () => {

    const { darkMode } = useContext(DarkModeContext);
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
          <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
              <LeftBar />
              <div style={{ flex: 6 }}>
                <Outlet />
              </div>
              <RightBar />
            </div>
          </div>
        </QueryClientProvider>
    );
};

export default Layout;