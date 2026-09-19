import React from 'react';
import { BankHeader } from '../components/Bank/BankHeader';
import { BankFilterBar } from '../components/Bank/BankFilterBar';
import { AlertList } from '../components/Bank/AlertList';
import { SuspiciousTransactions } from '../components/Bank/SuspiciousTransactions';
import { RiskSignalsSummary } from '../components/Bank/RiskSignalsSummary';
import { HighRiskAccountsList } from '../components/Bank/HighRiskAccountsList';
import { ActivityStream } from '../components/Bank/ActivityStream';
import { TransactionDrawer } from '../components/Bank/drawers/TransactionDrawer';

export const BankHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#02060D] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Bank Header */}
      <BankHeader />

      {/* Filter Bar */}
      <BankFilterBar />

      {/* Main Fraud Operations Workspace */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-5 space-y-6">
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
