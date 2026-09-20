import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, ArrowRight, ExternalLink, Activity, Radio, AlertTriangle } from 'lucide-react';
import { BankHeader } from '../components/Bank/BankHeader';
import { BankFilterBar } from '../components/Bank/BankFilterBar';
import { AlertList } from '../components/Bank/AlertList';
import { SuspiciousTransactions } from '../components/Bank/SuspiciousTransactions';
import { RiskSignalsSummary } from '../components/Bank/RiskSignalsSummary';
import { HighRiskAccountsList } from '../components/Bank/HighRiskAccountsList';
import { ActivityStream } from '../components/Bank/ActivityStream';
import { TransactionDrawer } from '../components/Bank/drawers/TransactionDrawer';
import { ActiveCaseBanner } from '../components/Common/ActiveCaseBanner';
import { useActiveCaseStore } from '../store/useActiveCaseStore';
import { useBankStore } from '../store/useBankStore';

export const BankHome: React.FC = () => {
  const navigate = useNavigate();
  const { activeCase, prediction } = useActiveCaseStore();
  const { setSelectedAccountId } = useBankStore();

  const handleInspectActiveMule = () => {
    if (activeCase?.primaryMule) {
      setSelectedAccountId(activeCase.primaryMule);
      navigate(`/bank/account/${activeCase.primaryMule}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#02060D] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Bank Header */}
      <BankHeader />

      {/* Synchronized Multi-Agency Case Selector Banner */}
      <ActiveCaseBanner currentPortal="bank" />

      {/* Filter Bar */}
      <BankFilterBar />

      {/* Main Fraud Operations Workspace */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-5 space-y-6">
        {/* Section 0: Prominent Synchronized Active Case Card */}
        {activeCase && (
          <section className="p-4 rounded-xl bg-gradient-to-r from-[#170608] via-[#091527] to-[#040c1a] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
                    ACTIVE CASE: {activeCase.id}
                  </span>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                    {activeCase.type}
                  </span>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                    AMOUNT: {activeCase.amount}
                  </span>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold">
                    STATE: {activeCase.state} ({activeCase.stateCode})
                  </span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold animate-pulse">
                    PRIORITY 1 INTERCEPT
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-sans flex items-center gap-3 flex-wrap">
                  <span>
                    Primary Target Mule:{' '}
                    <strong className="font-mono text-amber-300 text-xs bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                      {activeCase.primaryMule}
                    </strong>
                  </span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span>
                    ML Predicted Zone:{' '}
                    <strong className="font-mono text-cyan-300 text-xs">
                      {prediction?.predictedZone || 'TARGET ZONE'}
                    </strong>{' '}
                    ({prediction?.confidencePercent || '97.9%'} confidence)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleInspectActiveMule}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5 cursor-pointer border border-amber-400/40"
              >
                <Users className="w-3.5 h-3.5" />
                <span>INSPECT CASE MULE</span>
              </button>
              <button
                onClick={() => navigate(`/investigation/${activeCase.id}`)}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="View LEA Investigation Workspace"
              >
                <span>LEA DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* Section 1: Priority Operational Alerts Stream */}
        <section>
          <AlertList />
        </section>

        {/* Section 2: Suspicious Activity (Left) + Risk Signals (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 flex flex-col">
            <SuspiciousTransactions />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <RiskSignalsSummary />
          </div>
        </section>

        {/* Section 3: High-Risk Accounts Under Surveillance */}
        <section>
          <HighRiskAccountsList />
        </section>

        {/* Section 4: Chronological Intercept Activity Stream */}
        <section>
          <ActivityStream />
        </section>
      </main>

      {/* Global Drawers */}
      <TransactionDrawer />
    </div>
  );
};
