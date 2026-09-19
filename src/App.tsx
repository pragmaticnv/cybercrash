import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { LEACaseCommand } from './pages/LEACaseCommand';
import { CaseInvestigation } from './pages/CaseInvestigation';
import { I4CCommand } from './pages/I4CCommand';
import { AdminDashboard } from './pages/AdminDashboard';
import { BankHome } from './pages/BankHome';
import { BankAccountInvestigation } from './pages/BankAccountInvestigation';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Route 1: Login Gateway */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Route 2: LEA Case Command (Landing page for officers - NO map, NO money-flow) */}
        <Route path="/cases" element={<LEACaseCommand />} />
        <Route path="/command" element={<LEACaseCommand />} />

        {/* Route 3: Case Investigation Workspace (Map + Dossier + React Flow Money Flow) */}
        <Route path="/investigation/:caseId" element={<CaseInvestigation />} />

        {/* Route 4: I4C National Intelligence Command Center */}
        <Route path="/i4c" element={<I4CCommand />} />
        <Route path="/i4c/intelligence" element={<I4CCommand />} />

        {/* Route 5: Admin Demo Workspace */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Route 6: Bank Security & Fraud Operations Workstation */}
        <Route path="/bank" element={<BankHome />} />
        <Route path="/bank/security" element={<BankHome />} />
        <Route path="/bank/account/:accountId" element={<BankAccountInvestigation />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </HashRouter>
  );
};
