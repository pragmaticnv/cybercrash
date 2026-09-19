import React from 'react';
import { Case } from '../../types/case';
import { FileText, Calendar, MapPin, DollarSign } from 'lucide-react';

interface CaseSummaryProps {
  caseData: Case;
}

export const CaseSummary: React.FC<CaseSummaryProps> = ({ caseData }) => {
  return (
    <div className="bg-[#071120] border border-white/[0.08] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            CASE DOSSIER SUMMARY
          </h3>
        </div>
        <span className="font-mono text-[11px] text-slate-400 font-semibold">{caseData.id}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10.5px] font-mono text-slate-400 uppercase block">Fraud Type</span>
          <span className="font-semibold text-white">{caseData.type}</span>
        </div>

        <div>
          <span className="text-[10.5px] font-mono text-slate-400 uppercase block">Reported Amount</span>
          <span className="font-mono font-bold text-red-400 text-sm">{caseData.amount}</span>
        </div>

        <div>
          <span className="text-[10.5px] font-mono text-slate-400 uppercase block">Complaint State</span>
          <span className="text-slate-200 font-medium">{caseData.state} ({caseData.stateCode})</span>
        </div>

        <div>
          <span className="text-[10.5px] font-mono text-slate-400 uppercase block">Complaint Time</span>
          <span className="font-mono text-slate-300 text-[11.5px]">{caseData.complaintTime}</span>
        </div>
      </div>

      {/* Complainant Strip */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Complainant:</span>
        <span className="text-slate-200 font-medium">{caseData.victim.name} ({caseData.victim.bank})</span>
      </div>
    </div>
  );
};
