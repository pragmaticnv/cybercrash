import React from 'react';
import { INITIAL_AUDIT_EVENTS, AuditEventItem } from '../../data/adminDemoData';
import { ScrollText, ShieldAlert, ArrowRight, Terminal } from 'lucide-react';

interface AuditTrailProps {
  onOpenFullAudit: () => void;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ onOpenFullAudit }) => {
  // Show top 4 in summary card
  const displayEvents = INITIAL_AUDIT_EVENTS.slice(0, 4);

  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
            <ScrollText className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              SECURITY AUDIT TRAIL
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              Cryptographically Signed Immutable Activity Log
            </span>
          </div>
        </div>

        <button
          onClick={onOpenFullAudit}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.1] hover:border-amber-500/30 text-[11px] font-mono font-semibold text-amber-300 transition-all"
        >
          <span>VIEW FULL AUDIT TRAIL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Monospace Audit Stream */}
      <div className="my-3 font-mono text-[11.5px] space-y-2">
        {displayEvents.map((evt) => {
          const isSecurity = evt.severity === 'SECURITY';
          const isWarning = evt.severity === 'WARNING';
          const isNotice = evt.severity === 'NOTICE';

          return (
            <div
              key={evt.id}
              className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05] hover:border-white/[0.12] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold">{evt.timestamp}</span>
                <span className="text-white font-bold px-1.5 py-0.5 rounded bg-white/[0.05]">
                  {evt.userId}
                </span>
                <span className="text-[#94A3B8] font-medium">{evt.target}</span>
                <span
                  className={`font-semibold ${
                    isSecurity
                      ? 'text-red-400'
                      : isWarning
                      ? 'text-amber-400'
                      : isNotice
                      ? 'text-sky-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {evt.action}
                </span>
              </div>

              {/* Right Details */}
              <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                <span className="hidden md:inline">{evt.ipAddress}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.03] text-[#CBD5E1] border border-white/[0.05]">
                  {evt.agency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>CHAIN HASH: SHA-256 ENCRYPTED AUDIT BLOCK #00914-GovNet</span>
        </div>
        <span>COMPLIANCE: NCRP FORENSIC ADMISSIBILITY ACT</span>
      </div>
    </div>
  );
};
