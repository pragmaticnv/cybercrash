import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { LEACaseCommand } from './pages/LEACaseCommand';
import { CaseInvestigation } from './pages/CaseInvestigation';
import { I4CCommand } from './pages/I4CCommand';
import { AdminDashboard } from './pages/AdminDashboard';
import { BankHome } from './pages/BankHome';
import { BankAccountInvestigation } from './pages/BankAccountInvestigation';
import { AccessDenied } from './pages/AccessDenied';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// Root / Catch-all redirect component based on authentication state
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated && user?.authorizedDashboard) {
    return <Navigate to={user.authorizedDashboard} replace />;
  }
  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Gateway */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* 1. LEA Interface (Protected: role = LEA) */}
        <Route
          path="/lea"
          element={
            <ProtectedRoute allowedRoles={['LEA']}>
              <LEACaseCommand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedRoute allowedRoles={['LEA']}>
              <LEACaseCommand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/command"
          element={
            <ProtectedRoute allowedRoles={['LEA']}>
              <LEACaseCommand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investigation/:caseId"
          element={
            <ProtectedRoute allowedRoles={['LEA']}>
              <CaseInvestigation />
            </ProtectedRoute>
          }
        />

        {/* 2. Bank Operations Interface (Protected: role = BANK) */}
        <Route
          path="/bank"
          element={
            <ProtectedRoute allowedRoles={['BANK']}>
              <BankHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank/security"
          element={
            <ProtectedRoute allowedRoles={['BANK']}>
              <BankHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank/account/:accountId"
          element={
            <ProtectedRoute allowedRoles={['BANK']}>
              <BankAccountInvestigation />
            </ProtectedRoute>
          }
        />

        {/* 3. I4C National Command Interface (Protected: role = I4C) */}
        <Route
          path="/i4c"
          element={
            <ProtectedRoute allowedRoles={['I4C']}>
              <I4CCommand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/i4c/intelligence"
          element={
            <ProtectedRoute allowedRoles={['I4C']}>
              <I4CCommand />
            </ProtectedRoute>
          }
        />

        {/* 4. Admin Management Interface (Protected: role = ADMIN) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </HashRouter>
  );
};
