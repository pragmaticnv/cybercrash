import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Network, Zap, Split, ShieldAlert } from 'lucide-react';
import { BankAccount } from '../../types/bank';

interface AccountRiskProfileProps {
  account: BankAccount;
}

export const AccountRiskProfile: React.FC<AccountRiskProfileProps> = ({ account }) => {
  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
        <span>ACCOUNT RISK &amp; FLOW PROFILE</span>
        <span className="text-[10px] text-slate-500">ML/FEATURE ENGINE OUTPUT</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Inflow */}
        <div className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">TOTAL INFLOW</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-white">
              ₹{(account.incomingAmountTotal ?? 0).toLocaleString()}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
              {account.incomingTransactionCount ?? 1} tx · {account.uniqueSenders ?? 1} senders
            </div>
          </div>
        </div>

        {/* Outflow */}
        <div className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-red-400 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">TOTAL OUTFLOW</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-red-400">
              ₹{(account.outgoingAmountTotal ?? 0).toLocaleString()}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
              {account.outgoingTransactionCount ?? 0} tx · {account.uniqueReceivers ?? 0} receivers
            </div>
          </div>
        </div>

        {/* Network Degree */}
        <div className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-purple-400 mb-1">
            <Network className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">NETWORK DEGREE</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-white">
              {account.networkDegree ?? 5}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
              Connected Nodes
            </div>
          </div>
        </div>

        {/* Transfer Velocity */}
        <div className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">VELOCITY INDEX</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-amber-300">
              {(account.transferVelocity ?? 0.12).toFixed(3)}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
              Rapid Dispersal
            </div>
          </div>
        </div>

        {/* Fund Split Ratio */}
        <div className="p-3 rounded-lg bg-[#070F1E] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
            <Split className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">SPLIT RATIO</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-white">
              {(account.fundSplitRatio ?? 0.85).toFixed(3)}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
              Multi-Tier Split
            </div>
          </div>
        </div>

        {/* Network Risk Score */}
        <div className="p-3 rounded-lg bg-[#140608] border border-red-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-red-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-bold">NETWORK RISK</span>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-red-400">
              {(account.networkRiskScore ?? 0.85).toFixed(3)}
            </div>
            <div className="text-[10.5px] font-mono text-red-300 mt-0.5 font-bold">
              High Anomaly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
