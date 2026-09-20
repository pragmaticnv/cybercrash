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
        
        {/* Left: Active Demo Case Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex-shrink-0">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider">
              ACTIVE CASE FOCUS:
            </span>
          </div>

          <div className="relative flex items-center">
            <select
              value={selectedDemoKey}
              onChange={(e) => handleSelectDemo(e.target.value)}
              disabled={isLoading || isSwitching}
              className="bg-[#091527] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer disabled:opacity-50 transition-colors max-w-[480px] truncate"
            >
              <option value="LIVE_DEMO_001">
                LIVE_DEMO_001 · Investment Scam (₹1,50,000 · Goa · ACC_013041)
              </option>
              <option value="LIVE_DEMO_002">
                LIVE_DEMO_002 · UPI Fraud (₹2,75,000 · Punjab · NEW_MULE_001)
              </option>
              <option value="LIVE_DEMO_003">
                LIVE_DEMO_003 · Marketplace Fraud (₹2,50,000 · Tamil Nadu · NEW_MULE_002)
              </option>
              {selectedDemoKey && !['LIVE_DEMO_001', 'LIVE_DEMO_002', 'LIVE_DEMO_003'].includes(selectedDemoKey) && (
                <option value={selectedDemoKey}>
                  {selectedDemoKey} · {activeCase.type} ({activeCase.amount} · {activeCase.stateCode})
                </option>
              )}
            </select>

            {(isLoading || isSwitching) && (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin ml-2 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Right: Live ML Intelligence Telemetry Strip */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#071324] border border-white/[0.08]">
            <span className="text-slate-400">ML TARGET:</span>
            <span className="text-emerald-400 font-bold tracking-wide">{prediction.predictedZone}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CONFIDENCE:</span>
            <span className="text-cyan-300 font-bold tracking-wide">{prediction.confidencePercent}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">PRIMARY MULE:</span>
            <span className="text-amber-300 font-bold tracking-wide">{activeCase.primaryMule}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
