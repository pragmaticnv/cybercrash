import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowUpRight, ShieldAlert, CreditCard, Building } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { BANK_ACCOUNTS } from '../../data/bank/bankAccounts';
import { BankAccount } from '../../types/bank';

export const HighRiskAccountsList: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedAccountId } = useBankStore();
  const { activeCase, bankAccounts } = useActiveCaseStore();

  const combinedAccounts = React.useMemo(() => {
    const dynamicIds = new Set((bankAccounts || []).map((a) => a.accountId));
    return [...(bankAccounts || []), ...BANK_ACCOUNTS.filter((a) => !dynamicIds.has(a.accountId))];
  }, [bankAccounts]);

  const handleAccountClick = (accId: string) => {
    setSelectedAccountId(accId);
    navigate(`/bank/account/${accId}`);
  };

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              HIGH-RISK ACCOUNTS UNDER SURVEILLANCE
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Accounts flagged for anomalous transaction velocity and cross-bank fan-out
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          BANK05 INTERNAL RISK REGISTER ({combinedAccounts.length} ACCOUNTS)
        </span>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {combinedAccounts.map((acc) => {
          const isExtreme = acc.networkRiskScore > 0.7;
          const isActiveMule = acc.accountId === activeCase?.primaryMule;

          return (
            <div
              key={acc.accountId}
              onClick={() => handleAccountClick(acc.accountId)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between select-none ${
                isActiveMule
                  ? 'border-red-500/80 bg-[#160608] ring-1 ring-red-500/40 hover:bg-[#1f090c]'
                  : 'bg-[#070F1E] border-white/[0.06] hover:border-amber-500/50 hover:bg-[#0A162B]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white group-hover:text-amber-300">
                      {acc.accountId}
                    </span>
                    {isActiveMule && (
                      <span className="text-[8px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/40">
                        DEMO MULE
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isExtreme
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    RISK {acc.networkRiskScore.toFixed(3)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">{acc.holderName}</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5 truncate">{acc.bankName}</div>
                <div className="text-[10px] font-mono text-cyan-300 mt-1">{acc.primaryFlag}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10.5px]">
                <div>
                  <span className="text-slate-500">Out: </span>
                  <span className="text-red-400 font-bold">₹{acc.outgoingAmountTotal.toLocaleString()}</span>
                </div>
                <div className="text-amber-400 group-hover:underline flex items-center gap-0.5">
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
