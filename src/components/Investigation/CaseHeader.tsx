import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, Layers, GitFork, Network, History as HistoryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Case } from '../../types/case';
import { PriorityBadge } from '../Common/Badge';
import { useInvestigationStore, InvestigationMode } from '../../store/useInvestigationStore';

interface CaseHeaderProps {
  caseData: Case;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({ caseData }) => {
  const navigate = useNavigate();
  const { activeMode, setActiveMode } = useInvestigationStore();

  const modes: { id: InvestigationMode; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'OVERVIEW', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'trace', label: 'TRACE', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'network', label: 'NETWORK', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'HISTORY', icon: <HistoryIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full bg-[#050B14] border-b border-white/[0.08] px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-[57px] z-20 backdrop-blur-md">
      {/* Left: Back to Case Command + Primary Case Telemetry */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/cases')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-semibold">CASE COMMAND</span>
        </button>

        <div className="h-5 w-[1px] bg-white/[0.1] hidden sm:block" />

        {/* Case ID & Type */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {caseData.id}
          </span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs font-medium text-slate-300">{caseData.type}</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Amount - Unboxed */}
        <span className="font-mono text-sm font-bold text-emerald-400">
          {caseData.amount}
        </span>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Priority - Unboxed */}
        <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-400 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {caseData.priority}
        </span>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Primary Mule - Unboxed */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">PRIMARY MULE:</span>
          <span className="font-bold text-amber-300">{caseData.primaryMule}</span>
        </div>
      </div>

      {/* Right: Investigation Mode Tabs */}
      <div className="flex items-center bg-[#081220] border border-white/[0.08] p-1 rounded-lg">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono font-semibold uppercase transition-all select-none ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
