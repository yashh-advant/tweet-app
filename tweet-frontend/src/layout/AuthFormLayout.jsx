import React from 'react';
import Header from '../component/Header';
import { Outlet } from 'react-router';

function AuthFormLayout({children}) {
  return (
    <div className="bg-[#131420] relative min-h-screen">
      <Header />
      {children}
    </div>
  );
}

export default AuthFormLayout;
