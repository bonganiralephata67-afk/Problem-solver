import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DemoNoticeBanner from '../components/common/DemoNoticeBanner';
import SupportBot from '../components/support/SupportBot';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DemoNoticeBanner />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <SupportBot />
      <Footer />
    </div>
  );
}
