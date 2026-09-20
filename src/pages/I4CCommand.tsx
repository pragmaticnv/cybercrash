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
import { useActiveCaseStore } from '../store/useActiveCaseStore';
import { i4cNationalSummary } from '../data/i4cMockData';
import { ActiveCaseBanner } from '../components/Common/ActiveCaseBanner';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Crosshair, ArrowRight, ExternalLink, Building2 } from 'lucide-react';
import { apiFetch } from '../api/apiClient';

export const I4CCommand: React.FC = () => {
  const navigate = useNavigate();
  const { closeDrawer, activeDrawer } = useI4CStore();
  const { activeCase, prediction } = useActiveCaseStore();
  const [liveSummary, setLiveSummary] = React.useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    apiFetch<any>('/i4c/summary')
      .then((data) => {
        if (isMounted && data) {
          setLiveSummary(data);
        }
      })
      .catch(() => {
        // Fallback to synchronized mock
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic summary factoring in live backend API and active demo case
  const dynamicSummary = React.useMemo(() => {
    const base = liveSummary || i4cNationalSummary;
    const baseCases = base.activeCases || base.totalCases || i4cNationalSummary.activeCases;
    const rawCr = (342.8 + (activeCase.amountRaw / 10000000)).toFixed(1);
    return {
      ...i4cNationalSummary,
      activeCases: typeof baseCases === 'number' ? baseCases + 1 : i4cNationalSummary.activeCases + 1,
      fraudExposure: `₹${rawCr} Cr`,
      muleNetworks: base.muleNetworks || base.totalMuleAccounts || i4cNationalSummary.muleNetworks,
      predictedHotspots: base.predictedHotspots || base.activeHotspots || i4cNationalSummary.predictedHotspots,
      lastUpdated: `Live Sync · Case ${activeCase.id} (${activeCase.state}) Verified`
    };
  }, [liveSummary, activeCase]);

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

      {/* 1.5 Active Demo Case & Multi-Agency Synchronizer */}
      <ActiveCaseBanner />

      {/* 2. National Intelligence Summary Metric Strip */}
      <NationalSummary summary={dynamicSummary} />

      {/* Active Demo Case National Interception Order Strip */}
      <div className="w-full bg-[#120508] border-b border-red-500/40 px-4 lg:px-8 py-2.5">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-red-400 font-bold uppercase tracking-wider text-[11px]">
                  🚨 ACTIVE INTERSTATE INTERCEPTION ORDER
                </span>
                <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-mono text-[10px] border border-red-500/40">
                  {activeCase.id}
                </span>
              </div>
              <div className="text-slate-300 text-[11.5px] mt-0.5">
                <strong className="text-white">{activeCase.type}</strong> ({activeCase.amount}) originating from <strong className="text-cyan-300">{activeCase.state}</strong> → ML Predicted Extraction Corridor: <strong className="text-red-300">{prediction.predictedZone}</strong> ({prediction.confidencePercent} Confidence · Window: {prediction.timeWindow})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                alert(`[I4C PROTOCOL 1930] Interstate Interception order dispatched to Member Banks. Target Mule Account: ${activeCase.primaryMule}`);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold transition-all cursor-pointer"
            >
              <Building2 className="w-3 h-3" />
              <span>DISPATCH INTERCEPT TO BANKS</span>
            </button>
          </div>
        </div>
      </div>

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
