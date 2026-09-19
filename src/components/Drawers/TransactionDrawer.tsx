import React from 'react';
import { X, GitCommit, ArrowRight, ShieldCheck, Clock, Hash } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { MOCK_TRANSACTIONS } from '../../data/mockInvestigation';

export const TransactionDrawer: React.FC = () => {
  const { selectedTransactionId, setSelectedTransactionId } = useInvestigationStore();

  if (!selectedTransactionId) return null;

  const txn = MOCK_TRANSACTIONS.find((t) => t.id === selectedTransactionId) || {
    id: selectedTransactionId,
    caseId: 'CASE_007001',
    sourceId: 'ACC_013041',
    targetId: 'ACC_008564',
    sourceLabel: 'ACC_013041 (Primary Mule)',
    targetLabel: 'ACC_008564 (Layer 2 Mule)',
    amount: '₹98,000',
    amountRaw: 98000,
    timestamp: '12 Sep 2025, 21:18:14',
    channel: 'NEFT Fast Route',
    direction: 'outbound',
    hopLevel: 'Hop 2',
    status: 'COMPLETED',
    utr: 'UTR892100482910',
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#071120] border-l border-white/[0.12] shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040914]">
        <div className="flex items-center gap-2.5">
          <GitCommit className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              TRANSACTION AUDIT
            </h2>
            <span className="text-[11px] font-mono text-slate-400">{txn.id}</span>
          </div>
        </div>
        <button
          onClick={() => setSelectedTransactionId(null)}
          className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4 font-sans text-xs">
        {/* Amount Card */}
        <div className="p-4 rounded-xl bg-[#030814] border border-cyan-500/30 text-center">
          <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">
            TRANSFERRED SUM
          </span>
          <span className="text-2xl font-mono font-extrabold text-white mt-1 block">
            {txn.amount}
          </span>
          <span className="inline-block mt-2 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
            {txn.status}
          </span>
        </div>

        {/* Transfer Pathway Flow */}
        <div className="p-3.5 rounded-xl bg-[#040914] border border-white/[0.06] space-y-3">
          <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            TRANSFER HOP
          </span>

          <div className="flex items-center justify-between gap-2">
            <div className="bg-[#071120] p-2.5 rounded-lg border border-white/[0.08] flex-1 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Source</span>
              <span className="font-mono font-bold text-cyan-300 text-xs truncate block">{txn.sourceId}</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            <div className="bg-[#071120] p-2.5 rounded-lg border border-white/[0.08] flex-1 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Destination</span>
              <span className="font-mono font-bold text-red-400 text-xs truncate block">{txn.targetId}</span>
            </div>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="p-3.5 rounded-xl bg-[#040914] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <span className="text-slate-400 font-mono text-[11px]">Channel:</span>
            <span className="font-mono font-bold text-white">{txn.channel}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <span className="text-slate-400 font-mono text-[11px]">Timestamp:</span>
            <span className="font-mono text-slate-200">{txn.timestamp}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <span className="text-slate-400 font-mono text-[11px]">Hop Sequence:</span>
            <span className="font-mono font-bold text-amber-300">{txn.hopLevel}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <span className="text-slate-400 font-mono text-[11px]">Associated Case:</span>
            <span className="font-mono text-cyan-400 font-bold">{txn.caseId}</span>
          </div>

          {txn.utr && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-mono text-[11px]">Bank Reference (UTR):</span>
              <span className="font-mono text-slate-300 text-[11px]">{txn.utr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-[#040914] flex items-center justify-end">
        <button
          onClick={() => setSelectedTransactionId(null)}
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-mono text-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
