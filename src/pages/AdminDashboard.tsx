import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberIntelligenceGrid } from '../components/admin/CyberIntelligenceGrid';
import { AdminTopBar } from '../components/admin/AdminTopBar';
import { AdminNavRail, AdminSection } from '../components/admin/AdminNavRail';
import { SystemSnapshot } from '../components/admin/SystemSnapshot';
import { CaseControl } from '../components/admin/CaseControl';
import { PersonnelControl } from '../components/admin/PersonnelControl';
import { AccessMatrix } from '../components/admin/AccessMatrix';
import { MLServiceStatus } from '../components/admin/MLServiceStatus';
import { DataPipeline } from '../components/admin/DataPipeline';
import { AuditTrail } from '../components/admin/AuditTrail';
import { SystemHealth } from '../components/admin/SystemHealth';
import { AdminCommands } from '../components/admin/AdminCommands';
import { CaseDrawer } from '../components/admin/CaseDrawer';
import { PersonnelModal } from '../components/admin/PersonnelModal';
import { FullAuditModal } from '../components/admin/FullAuditModal';
import { SystemStatusModal } from '../components/admin/SystemStatusModal';
import { AdminCaseItem, RECENT_CASE_STREAM } from '../data/adminDemoData';
import { Shield, Sparkles, Terminal, Activity, Sliders } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Active section from Left Nav Rail
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Modals and Drawers state
  const [selectedCase, setSelectedCase] = useState<AdminCaseItem | null>(null);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [isFullAuditModalOpen, setIsFullAuditModalOpen] = useState(false);
  const [isSystemStatusModalOpen, setIsSystemStatusModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleNavSelect = (section: AdminSection) => {
    setActiveSection(section);
    if (section === 'users') setIsPersonnelModalOpen(true);
    if (section === 'audit-trail') setIsFullAuditModalOpen(true);
    if (section === 'system-status') setIsSystemStatusModalOpen(true);
    if (section === 'settings') setIsSettingsModalOpen(true);
  };

  const handleNavigateToInvestigation = (caseId: string) => {
    navigate(`/investigation/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-[#03070D] text-white font-sans relative overflow-x-hidden select-none">
      {/* 1. Subtle Animated CYBERCRASH Intelligence Grid Background */}
      <CyberIntelligenceGrid />

      {/* 2. Top Command Bar */}
      <AdminTopBar onOpenSystemStatus={() => setIsSystemStatusModalOpen(true)} />

      {/* 3. Left Control Console Navigation Rail */}
      <AdminNavRail 
        activeSection={activeSection} 
        onSelectSection={handleNavSelect} 
      />

      {/* 4. Main Admin Spatial Command Center Area */}
      <main className="relative z-10 pl-16 transition-all duration-300 min-h-[calc(100vh-57px)] flex flex-col justify-between">
        <div className="max-w-[1780px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
          
          {/* Admin Control Center Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600/30 via-red-900/20 to-transparent border border-red-500/30 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(225,29,42,0.3)]">
                <Shield className="w-5 h-5 text-[#FF4D58]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[20px] sm:text-[24px] font-display font-extrabold tracking-tight text-white uppercase leading-none">
                    ADMIN CONTROL CENTER
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[9.5px] font-mono text-cyan-300 font-semibold tracking-wider uppercase">
                    SECURE ADMIN CHANNEL
                  </span>
                </div>
                <p className="text-[11.5px] font-mono text-[#94A3B8] mt-1 tracking-wider uppercase">
                  National Cybercrime Multi-Agency Coordination & Intelligence Nexus
                </p>
              </div>
            </div>

            {/* Platform Health Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.025] border border-white/[0.08] text-[11px] font-mono text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PLATFORM STATUS:</span>
              <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-cyan-300">GOV-NET ID: CC-ADM-01</span>
            </div>
          </div>

          {/* Quick Admin Action Commands Bar (Requirement #10) */}
          <AdminCommands
            onOpenUsers={() => setIsPersonnelModalOpen(true)}
            onOpenAssignCase={() => setSelectedCase(RECENT_CASE_STREAM[0])}
            onOpenDataAccess={() => setActiveSection('data-access')}
            onOpenAuditLog={() => setIsFullAuditModalOpen(true)}
            onOpenSystemStatus={() => setIsSystemStatusModalOpen(true)}
            onOpenModelStatus={() => setActiveSection('ml-services')}
          />

          {/* Top System Telemetry Snapshot Ribbon (Requirement #7) */}
          <SystemSnapshot />

          {/* Spatial Grid Layout of Core Intelligence Modules */}
          {(activeSection === 'overview' || activeSection === 'case-control') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Module A: Case Control */}
              <CaseControl
                onSelectCase={(c) => setSelectedCase(c)}
                onOpenAssignCase={() => setSelectedCase(RECENT_CASE_STREAM[0])}
              />

              {/* Module B: Personnel Control */}
              <PersonnelControl
                onOpenDirectory={() => setIsPersonnelModalOpen(true)}
                onSelectPersonnel={() => setIsPersonnelModalOpen(true)}
              />
            </div>
          )}

          {(activeSection === 'overview' || activeSection === 'data-access') && (
            /* Module C: Data Access Matrix (Requirement #8 Module C) */
            <AccessMatrix />
          )}

          {(activeSection === 'overview' || activeSection === 'ml-services') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Module D: Intelligence Engine ML Services */}
              <MLServiceStatus />

              {/* Module E: Data Pipeline */}
              <DataPipeline />
            </div>
          )}

          {(activeSection === 'overview' || activeSection === 'audit-trail' || activeSection === 'system-status') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Module F: Security Audit Trail */}
              <AuditTrail
                onOpenFullAudit={() => setIsFullAuditModalOpen(true)}
              />

              {/* Module G: System Health */}
              <SystemHealth
                onOpenDetailedDiagnostics={() => setIsSystemStatusModalOpen(true)}
              />
            </div>
          )}

          {/* If Settings section selected */}
          {activeSection === 'settings' && (
            <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h2 className="text-[16px] font-bold text-white uppercase font-sans">
                  PLATFORM CONFIGURATION & SECURITY POLICIES
                </h2>
              </div>
              <div className="py-6 space-y-4 font-mono text-[12px]">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <span className="text-white font-bold block">NCRP / CFCFRMS Simulation Mode</span>
                    <span className="text-[#64748B] text-[10px]">Emit synthetic high-velocity mule events for live testing</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <span className="text-white font-bold block">Predictive Cash-Out Zone Threshold</span>
                    <span className="text-[#64748B] text-[10px]">Minimum confidence score required for tactical alert generation</span>
                  </div>
                  <span className="text-cyan-300 font-bold">95.0% ROC-AUC</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <span className="text-white font-bold block">Multi-Agency Zero-Trust Encryption</span>
                    <span className="text-[#64748B] text-[10px]">Gov-Net Level 4 Hardware Security Module (HSM) key rotation</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                    ENFORCED
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Tactical Command Center Footer */}
        <footer className="w-full border-t border-white/[0.06] bg-[#02060D]/80 backdrop-blur-md px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#64748B] gap-2">
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-bold">CYBERCRASH</span>
            <span>•</span>
            <span>MULTI-AGENCY CYBERCRIME INTELLIGENCE PLATFORM</span>
            <span>•</span>
            <span className="text-[#FF4D58]">TRACE • PREDICT • PREVENT</span>
          </div>
          <div className="flex items-center gap-4">
            <span>GOV-NET 256-BIT ENCRYPTED</span>
            <span>SESSION ID: #ADM-88942-IST</span>
            <span className="text-emerald-400 font-semibold">● SECURE</span>
          </div>
        </footer>
      </main>

      {/* 5. Modals and Drawers */}
      {/* Case Detail & Assignment Drawer */}
      <CaseDrawer
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onNavigateToInvestigation={handleNavigateToInvestigation}
      />

      {/* Full Personnel Directory Modal */}
      <PersonnelModal
        isOpen={isPersonnelModalOpen}
        onClose={() => setIsPersonnelModalOpen(false)}
      />

      {/* Full Security Audit Trail Modal */}
      <FullAuditModal
        isOpen={isFullAuditModalOpen}
        onClose={() => setIsFullAuditModalOpen(false)}
      />

      {/* Detailed System Status Diagnostics Modal */}
      <SystemStatusModal
        isOpen={isSystemStatusModalOpen}
        onClose={() => setIsSystemStatusModalOpen(false)}
      />
    </div>
  );
};
