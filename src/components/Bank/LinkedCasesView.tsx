import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ExternalLink, ArrowRight, ShieldAlert } from 'lucide-react';
import { BankLinkedCase } from '../../types/bank';

export const LinkedCasesView: React.FC<{ cases: BankLinkedCase[] }> = ({ cases }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              LINKED LAW ENFORCEMENT DOSSIERS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Inter-agency criminal proceedings referencing this account entity
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          CYBERCRASH ECOSYSTEM
        </span>
      </div>

      {/* Cases List */}
      <div className="space-y-2.5">
        {cases.map((c) => (
          <div
            key={c.caseId}
            className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] hover:border-cyan-500/40 transition-colors flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">{c.caseId}</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-1.5 py-0.2 rounded border border-cyan-500/30">
                  {c.fraudType}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-400">{c.reportedAmount}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
              <span>{c.leaAgency} ({c.complaintState})</span>
              <span className="font-mono text-[10.5px] text-slate-500">{c.incidentDate}</span>
            </div>

            <button
              onClick={() => navigate(`/investigation/${c.caseId}`)}
              className="w-full py-1.5 px-2.5 rounded bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <span>OPEN FULL LEA INVESTIGATION DOSSIER</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
