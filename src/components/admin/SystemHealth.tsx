import React from 'react';
import { SYSTEM_SERVICES } from '../../data/adminDemoData';
import { Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SystemHealthProps {
  onOpenDetailedDiagnostics?: () => void;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ onOpenDetailedDiagnostics }) => {
  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              SYSTEM HEALTH
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              Core Subsystem Cluster Status
            </span>
          </div>
        </div>

        {onOpenDetailedDiagnostics && (
          <button
            onClick={onOpenDetailedDiagnostics}
            className="text-[10.5px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          >
            DIAGNOSTICS
          </button>
        )}
      </div>

      {/* 6-Item Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
        {SYSTEM_SERVICES.map((srv, idx) => {
          const isReady = srv.status === 'READY';

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  {srv.name}
                </span>
                <span className="flex items-center gap-1 text-[9.5px] font-mono text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  {isReady ? 'READY' : 'ONLINE'}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-[#64748B]">
                <span>{srv.latency}</span>
                <span className="text-[#94A3B8]">{srv.uptime}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span>ALL NODES HEALTHY · 0 FAULTS</span>
        <span className="text-emerald-400">UPTIME: 99.98% (30D)</span>
      </div>
    </div>
  );
};
