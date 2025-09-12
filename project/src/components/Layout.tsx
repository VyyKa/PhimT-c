import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ReactFooter from './ReactFooter';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <ReactFooter />
    </div>
  );
};

export default Layout;