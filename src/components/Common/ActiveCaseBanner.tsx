import React, { useState } from 'react';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { Radio, RefreshCw } from 'lucide-react';

interface ActiveCaseBannerProps {
  currentPortal?: 'lea' | 'i4c' | 'bank' | 'admin' | string;
}

export const ActiveCaseBanner: React.FC<ActiveCaseBannerProps> = () => {
  const { 
    activeCase, 
    prediction, 
    selectedDemoKey, 
    selectDemoCase, 
    isLoading 
  } = useActiveCaseStore();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelectDemo = async (key: string) => {
    if (!key) return;
    setIsSwitching(true);
    try {
      await selectDemoCase(key);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="w-full bg-[#030812]/95 border-b border-cyan-500/20 text-white select-none z-20 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-4 text-xs">
        
        {/* Left: Active Demo Case Selector - Clean & Unboxed */}
        <div className="flex items-center gap-2.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
            ACTIVE CASE:
          </span>

          <div className="relative flex items-center">
            <select
              value={selectedDemoKey}
              onChange={(e) => handleSelectDemo(e.target.value)}
              disabled={isLoading || isSwitching}
              className="bg-transparent text-cyan-300 font-mono text-xs py-1 pr-6 focus:outline-none cursor-pointer disabled:opacity-50 transition-colors max-w-[480px] truncate hover:text-white border-b border-transparent hover:border-cyan-500/40 focus:border-cyan-400"
            >
              <option value="LIVE_DEMO_001" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_001 · Investment Scam (₹1,50,000 · Goa · ACC_013041)
              </option>
              <option value="LIVE_DEMO_002" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_002 · UPI Fraud (₹2,75,000 · Punjab · NEW_MULE_001)
              </option>
              <option value="LIVE_DEMO_003" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_003 · Marketplace Fraud (₹2,50,000 · Tamil Nadu · NEW_MULE_002)
              </option>
              {selectedDemoKey && !['LIVE_DEMO_001', 'LIVE_DEMO_002', 'LIVE_DEMO_003'].includes(selectedDemoKey) && (
                <option value={selectedDemoKey} className="bg-[#091527] text-cyan-200">
                  {selectedDemoKey} · {activeCase.type} ({activeCase.amount} · {activeCase.stateCode})
                </option>
              )}
            </select>

            {(isLoading || isSwitching) && (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin ml-1.5 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Right: Live ML Intelligence Telemetry Strip - Unboxed Clean Flow */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>ML TARGET: <strong className="text-emerald-400 font-bold tracking-wide">{prediction.predictedZone}</strong></span>
          <span className="text-slate-600">|</span>
          <span>CONFIDENCE: <strong className="text-cyan-300 font-bold tracking-wide">{prediction.confidencePercent}</strong></span>
          <span className="text-slate-600">|</span>
          <span>MULE: <strong className="text-amber-300 font-bold tracking-wide">{activeCase.primaryMule}</strong></span>
        </div>

      </div>
    </div>
  );
};
