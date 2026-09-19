import React, { useEffect } from 'react';
import { I4CHeader } from '../components/I4C/I4CHeader';
import { NationalSummary } from '../components/I4C/NationalSummary';
import { NationalMap } from '../components/I4C/NationalMap';
import { IntelligenceWatch } from '../components/I4C/IntelligenceWatch';
import { EmergingPatterns } from '../components/I4C/EmergingPatterns';
import { FraudTypeIntelligence } from '../components/I4C/FraudTypeIntelligence';
import { NetworkIntelligence } from '../components/I4C/NetworkIntelligence';
import { HotspotIntelligence } from '../components/I4C/HotspotIntelligence';
import { NationalTrends } from '../components/I4C/NationalTrends';
import { HistoricalPatterns } from '../components/I4C/HistoricalPatterns';

// Drawers
import { StateIntelligenceDrawer } from '../components/I4C/drawers/StateIntelligenceDrawer';
import { NetworkIntelligenceDrawer } from '../components/I4C/drawers/NetworkIntelligenceDrawer';
import { HotspotDrawer } from '../components/I4C/drawers/HotspotDrawer';
import { AccountDrawer } from '../components/I4C/drawers/AccountDrawer';
import { IntelligenceDrawer } from '../components/I4C/drawers/IntelligenceDrawer';

import { useI4CStore } from '../store/useI4CStore';
import { i4cNationalSummary } from '../data/i4cMockData';

export const I4CCommand: React.FC = () => {
  const { closeDrawer, activeDrawer } = useI4CStore();

  // Handle Escape key to close active drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDrawer) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, closeDrawer]);

  return (
    <div className="min-h-screen bg-[#02060D] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global CYBERCRASH Header for I4C */}
      <I4CHeader />

      {/* 2. National Intelligence Summary Metric Strip */}
      <NationalSummary summary={i4cNationalSummary} />

      {/* Main Intelligence Workspace Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-5 space-y-6">
        {/* Viewport 1: Main National Map (Left) + Intelligence Watch Feed (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main National Map */}
          <div className="lg:col-span-8 flex flex-col">
            <NationalMap />
          </div>

          {/* Intelligence Watch Live Feed */}
          <div className="lg:col-span-4 flex flex-col">
            <IntelligenceWatch />
          </div>
        </section>

        {/* Viewport 2: Emerging Fraud Patterns with Recharts Sparklines */}
        <section>
          <EmergingPatterns />
        </section>

        {/* Viewport 3: Mule Network Intelligence (Left) + Predicted Cash-Out Hotspots (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <NetworkIntelligence />
          <HotspotIntelligence />
        </section>

        {/* Viewport 4: Fraud Type Distribution (Left) + National Activity Trends (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FraudTypeIntelligence />
          <NationalTrends />
        </section>

        {/* Viewport 5: Recurring Syndicate Structures */}
        <section>
          <HistoricalPatterns />
        </section>
      </main>

      {/* Global Intelligence Drawers (Animated via Framer Motion) */}
      <StateIntelligenceDrawer />
      <NetworkIntelligenceDrawer />
      <HotspotDrawer />
      <AccountDrawer />
      <IntelligenceDrawer />
    </div>
  );
};
