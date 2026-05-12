import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import CustomCursor from '../ui/CustomCursor';
import PageTransition from '../ui/PageTransition';

const CustomerLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow relative">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
