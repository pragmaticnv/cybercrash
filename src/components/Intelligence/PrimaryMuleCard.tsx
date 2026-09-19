import React from 'react';
import { Account } from '../../types/account';
import { ShieldAlert, ExternalLink, Activity, AlertOctagon } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

interface PrimaryMuleCardProps {
  account: Account;
}

export const PrimaryMuleCard: React.FC<PrimaryMuleCardProps> = ({ account }) => {
  const { setSelectedAccountId } = useInvestigationStore();

  return (
    <div className="bg-[#071120] border border-red-500/25 rounded-xl p-4 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            PRIMARY MULE ACCOUNT
          </h3>
        </div>
        <button
          onClick={() => setSelectedAccountId(account.id)}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>Inspect Node</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-base font-bold text-red-400 tracking-wider">
          {account.id}
        </span>
        <span className="text-xs font-medium text-slate-300">
          {account.holder}
        </span>
      </div>

      {/* Account Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-3">
        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Bank / Institution</span>
          <span className="font-semibold text-slate-200">{account.bank}</span>
        </div>

        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Account Type</span>
          <span className="font-semibold text-slate-200">{account.accountType}</span>
        </div>

        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Account Age</span>
          <span className="font-mono font-bold text-slate-200">{account.accountAgeDays} days</span>
        </div>

        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Previous Alerts</span>
          <span className="font-mono font-bold text-amber-400">{account.previousAlerts} alert</span>
        </div>

        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Network Risk</span>
          <span className="font-mono font-bold text-red-400">{account.networkRiskScore.toFixed(3)}</span>
        </div>

        <div className="bg-[#040914] p-2 rounded border border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Network Degree</span>
          <span className="font-mono font-bold text-cyan-400">{account.networkDegree} nodes</span>
        </div>
      </div>

      {/* Transaction Throughput Strip */}
      <div className="bg-[#040914] p-2.5 rounded border border-white/[0.06] text-xs">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10.5px] font-mono text-slate-400">Throughput Velocity:</span>
          <span className="text-[11px] font-mono text-slate-300 font-medium">In: {account.incomingAmount} · Out: {account.outgoingAmount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span>Split Ratio: <strong className="text-white">{account.fundSplitRatio.toFixed(3)}</strong></span>
          <span>·</span>
          <span>Receivers: <strong className="text-white">{account.uniqueReceivers}</strong></span>
          <span>·</span>
          <span>KYC: <strong className="text-amber-300">{account.kycStatus}</strong></span>
        </div>
      </div>
    </div>
  );
};
