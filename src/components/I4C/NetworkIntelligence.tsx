import React from 'react';
import { Network, Users, ArrowUpRight, ShieldAlert, GitBranch, MapPin } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cNetworks } from '../../data/i4cMockData';
import { I4CNetwork } from '../../types/i4c';

export const NetworkIntelligence: React.FC = () => {
  const { openNetworkDrawer } = useI4CStore();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              MULE NETWORK INTELLIGENCE
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Ranked multi-tier syndicates exhibiting cross-jurisdiction laundering
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          327 NETWORKS MONITORED
        </span>
      </div>

      {/* Network Ranked Cards */}
      <div className="space-y-2.5">
        {i4cNetworks.map((net) => (
          <div
            key={net.id}
            onClick={() => openNetworkDrawer(net)}
            className="p-3 rounded-lg bg-[#07101E] border border-white/[0.06] hover:border-amber-500/40 hover:bg-[#0A172C] transition-all cursor-pointer group select-none"
          >
            {/* Top row: ID, Name, Risk Level */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  {net.id}
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {net.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    net.riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {net.riskLevel}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Pattern description */}
            <div className="text-[11px] text-slate-400 font-sans mb-2">
              {net.flowPattern}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">ACCOUNTS</div>
                <div className="text-xs font-bold text-white">{net.totalAccounts}</div>
              </div>
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">CASES</div>
                <div className="text-xs font-bold text-cyan-300">{net.associatedCasesCount}</div>
              </div>
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">STATES</div>
                <div className="text-xs font-bold text-purple-300">{net.statesCount}</div>
              </div>
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">TRACED</div>
                <div className="text-xs font-bold text-red-400">{net.amountTraced}</div>
              </div>
            </div>

            {/* Affected States tags */}
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {net.states.map((st) => (
                <span key={st} className="text-[9.5px] font-mono text-slate-400 bg-white/[0.04] px-1.5 py-0.2 rounded">
                  {st}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
