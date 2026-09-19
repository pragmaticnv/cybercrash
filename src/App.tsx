import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { LEACaseCommand } from './pages/LEACaseCommand';
import { CaseInvestigation } from './pages/CaseInvestigation';

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

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </HashRouter>
  );
};
