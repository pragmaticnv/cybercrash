import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, ShieldAlert } from 'lucide-react';
import { BankHeader } from '../components/Bank/BankHeader';
import { AccountProfile } from '../components/Bank/AccountProfile';
import { AccountRiskProfile } from '../components/Bank/AccountRiskProfile';
import { AccountActivityChart } from '../components/Bank/AccountActivityChart';
import { AccountNetworkGraph } from '../components/Bank/AccountNetworkGraph';
import { WhyFlaggedExplanation } from '../components/Bank/WhyFlaggedExplanation';
import { RiskIntelligence } from '../components/Bank/RiskIntelligence';
import { AccountHistoryView } from '../components/Bank/AccountHistoryView';
import { LinkedCasesView } from '../components/Bank/LinkedCasesView';

// Drawers
import { TransactionDrawer } from '../components/Bank/drawers/TransactionDrawer';
import { ConnectedAccountDrawer } from '../components/Bank/drawers/ConnectedAccountDrawer';
import { EscalationDrawer } from '../components/Bank/drawers/EscalationDrawer';
import { InvestigationNoteModal } from '../components/Bank/drawers/InvestigationNoteModal';

import { useBankStore } from '../store/useBankStore';
import { bankService } from '../services/bankService';
import { BankAccount, BankHistoryEvent, BankLinkedCase } from '../types/bank';

export const BankAccountInvestigation: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { selectedAccountId, setSelectedAccountId, activeDrawer, closeDrawer } = useBankStore();

  const [account, setAccount] = useState<BankAccount | null>(null);
  const [history, setHistory] = useState<BankHistoryEvent[]>([]);
  const [linkedCases, setLinkedCases] = useState<BankLinkedCase[]>([]);

  const targetId = accountId || selectedAccountId || 'ACC_013041';

  useEffect(() => {
    setSelectedAccountId(targetId);
    bankService.getAccount(targetId).then((acc) => {
      if (acc) setAccount(acc);
    });
    bankService.getAccountHistory(targetId).then((h) => setHistory(h));
    bankService.getLinkedCases(targetId).then((c) => setLinkedCases(c));
  }, [targetId, setSelectedAccountId]);

  // Escape listener to close drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDrawer) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, closeDrawer]);

  if (!account) {
    return (
      <div className="min-h-screen bg-[#02060D] text-white flex items-center justify-center font-mono">
        Loading forensic account dossier...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02060D] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <BankHeader />

      {/* Navigation Breadcrumb Bar */}
      <div className="w-full bg-[#040914] border-b border-white/[0.08] px-4 lg:px-8 py-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/bank')}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>&larr; BACK TO FRAUD OPERATIONS CONSOLE</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">DOSSIER:</span>
          <span className="text-amber-300 font-bold">{account.accountId}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{account.bankName}</span>
        </div>
      </div>

      {/* Main Forensic Investigation Body */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-5 space-y-6">
        {/* 1. Account Profile Header & Action Bar */}
        <section>
          <AccountProfile account={account} />
        </section>

        {/* 2. Account Risk & Flow Profile Numbers */}
        <section>
          <AccountRiskProfile account={account} />
        </section>

        {/* 3. Temporal Activity Chart + Network Topology Graph */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 flex flex-col">
            <AccountActivityChart account={account} />
          </div>
          <div className="lg:col-span-7 flex flex-col">
            <AccountNetworkGraph accountId={account.accountId} />
          </div>
        </section>

        {/* 4. Why This Account Is Flagged (Observed Evidence) */}
        <section>
          <WhyFlaggedExplanation account={account} />
        </section>

        {/* 5. Evidence Classification (Observed vs Derived vs Model Signals) */}
        <section>
          <RiskIntelligence account={account} />
        </section>

        {/* 6. Internal Bank Audit History (Left) + Linked LEA Cases (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 flex flex-col">
            <AccountHistoryView history={history} />
          </div>
          <div className="lg:col-span-6 flex flex-col">
            <LinkedCasesView cases={linkedCases} />
          </div>
        </section>
      </main>

      {/* Drawers */}
      <TransactionDrawer />
      <ConnectedAccountDrawer />
      <EscalationDrawer />
      <InvestigationNoteModal />
    </div>
  );
};
