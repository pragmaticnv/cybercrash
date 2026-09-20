import React from 'react';
import { 
  ADMIN_CASE_METRICS, 
  RECENT_CASE_STREAM, 
  AdminCaseItem 
} from '../../data/adminDemoData';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { 
  FolderLock, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Layers,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface CaseControlProps {
  onSelectCase: (caseItem: AdminCaseItem) => void;
  onOpenAssignCase?: () => void;
}

export const CaseControl: React.FC<CaseControlProps> = ({ 
  onSelectCase, 
  onOpenAssignCase 
}) => {
  const { activeCase, prediction } = useActiveCaseStore();

  const combinedCases = React.useMemo(() => {
    let list: AdminCaseItem[] = [...RECENT_CASE_STREAM];
    if (activeCase) {
      const dynamicCase: AdminCaseItem = {
        id: activeCase.id,
        fraudType: activeCase.type || 'Investment Scam',
        assignedAgency: activeCase.assignedTo || 'Cyber Crime Division',
        priority: 'CRITICAL',
        reportedAmount: activeCase.amount || '₹1,50,000',
        state: activeCase.state || 'Goa',
        currentStatus: 'ACTIVE',
        createdTime: 'Just now (LIVE DEMO)',
        predictionStatus: `ML Zone: ${prediction?.predictedZone || 'GA_Z05'} (${Math.round((prediction?.confidenceScore || 0.88) * 100)}%)`,
        predictedZone: prediction?.predictedZone || 'GA_Z05',
        confidence: `${Math.round((prediction?.confidenceScore || 0.88) * 100)}%`,
        victimName: activeCase.victim?.name || 'Complainant',
        primaryMule: activeCase.primaryMule
      };
      list = [dynamicCase, ...list.filter(c => c.id !== activeCase.id)];
    }
    return list;
  }, [activeCase, prediction]);
  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Module Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <FolderLock className="w-4 h-4 text-[#FF4D58]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              CASE CONTROL
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              Triage Queue & Cross-Agency Workload
            </span>
          </div>
        </div>

        {onOpenAssignCase && (
          <button
            onClick={onOpenAssignCase}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[11px] font-mono font-semibold text-[#FF6B72] transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ASSIGN CASE</span>
          </button>
        )}
      </div>

      {/* Case Metrics Ribbon */}
      <div className="grid grid-cols-4 gap-2 my-4">
        {/* Active */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <span className="text-[9.5px] font-mono text-[#94A3B8] uppercase">ACTIVE</span>
          <span className="text-[20px] font-display font-bold text-white leading-tight mt-0.5">
            {ADMIN_CASE_METRICS.active}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Triage In-Flight</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <span className="text-[9.5px] font-mono text-[#94A3B8] uppercase">PENDING REVIEW</span>
          <span className="text-[20px] font-display font-bold text-amber-300 leading-tight mt-0.5">
            {ADMIN_CASE_METRICS.pendingReview}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-amber-400">
            <Clock className="w-2.5 h-2.5" />
            <span>Awaiting Nodal</span>
          </div>
        </div>

        {/* Escalated */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <span className="text-[9.5px] font-mono text-[#94A3B8] uppercase">ESCALATED</span>
          <span className="text-[20px] font-display font-bold text-[#FF4D58] leading-tight mt-0.5">
            {ADMIN_CASE_METRICS.escalated}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-red-400">
            <AlertCircle className="w-2.5 h-2.5" />
            <span>High Loss Level</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <span className="text-[9.5px] font-mono text-[#94A3B8] uppercase">RESOLVED</span>
          <span className="text-[20px] font-display font-bold text-emerald-400 leading-tight mt-0.5">
            {ADMIN_CASE_METRICS.resolved.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-emerald-400">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Lien / Closed</span>
          </div>
        </div>
      </div>

      {/* Recent Case Stream */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
            RECENT INTAKE STREAM (CLICK TO INSPECT)
          </span>
          <span className="text-[9.5px] font-mono text-[#475569]">
            5 OF 127 ACTIVE
          </span>
        </div>

        <div className="space-y-2">
          {combinedCases.map((c) => {
            const isCritical = c.priority === 'CRITICAL';
            const isHigh = c.priority === 'HIGH';
            const isActiveDemo = c.id === activeCase?.id;

            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isActiveDemo
                    ? 'border-red-500/80 bg-[#160608] ring-1 ring-red-500/40 hover:bg-[#1f090c]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-cyan-500/30'
                }`}
              >
                {/* Left side info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-8 rounded-full ${
                      isActiveDemo
                        ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                        : isCritical
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                        : isHigh
                        ? 'bg-amber-400'
                        : 'bg-cyan-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {c.id}
                      </span>
                      {isActiveDemo && (
                        <span className="text-[8.5px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40 animate-pulse">
                          ACTIVE DEMO CASE
                        </span>
                      )}
                      <span className="text-[12px] text-[#CBD5E1] font-medium">
                        {c.fraudType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[#94A3B8]">
                      <span>{c.state}</span>
                      <span>•</span>
                      <span className="text-white/80 font-semibold">{c.reportedAmount}</span>
                      <span>•</span>
                      <span className="text-cyan-400">{c.predictionStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Right side tags & chevron */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-mono text-white/90 font-medium">
                      {c.assignedAgency}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold tracking-wider uppercase ${
                        isCritical
                          ? 'text-red-400'
                          : isHigh
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {c.priority} PRIORITY
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
