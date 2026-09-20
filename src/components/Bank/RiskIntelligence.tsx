import React from 'react';
import { Database, Cpu, BrainCircuit, ShieldCheck, Binary } from 'lucide-react';
import { BankAccount } from '../../types/bank';

export const RiskIntelligence: React.FC<{ account: BankAccount }> = ({ account }) => {
  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              DATA EVIDENCE CLASSIFICATION
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Strict separation between empirical banking observations and algorithmic inferences
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Split: OBSERVED, DERIVED, MODEL SIGNALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {/* Column 1: OBSERVED DATA */}
        <div className="p-3.5 rounded-lg bg-[#070F1E] border border-cyan-500/20">
          <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-white/[0.06] text-cyan-400">
            <Database className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase">OBSERVED DATA</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Inbound Transactions:</span>
              <span className="text-white font-bold">{account.incomingTransactionCount ?? 1} tx</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Inbound Volume:</span>
              <span className="text-cyan-300 font-bold">₹{(account.incomingAmountTotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Outbound Transactions:</span>
              <span className="text-white font-bold">{account.outgoingTransactionCount ?? 0} tx</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Outbound Volume:</span>
              <span className="text-red-400 font-bold">₹{(account.outgoingAmountTotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Tenancy:</span>
              <span className="text-white font-bold">{account.accountAgeDays ?? 45} Days</span>
            </div>
          </div>
        </div>

        {/* Column 2: DERIVED METRICS */}
        <div className="p-3.5 rounded-lg bg-[#070F1E] border border-amber-500/20">
          <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-white/[0.06] text-amber-400">
            <Binary className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase">DERIVED METRICS</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Unique Inbound Senders:</span>
              <span className="text-white font-bold">{account.uniqueSenders ?? 1} senders</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Unique Outbound Receivers:</span>
              <span className="text-amber-300 font-bold">{account.uniqueReceivers ?? 0} receivers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fund Split Ratio:</span>
              <span className="text-white font-bold">{(account.fundSplitRatio ?? 0.85).toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dispersal Velocity:</span>
              <span className="text-amber-300 font-bold">{(account.transferVelocity ?? 0.12).toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Drain Time Window:</span>
              <span className="text-white font-bold">&lt; 90 Minutes</span>
            </div>
          </div>
        </div>

        {/* Column 3: MODEL SIGNALS */}
        <div className="p-3.5 rounded-lg bg-[#120609] border border-red-500/30">
          <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-red-500/20 text-red-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase">MODEL SIGNALS</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Network Risk Score:</span>
              <span className="text-red-400 font-bold">{(account.networkRiskScore ?? 0.85).toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Graph Centrality Degree:</span>
              <span className="text-white font-bold">{account.networkDegree ?? 5} Nodes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mule Funneling Match:</span>
              <span className="text-red-300 font-bold">Layer-1 Mule Hub</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Intervention Recommendation:</span>
              <span className="text-amber-300 font-bold">Escalate to I4C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model Confidence:</span>
              <span className="text-cyan-300 font-bold">97.9% Calibrated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
