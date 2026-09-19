import React from 'react';
import { History, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { BankHistoryEvent } from '../../types/bank';

export const AccountHistoryView: React.FC<{ history: BankHistoryEvent[] }> = ({ history }) => {
  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              INTERNAL BANK AUDIT &amp; ALERT HISTORY
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Previous bank-specific risk reviews and compliance audit logs
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {history.length} HISTORICAL EVENTS
        </span>
      </div>

      {/* Events Timeline */}
      <div className="space-y-2.5">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-white">{item.date}</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-300 font-semibold">{item.type}</span>
              </div>
              <span
                className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  item.outcome === 'Escalated'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : item.outcome === 'Reviewed'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {item.outcome}
              </span>
            </div>

            <div className="text-xs text-slate-200 font-sans mt-0.5">{item.description}</div>

            {item.notes && (
              <div className="text-[11px] text-slate-400 font-sans bg-white/[0.02] p-1.5 rounded mt-1">
                <span className="text-slate-500 font-mono text-[10px]">Note: </span>
                {item.notes}
              </div>
            )}

            <div className="text-[9.5px] font-mono text-slate-500 mt-1">
              Logged by: {item.officerId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
