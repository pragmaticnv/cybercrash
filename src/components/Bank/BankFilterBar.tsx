import React from 'react';
import { Filter, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { AlertSeverity } from '../../types/bank';

export const BankFilterBar: React.FC = () => {
  const {
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter
  } = useBankStore();

  const severities: ('ALL' | AlertSeverity)[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];
  const statuses: ('ALL' | 'OPEN' | 'REVIEW' | 'ESCALATED' | 'RESOLVED')[] = ['ALL', 'OPEN', 'REVIEW', 'ESCALATED', 'RESOLVED'];
  const timeRanges: ('1H' | '24H' | '7D' | '30D')[] = ['1H', '24H', '7D', '30D'];

  return (
    <div className="w-full bg-[#040914] border-b border-white/[0.08] px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <div className="flex flex-wrap items-center gap-4">
        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10.5px] uppercase">SEVERITY:</span>
          <div className="flex items-center bg-[#070E1A] p-0.5 rounded border border-white/[0.08]">
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                  severityFilter === sev
                    ? sev === 'CRITICAL'
                      ? 'bg-red-500/25 text-red-300 border border-red-500/40 shadow-sm'
                      : sev === 'HIGH'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10.5px] uppercase">STATUS:</span>
          <div className="flex items-center bg-[#070E1A] p-0.5 rounded border border-white/[0.08]">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400 text-[10.5px] uppercase">WINDOW:</span>
        <div className="flex items-center bg-[#070E1A] p-0.5 rounded border border-white/[0.08]">
          {timeRanges.map((time) => (
            <button
              key={time}
              onClick={() => setTimeFilter(time)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                timeFilter === time
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
