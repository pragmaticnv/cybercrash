import React from 'react';
import { ChevronRight, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Case } from '../../types/case';
import { PriorityBadge } from '../Common/Badge';

interface CaseRowProps {
  caseData: Case;
  onClick: (caseId: string) => void;
}

export const CaseRow: React.FC<CaseRowProps> = ({ caseData, onClick }) => {
  return (
    <tr
      onClick={() => onClick(caseData.id)}
      className="border-b border-white/[0.06] hover:bg-[#0C192E]/60 transition-colors cursor-pointer group select-none"
    >
      {/* 1. Case ID */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-white group-hover:text-cyan-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-80" />
        {caseData.id}
      </td>

      {/* 2. Fraud Type */}
      <td className="py-3.5 px-4 text-xs text-slate-200 font-medium">
        {caseData.type}
      </td>

      {/* 3. Reported Amount */}
      <td className="py-3.5 px-4 text-xs font-mono font-bold text-white tracking-wide">
        {caseData.amount}
      </td>

      {/* 4. Complaint State */}
      <td className="py-3.5 px-4 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono">
          {caseData.state} ({caseData.stateCode})
        </span>
      </td>

      {/* 5. Complaint Time */}
      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
        {caseData.complaintTime}
      </td>

      {/* 6. Primary Mule Account */}
      <td className="py-3.5 px-4 text-xs font-mono text-red-400">
        <span className="bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[11px]">
          {caseData.primaryMule}
        </span>
      </td>

      {/* 7. Status / Priority */}
      <td className="py-3.5 px-4 text-xs">
        <PriorityBadge priority={caseData.priority} />
      </td>

      {/* 8. Last Updated */}
      <td className="py-3.5 px-4 text-[11px] font-mono text-slate-400">
        {caseData.lastUpdated || 'Recent'}
      </td>

      {/* Action Chevron */}
      <td className="py-3.5 px-4 text-right">
        <div className="inline-flex items-center justify-center w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all">
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </td>
    </tr>
  );
};
