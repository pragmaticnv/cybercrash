import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Users, TrendingDown } from 'lucide-react';

interface MoneyFlowSummaryProps {
  incomingTx: number;
  outgoingTx: number;
  uniqueReceivers: number;
  downstreamAmount: string;
}

export const MoneyFlowSummary: React.FC<MoneyFlowSummaryProps> = ({
  incomingTx,
  outgoingTx,
  uniqueReceivers,
  downstreamAmount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#050C18] border-b border-white/[0.08] text-xs">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
          MONEY-TRAIL SUMMARY
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-4 sm:gap-6 font-mono text-[11px]">
        {/* Metric 1 */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Incoming Tx:</span>
          <strong className="text-white font-bold">{incomingTx}</strong>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400">Outgoing Tx:</span>
          <strong className="text-white font-bold">{outgoingTx}</strong>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Unique Receivers:</span>
          <strong className="text-white font-bold">{uniqueReceivers}</strong>
        </div>

        {/* Metric 4 */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Downstream Traced:</span>
          <strong className="text-emerald-400 font-bold">{downstreamAmount}</strong>
        </div>
      </div>
    </div>
  );
};
