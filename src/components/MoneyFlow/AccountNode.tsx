import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Shield, AlertOctagon, User, Building, Landmark, AlertTriangle } from 'lucide-react';

interface AccountNodeData {
  id: string;
  label: string;
  holder: string;
  bank: string;
  amount: string;
  nodeType: 'victim' | 'primary-mule' | 'connected' | 'high-risk' | 'cashout';
  isHistorical?: boolean;
}

export const AccountNode = memo(({ data }: { data: AccountNodeData }) => {
  const isPrimary = data.nodeType === 'primary-mule';
  const isVictim = data.nodeType === 'victim';
  const isHighRisk = data.nodeType === 'high-risk';

  let borderStyle = 'border-white/[0.12] bg-[#071120]';
  let badgeStyle = 'bg-slate-800 text-slate-300';
  let icon = <Building className="w-3.5 h-3.5 text-slate-400" />;

  if (isPrimary) {
    borderStyle = 'border-2 border-red-500 bg-[#0E070A] shadow-[0_0_20px_rgba(239,68,68,0.4)]';
    badgeStyle = 'bg-red-500/20 text-red-400 border border-red-500/30';
    icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
  } else if (isVictim) {
    borderStyle = 'border-2 border-cyan-400 bg-[#040E1C] shadow-[0_0_16px_rgba(56,189,248,0.3)]';
    badgeStyle = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    icon = <User className="w-4 h-4 text-cyan-400" />;
  } else if (isHighRisk) {
    borderStyle = 'border border-amber-500/60 bg-[#120B04] shadow-[0_0_14px_rgba(245,158,11,0.25)]';
    badgeStyle = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  }

  return (
    <div
      className={`rounded-xl p-3 min-w-[200px] max-w-[240px] text-xs transition-transform hover:scale-[1.03] select-none cursor-pointer ${borderStyle}`}
    >
      {/* Target handle for incoming edges */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-cyan-400 !border-2 !border-[#02060D]"
      />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${badgeStyle}`}>
            {data.label}
          </span>
        </div>
        {data.isHistorical && (
          <span className="text-[9.5px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            LINKED
          </span>
        )}
      </div>

      {/* Account ID */}
      <div className="font-mono text-sm font-bold text-white tracking-wide mb-1 flex items-center justify-between">
        <span>{data.id}</span>
      </div>

      {/* Holder & Bank */}
      <div className="text-[11px] text-slate-300 font-medium truncate">
        {data.holder}
      </div>
      <div className="text-[10.5px] font-mono text-slate-400 truncate mt-0.5">
        {data.bank}
      </div>

      {/* Amount Tag */}
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">Handled:</span>
        <span className={`font-mono text-xs font-bold ${isPrimary ? 'text-red-400' : 'text-white'}`}>
          {data.amount}
        </span>
      </div>

      {/* Source handle for outgoing edges */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-red-400 !border-2 !border-[#02060D]"
      />
    </div>
  );
});
AccountNode.displayName = 'AccountNode';
