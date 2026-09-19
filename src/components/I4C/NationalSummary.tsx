import React from 'react';
import { Activity, ShieldAlert, Network, Crosshair, Shuffle, Radio } from 'lucide-react';
import { I4CNationalSummary } from '../../types/i4c';

interface NationalSummaryProps {
  summary: I4CNationalSummary;
}

export const NationalSummary: React.FC<NationalSummaryProps> = ({ summary }) => {
  return (
    <div className="w-full bg-[#040914] border-b border-white/[0.08] px-4 lg:px-8 py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* National Intelligence Label */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">NATIONAL INTELLIGENCE</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden xl:inline">
            {summary.lastUpdated}
          </span>
        </div>

        {/* Compact Horizontal Intelligence Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-4 flex-1 lg:max-w-[1100px] xl:max-w-[1240px]">
          {/* Active Cases */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#071120] border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
            <div className="w-7 h-7 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ACTIVE CASES</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-white tracking-tight">
                  {summary.activeCases.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-medium">{summary.activeCasesDelta}</span>
              </div>
            </div>
          </div>

          {/* Fraud Exposure */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#071120] border border-white/[0.06] hover:border-red-500/30 transition-colors">
            <div className="w-7 h-7 rounded bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">FRAUD EXPOSURE</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-red-400 tracking-tight">
                  {summary.fraudExposure}
                </span>
                <span className="text-[10px] font-mono text-red-400/80 font-medium">{summary.fraudExposureDelta}</span>
              </div>
            </div>
          </div>

          {/* Mule Networks */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#071120] border border-white/[0.06] hover:border-amber-500/30 transition-colors">
            <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Network className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MULE NETWORKS</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-white tracking-tight">
                  {summary.muleNetworks}
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-medium">{summary.muleNetworksDelta}</span>
              </div>
            </div>
          </div>

          {/* Predicted Hotspots */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#071120] border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
            <div className="w-7 h-7 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PREDICTED HOTSPOTS</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-cyan-300 tracking-tight">
                  {summary.predictedHotspots}
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 font-medium">{summary.predictedHotspotsDelta}</span>
              </div>
            </div>
          </div>

          {/* Cross-State Networks */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#071120] border border-white/[0.06] hover:border-purple-500/30 transition-colors col-span-2 sm:col-span-1">
            <div className="w-7 h-7 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Shuffle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CROSS-STATE NETWORKS</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-white tracking-tight">
                  {summary.crossStateNetworks}
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-medium">{summary.crossStateNetworksDelta}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
