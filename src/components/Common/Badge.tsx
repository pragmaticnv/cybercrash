import React from 'react';
import { CasePriority } from '../../types/case';

interface PriorityBadgeProps {
  priority: CasePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
          LOW
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isTarget = status.includes('TARGET') || status.includes('FLAGGED') || status.includes('FREEZE');
  const isSuccess = status.includes('COMPLETED') || status.includes('ACTIVE');
  
  if (isTarget) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono uppercase bg-red-950/50 text-red-300 border border-red-700/40">
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono uppercase bg-cyan-950/50 text-cyan-300 border border-cyan-700/40">
      {status}
    </span>
  );
};
