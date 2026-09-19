import React from 'react';
import { HistoricalCase } from '../../types/case';
import { History, ExternalLink, Link2, AlertCircle } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

interface HistoricalLinksCardProps {
  cases: HistoricalCase[];
}

export const HistoricalLinksCard: React.FC<HistoricalLinksCardProps> = ({ cases }) => {
  const { setSelectedHistoricalCase } = useInvestigationStore();

  return (
    <div className="bg-[#071120] border border-white/[0.08] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            HISTORICAL CASE INTELLIGENCE
          </h3>
        </div>
        <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/25 font-bold">
          {cases.length} PREVIOUS CASES FOUND
        </span>
      </div>

      {cases.length === 0 ? (
        <div className="p-4 rounded-lg bg-[#040914] text-center text-xs text-slate-400">
          No historical case links detected.
        </div>
      ) : (
        <div className="space-y-2.5">
          {cases.map((hc) => (
            <div
              key={hc.caseId}
              onClick={() => setSelectedHistoricalCase(hc)}
              className="p-3 rounded-lg bg-[#040914] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#071424] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                  {hc.caseId}
                </span>
                <span className="font-mono text-xs font-bold text-white">{hc.amount}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>{hc.title}</span>
                <span className="text-[11px] font-mono text-slate-400">{hc.state}</span>
              </div>

              <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-1.5 border-t border-white/[0.04]">
                <span>Date: {hc.date}</span>
                <span className="text-emerald-400 font-bold">{hc.similarity}% pattern match</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
