import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Flag, PauseCircle, Send, ExternalLink, FileEdit, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { BankAccount } from '../../types/bank';
import { useBankStore } from '../../store/useBankStore';

interface AccountProfileProps {
  account: BankAccount;
}

export const AccountProfile: React.FC<AccountProfileProps> = ({ account }) => {
  const navigate = useNavigate();
  const { accountActionStatus, setAccountStatus, freezeAccount, openDrawer } = useBankStore();

  const currentStatus = accountActionStatus[account.accountId] || account.accountStatus;

  const handleFlag = () => {
    setAccountStatus(account.accountId, 'FLAGGED FOR REVIEW');
  };

  const handleHold = () => {
    setAccountStatus(account.accountId, 'REVIEW HOLD ACTIVE');
  };

  const handleFreeze = () => {
    freezeAccount(account.accountId, 'Direct ML Mule Correlation & Excessive Transfer Velocity');
  };

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Account Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            ACC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-mono font-bold text-white tracking-wider">
                {account.accountId}
              </h1>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  currentStatus.includes('ESCALATED')
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : currentStatus.includes('HOLD')
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {currentStatus}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-sans mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">{account.holderName}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-mono font-semibold">{account.bankId}</span>
              <span className="text-slate-500">·</span>
              <span>{account.accountType}</span>
              <span className="text-slate-500">·</span>
              <span>{account.branchName}</span>
            </div>
          </div>
        </div>

        {/* Compact Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] sm:pl-4 sm:border-l sm:border-white/[0.08]">
          <div className="px-2.5 py-1 rounded bg-[#060D1A] border border-white/[0.06]">
            <span className="text-slate-400">AGE: </span>
            <span className="text-white font-bold">{account.accountAgeDays ?? 45} DAYS</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#060D1A] border border-white/[0.06]">
            <span className="text-slate-400">PREVIOUS ALERTS: </span>
            <span className="text-amber-300 font-bold">{account.previousAlertCount ?? 0}</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#060D1A] border border-white/[0.06]">
            <span className="text-slate-400">NETWORK RISK: </span>
            <span className="text-red-400 font-bold">{(account.networkRiskScore ?? 0.85).toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Operational Action Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFreeze}
          disabled={currentStatus.includes('FROZEN')}
          title="Place Emergency Compliance Freeze under I4C SOP"
          className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
            currentStatus.includes('FROZEN')
              ? 'bg-red-950/80 border border-red-500/50 text-red-300 opacity-90 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border border-red-500 text-white animate-pulse'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-white" />
          <span>{currentStatus.includes('FROZEN') ? 'LIEN PLACED (FROZEN)' : 'FREEZE ACCOUNT'}</span>
        </button>

        <button
          onClick={handleFlag}
          title="Flag Account for Compliance Review"
          className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <span>FLAG ACCOUNT</span>
        </button>

        <button
          onClick={handleHold}
          title="Place Account on Review Hold"
          className="py-1.5 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-mono font-semibold text-amber-300 flex items-center gap-1.5 transition-colors"
        >
          <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>HOLD FOR REVIEW</span>
        </button>

        <button
          onClick={() => openDrawer('escalation')}
          title="Escalate intelligence to I4C National Command"
          className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-red-600/40 to-purple-600/40 hover:brightness-125 border border-red-500/40 text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5 text-red-400" />
          <span>ESCALATE TO I4C</span>
        </button>

        <button
          onClick={() => openDrawer('note')}
          title="Add internal fraud note"
          className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-slate-300 hover:text-white transition-colors"
        >
          <FileEdit className="w-3.5 h-3.5" />
        </button>

        {account.linkedCaseId && (
          <div className="py-1.5 px-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
            <span className="text-slate-400 text-[10.5px]">LINKED LEA INCIDENT:</span>
            <span>{account.linkedCaseId}</span>
          </div>
        )}
      </div>
    </div>
  );
};
