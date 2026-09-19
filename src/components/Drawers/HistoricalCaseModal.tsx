import React from 'react';
import { X, History, Link2, ShieldCheck, AlertCircle, Building, Calendar, DollarSign } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

export const HistoricalCaseModal: React.FC = () => {
  const { selectedHistoricalCase, setSelectedHistoricalCase } = useInvestigationStore();

  if (!selectedHistoricalCase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#071120] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040914]">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                HISTORICAL CRIME LINKAGE
              </h2>
              <span className="text-[11px] font-mono text-cyan-300">{selectedHistoricalCase.caseId}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedHistoricalCase(null)}
            className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#030712] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white text-sm">{selectedHistoricalCase.title}</span>
              <span className="font-mono text-xs font-bold text-red-400">{selectedHistoricalCase.amount}</span>
            </div>
            <div className="text-slate-400 text-xs">
              State: <strong className="text-slate-200">{selectedHistoricalCase.state}</strong> · Date: <strong className="text-slate-200">{selectedHistoricalCase.date}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 uppercase block">Pattern Similarity</span>
              <span className="text-emerald-400 font-bold text-sm">{selectedHistoricalCase.similarity}% Match</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 uppercase block">Legal Status</span>
              <span className="text-amber-400 font-bold text-xs">{selectedHistoricalCase.status}</span>
            </div>
          </div>

          {/* Shared Forensic Link */}
          <div className="p-3.5 rounded-lg bg-[#040914] border border-cyan-500/20 space-y-1">
            <span className="text-[10.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              FORENSIC LINKAGE RATIONALE
            </span>
            <p className="text-slate-200 leading-relaxed text-xs">
              {selectedHistoricalCase.sharedLink}
            </p>
          </div>

          {/* Syndicate Attribution */}
          <div className="p-3 rounded-lg bg-[#0E070A] border border-red-500/20 text-xs">
            <span className="text-[10.5px] font-mono font-bold text-red-400 uppercase block">
              ATTRIBUTED SYNDICATE
            </span>
            <span className="text-slate-200 font-medium">{selectedHistoricalCase.syndicate}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#040914] flex justify-end">
          <button
            onClick={() => setSelectedHistoricalCase(null)}
            className="px-4 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
