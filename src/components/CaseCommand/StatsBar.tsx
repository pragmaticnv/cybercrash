import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StatsBarProps {
  totalActive: number;
  newCases: number;
  inProgress: number;
  criticalAttention: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalActive,
  newCases,
  inProgress,
  criticalAttention,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-1">
      {/* Stat 1: Active Cases */}
      <div className="bg-[#071120] border border-white/[0.08] rounded-lg p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8B98A5] uppercase tracking-wider block">
            Active Cases
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-display font-bold text-white">{totalActive}</span>
            <span className="text-[11px] text-cyan-400 font-mono">Assigned</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-md bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
      </div>

      {/* Stat 2: New Cases */}
      <div className="bg-[#071120] border border-white/[0.08] rounded-lg p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8B98A5] uppercase tracking-wider block">
            New Cases (24h)
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-display font-bold text-emerald-400">{newCases}</span>
            <span className="text-[11px] text-emerald-500/80 font-mono">Pending Intake</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-md bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Stat 3: In Progress */}
      <div className="bg-[#071120] border border-white/[0.08] rounded-lg p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8B98A5] uppercase tracking-wider block">
            In Progress
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-display font-bold text-white">{inProgress}</span>
            <span className="text-[11px] text-blue-400 font-mono">Active Tracing</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-md bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>

      {/* Stat 4: Requiring Attention */}
      <div className="bg-[#071120] border border-red-500/25 rounded-lg p-3.5 flex items-center justify-between bg-gradient-to-r from-red-950/20 to-transparent">
        <div>
          <span className="text-[11px] font-mono text-red-400/90 uppercase tracking-wider block">
            Requiring Attention
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-display font-bold text-red-400">{criticalAttention}</span>
            <span className="text-[11px] text-red-300/80 font-mono">Imminent Cashout</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-md bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
