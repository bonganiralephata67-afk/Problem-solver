import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import GetHelpPage from './pages/GetHelpPage';
import RequestSubmittedPage from './pages/RequestSubmittedPage';
import SeekerDashboardPage from './pages/SeekerDashboardPage';
import ExpertRegisterPage from './pages/ExpertRegisterPage';
import ExpertDashboardPage from './pages/ExpertDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/get-help" element={<GetHelpPage />} />
              <Route path="/request-submitted/:requestId" element={<RequestSubmittedPage />} />
              <Route path="/my-requests" element={<SeekerDashboardPage />} />
              <Route path="/expert/register" element={<ExpertRegisterPage />} />
              <Route path="/expert/dashboard" element={<ExpertDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
