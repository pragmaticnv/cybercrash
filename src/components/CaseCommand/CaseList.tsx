import React from 'react';
import { Case } from '../../types/case';
import { CaseRow } from './CaseRow';

interface CaseListProps {
  cases: Case[];
  onSelectCase: (caseId: string) => void;
}

export const CaseList: React.FC<CaseListProps> = ({ cases, onSelectCase }) => {
  if (cases.length === 0) {
    return (
      <div className="w-full bg-[#071120] border border-white/[0.08] rounded-xl p-12 text-center text-slate-400">
        <p className="text-sm font-medium">No matching cases found.</p>
        <span className="text-xs text-slate-500 mt-1 block">Try clearing or adjusting your search filters.</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#071120] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#050C16] border-b border-white/[0.08] text-[11px] font-mono text-[#8B98A5] uppercase tracking-wider select-none">
              <th className="py-3 px-4 font-semibold">Case ID</th>
              <th className="py-3 px-4 font-semibold">Fraud Type</th>
              <th className="py-3 px-4 font-semibold">Reported Amount</th>
              <th className="py-3 px-4 font-semibold">Complaint State</th>
              <th className="py-3 px-4 font-semibold">Complaint Time</th>
              <th className="py-3 px-4 font-semibold">Primary Mule</th>
              <th className="py-3 px-4 font-semibold">Priority</th>
              <th className="py-3 px-4 font-semibold">Last Updated</th>
              <th className="py-3 px-4 text-right font-semibold">Investigate</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <CaseRow key={c.id} caseData={c} onClick={onSelectCase} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
