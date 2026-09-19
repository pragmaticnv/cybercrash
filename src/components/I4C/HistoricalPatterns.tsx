import React from 'react';
import { History, Shield, ArrowRight, Share2, Layers } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cHistoricalPatterns } from '../../data/i4cMockData';

export const HistoricalPatterns: React.FC = () => {
  const { openNetworkById, setSelectedFraudType } = useI4CStore();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              RECURRING SYNDICATE STRUCTURES
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Structural archetypes repeated across distinct investigation jurisdictions
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          3 MAJOR ARCHETYPES
        </span>
      </div>

      {/* Grid of Recurring Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {i4cHistoricalPatterns.map((pat) => (
          <div
            key={pat.fraudType}
            onClick={() => setSelectedFraudType(pat.fraudType)}
            className="p-3.5 rounded-lg bg-[#070F1E] border border-white/[0.06] hover:border-purple-500/40 hover:bg-[#0B172E] transition-all cursor-pointer group select-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {pat.fraudType}
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/15 px-1.5 py-0.5 rounded">
                  {pat.totalLoss}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/[0.06] text-center font-mono my-2">
                <div>
                  <div className="text-[9px] text-slate-400">NETWORKS</div>
                  <div className="text-xs font-bold text-white">{pat.recurringNetworksCount}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">CASES</div>
                  <div className="text-xs font-bold text-cyan-300">{pat.linkedCasesCount}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">STATES</div>
                  <div className="text-xs font-bold text-purple-300">{pat.statesCount}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-[10px]">Sample: {pat.networkIds.join(', ')}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (pat.networkIds.length > 0) openNetworkById(pat.networkIds[0]);
                }}
                className="text-purple-400 hover:text-purple-300 text-[10.5px] font-semibold flex items-center gap-1"
              >
                <span>Inspect Network</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
