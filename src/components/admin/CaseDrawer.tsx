import React, { useState } from 'react';
import { AdminCaseItem } from '../../data/adminDemoData';
import { 
  X, 
  Shield, 
  Building2, 
  Globe2, 
  Check, 
  AlertCircle, 
  MapPin, 
  User, 
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CaseDrawerProps {
  caseItem: AdminCaseItem | null;
  onClose: () => void;
  onNavigateToInvestigation?: (caseId: string) => void;
}

export const CaseDrawer: React.FC<CaseDrawerProps> = ({ 
  caseItem, 
  onClose,
  onNavigateToInvestigation 
}) => {
  if (!caseItem) return null;

  const [selectedAssignee, setSelectedAssignee] = useState<'lea_demo' | 'bank_demo' | 'nodal_demo'>('lea_demo');
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [currentAgency, setCurrentAgency] = useState(caseItem.assignedAgency);

  const handleAssign = () => {
    let agencyName = 'LEA Assigned (lea_demo)';
    if (selectedAssignee === 'bank_demo') agencyName = 'Bank Review (bank_demo)';
    if (selectedAssignee === 'nodal_demo') agencyName = 'Nodal Officer (nodal_demo)';

    setCurrentAgency(agencyName);
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#050B16] border-l border-white/[0.1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto select-none">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[14px] font-mono font-bold text-white tracking-wider">
                {caseItem.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/25 text-[10px] font-mono font-bold uppercase">
                {caseItem.priority} PRIORITY
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Banner */}
          {assignedSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono flex items-center gap-2 animate-in slide-in-from-top-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>CASE DISPATCHED: {currentAgency} NOTIFIED VIA SECURE CHANNEL</span>
            </div>
          )}

          {/* Metadata Specs */}
          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                FRAUD TYPE / CLASSIFICATION
              </span>
              <span className="text-[16px] font-bold text-white mt-0.5 block">
                {caseItem.fraudType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9.5px] font-mono text-[#64748B] uppercase block">
                  REPORTED LOSS
                </span>
                <span className="text-[18px] font-display font-bold text-white mt-0.5 block">
                  {caseItem.reportedAmount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9.5px] font-mono text-[#64748B] uppercase block">
                  JURISDICTION / STATE
                </span>
                <span className="text-[14px] font-mono font-bold text-cyan-300 mt-1 block">
                  {caseItem.state}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">STATUS:</span>
                <span className="text-emerald-400 font-bold">{caseItem.currentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">CURRENT ASSIGNED:</span>
                <span className="text-white font-medium">{currentAgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">INTAKE TIMESTAMP:</span>
                <span className="text-[#CBD5E1]">{caseItem.createdTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">AI PREDICTION:</span>
                <span className="text-cyan-400 font-bold">{caseItem.predictionStatus}</span>
              </div>
              {caseItem.predictedZone && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">PREDICTED CASH-OUT ZONE:</span>
                  <span className="text-amber-400 font-bold">{caseItem.predictedZone} ({caseItem.confidence})</span>
                </div>
              )}
              {caseItem.primaryMule && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">PRIMARY MULE ACCOUNT:</span>
                  <span className="text-[#FF4D58] font-bold">{caseItem.primaryMule}</span>
                </div>
              )}
            </div>

            {/* CASE ASSIGNMENT INTERACTION (Requirement #13) */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  ASSIGN / REASSIGN CASE
                </span>
                <span className="text-[9.5px] font-mono text-[#64748B]">
                  OPERATOR DISPATCH
                </span>
              </div>

              <div className="space-y-2">
                {/* LEA Investigator */}
                <div
                  onClick={() => setSelectedAssignee('lea_demo')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAssignee === 'lea_demo'
                      ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-red-400" />
                    <div>
                      <span className="text-[12px] font-bold text-white block">
                        LEA INVESTIGATOR
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        lea_demo (Goa Cyber Crime Cell)
                      </span>
                    </div>
                  </div>
                  {selectedAssignee === 'lea_demo' && (
                    <Check className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Bank Officer */}
                <div
                  onClick={() => setSelectedAssignee('bank_demo')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAssignee === 'bank_demo'
                      ? 'bg-sky-500/10 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="text-[12px] font-bold text-white block">
                        BANK OFFICER
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        bank_demo (SBI Nodal Risk Desk)
                      </span>
                    </div>
                  </div>
                  {selectedAssignee === 'bank_demo' && (
                    <Check className="w-4 h-4 text-sky-400" />
                  )}
                </div>

                {/* Nodal Officer */}
                <div
                  onClick={() => setSelectedAssignee('nodal_demo')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAssignee === 'nodal_demo'
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe2 className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[12px] font-bold text-white block">
                        NODAL OFFICER
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        nodal_demo (I4C Central Coordination)
                      </span>
                    </div>
                  </div>
                  {selectedAssignee === 'nodal_demo' && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleAssign}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-mono font-bold text-[12px] uppercase tracking-wider transition-all shadow-lg shadow-red-900/30"
                >
                  ASSIGN
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white font-mono text-[12px] uppercase tracking-wider transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link to Investigation Workspace (If supported) */}
        {onNavigateToInvestigation && (
          <div className="pt-4 mt-6 border-t border-white/[0.08]">
            <button
              onClick={() => onNavigateToInvestigation(caseItem.id)}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-2 transition-all"
            >
              <span>OPEN IN LEA INVESTIGATION WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
