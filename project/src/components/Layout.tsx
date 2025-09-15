import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ReactFooter from './ReactFooter';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white safe-area-top safe-area-bottom">
      <Header />
      <main>
        <Outlet />
      </main>
      <ReactFooter />
    </div>
  );
};

export default Layout;