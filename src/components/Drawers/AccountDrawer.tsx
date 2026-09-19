import React from 'react';
import { X, ShieldAlert, Building, Calendar, AlertTriangle, ArrowDownLeft, ArrowUpRight, Network } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { MOCK_ACCOUNTS } from '../../data/mockInvestigation';

export const AccountDrawer: React.FC = () => {
  const { selectedAccountId, setSelectedAccountId, setSelectedHistoricalCase } = useInvestigationStore();

  if (!selectedAccountId) return null;

  const account = MOCK_ACCOUNTS[selectedAccountId] || {
    id: selectedAccountId,
    label: 'CONNECTED NODE',
    holder: 'Associated Account',
    bank: 'Scheduled Commercial Bank',
    ifsc: 'UTIB0001092',
    branch: 'Goa Division',
    role: 'Layer 2 Transit Node',
    accountType: 'Savings',
    accountAgeDays: 420,
    status: 'UNDER SURVEILLANCE',
    previousAlerts: 1,
    incomingAmount: '₹12,751',
    incomingTransactions: 1,
    uniqueSenders: 1,
    outgoingAmount: '₹11,000',
    outgoingTransactions: 2,
    uniqueReceivers: 2,
    fundSplitRatio: 0.86,
    networkDegree: 4,
    networkRiskScore: 0.654,
    flag: 'CONNECTED ACCOUNT',
    kycStatus: 'Verified ID (Potential Proxy)',
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-[#071120] border-l border-white/[0.12] shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040914]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              FORENSIC ACCOUNT DOSSIER
            </h2>
            <span className="text-[11px] font-mono text-slate-400">{account.id}</span>
          </div>
        </div>
        <button
          onClick={() => setSelectedAccountId(null)}
          className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4 font-sans text-xs">
        {/* Account Identity Block */}
        <div className="p-3.5 rounded-xl bg-[#030712] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-base font-bold text-cyan-400">{account.id}</span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
              {account.status}
            </span>
          </div>
          <div className="text-sm font-semibold text-white">{account.holder}</div>
          <div className="text-slate-400 text-xs mt-0.5">{account.bank} · {account.branch}</div>
          <div className="text-slate-500 font-mono text-[10.5px] mt-1">IFSC: {account.ifsc}</div>
        </div>

        {/* Primary Forensic Attributes */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Account Type</span>
            <span className="font-semibold text-white">{account.accountType}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Account Age</span>
            <span className="font-mono font-bold text-white">{account.accountAgeDays} days</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Previous Alerts</span>
            <span className="font-mono font-bold text-amber-400">{account.previousAlerts} logged</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.05]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Network Risk</span>
            <span className="font-mono font-bold text-red-400">{account.networkRiskScore.toFixed(3)}</span>
          </div>
        </div>

        {/* Transaction Flow Telemetry */}
        <div className="p-3.5 rounded-xl bg-[#040914] border border-white/[0.06] space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
            TRANSACTION THROUGHPUT
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Incoming Volume</span>
                <span className="font-mono font-bold text-white">{account.incomingAmount}</span>
                <span className="text-[10px] font-mono text-slate-500 block">({account.incomingTransactions} tx · {account.uniqueSenders} senders)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-red-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Outgoing Volume</span>
                <span className="font-mono font-bold text-red-400">{account.outgoingAmount}</span>
                <span className="text-[10px] font-mono text-slate-500 block">({account.outgoingTransactions} tx · {account.uniqueReceivers} receivers)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.04] grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-slate-500">Fund Split Ratio:</span>
              <span className="text-white font-bold ml-1.5">{account.fundSplitRatio.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-slate-500">Network Degree:</span>
              <span className="text-cyan-400 font-bold ml-1.5">{account.networkDegree} nodes</span>
            </div>
          </div>
        </div>

        {/* KYC & Behavioral Telemetry */}
        <div className="p-3 rounded-lg bg-[#040914] border border-white/[0.05] space-y-1.5 text-xs">
          <div>
            <span className="text-slate-400 text-[10.5px] font-mono uppercase block">KYC Verification State</span>
            <span className="text-amber-300 font-medium">{account.kycStatus}</span>
          </div>
          {account.velocity && (
            <div className="pt-1.5 border-t border-white/[0.04]">
              <span className="text-slate-400 text-[10.5px] font-mono uppercase block">Transfer Velocity</span>
              <span className="text-slate-200">{account.velocity}</span>
            </div>
          )}
        </div>

        {/* Historical Linkage */}
        <div className="p-3 rounded-lg bg-[#0E060A] border border-red-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-bold uppercase mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CRIME LINKAGE ASSESSMENT</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Account marked as High Priority Node due to immediate pass-through behavior. Correlated with 2 historical syndicate cases in West Zone.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-[#040914] flex items-center justify-between">
        <button
          onClick={() => alert(`Freeze request dispatched to RBI/I4C gateway for ${account.id}`)}
          className="px-3.5 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-red-900/40"
        >
          Dispatch Freeze Notice (1930)
        </button>
        <button
          onClick={() => setSelectedAccountId(null)}
          className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
