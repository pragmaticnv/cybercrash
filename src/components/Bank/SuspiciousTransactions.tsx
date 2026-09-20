import React from 'react';
import { ArrowUpRight, ArrowDownLeft, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { BANK_TRANSACTIONS } from '../../data/bank/bankTransactions';
import { BankTransaction } from '../../types/bank';

export const SuspiciousTransactions: React.FC = () => {
  const { setSelectedTransaction, openDrawer } = useBankStore();
  const { activeCase, bankTransactions } = useActiveCaseStore();

  const combinedTransactions = React.useMemo(() => {
    const dynamicIds = new Set((bankTransactions || []).map((t) => t.transactionId));
    const all = [...(bankTransactions || []), ...BANK_TRANSACTIONS.filter((t) => !dynamicIds.has(t.transactionId))];

    // Priority Sort: Newly analyzed active case transactions MUST BE FIRST
    return all.sort((a, b) => {
      const aIsActive = activeCase && (
        a.caseId === activeCase.id ||
        a.sourceAccount === activeCase.primaryMule ||
        a.destinationAccount === activeCase.primaryMule
      ) ? 1 : 0;
      const bIsActive = activeCase && (
        b.caseId === activeCase.id ||
        b.sourceAccount === activeCase.primaryMule ||
        b.destinationAccount === activeCase.primaryMule
      ) ? 1 : 0;
      return bIsActive - aIsActive;
    });
  }, [bankTransactions, activeCase]);

  const handleTxClick = (tx: BankTransaction) => {
    setSelectedTransaction(tx);
    openDrawer('transaction');
  };

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              RECENT SUSPICIOUS TRANSACTIONS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              High-velocity fund relays intercepted by real-time rule engine
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Click row to inspect
        </span>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {combinedTransactions.map((tx) => {
          const isCredit = tx.transactionDirection === 'CREDIT';
          const isActiveCaseTx = tx.caseId === activeCase?.id ||
                                 tx.sourceAccount === activeCase?.primaryMule ||
                                 tx.destinationAccount === activeCase?.primaryMule;

          return (
            <div
              key={tx.transactionId}
              onClick={() => handleTxClick(tx)}
              className="p-2.5 rounded-lg bg-[#070F1E] hover:bg-[#0B172E] border border-white/[0.06] hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between group select-none"
            >
              {/* Left: Direction Icon + Tx Details */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                    isCredit ? 'bg-cyan-500/15 text-cyan-400' : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white group-hover:text-amber-300">
                      {tx.transactionId}
                    </span>
                    {isActiveCaseTx && (
                      <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40 animate-pulse">
                        DEMO CASE
                      </span>
                    )}
                    {tx.hop && (
                      <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-500/40">
                        HOP {tx.hop} {tx.hop === 1 ? '(PRIMARY INFLOW)' : tx.hop === 2 ? '(LAYER MULE)' : '(EXTRACTION)'}
                      </span>
                    )}
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300">
                      {tx.channel}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isCredit ? 'bg-cyan-500/20 text-cyan-300' : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {tx.transactionDirection}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    <span className="font-mono text-slate-300">{tx.sourceAccount}</span>
                    <span className="mx-1 text-slate-500">&rarr;</span>
                    <span className="font-mono text-slate-300">{tx.destinationAccount}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Timestamp */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-xs font-mono font-bold ${
                      isCredit ? 'text-cyan-300' : 'text-red-400'
                    }`}
                  >
                    {isCredit ? '+' : '-'}₹
                    {typeof tx.amount === 'number'
                      ? tx.amount.toLocaleString()
                      : Number(String(tx.amount || 0).replace(/[^0-9.-]+/g, '')).toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {tx.timestamp
                      ? tx.timestamp.includes('T')
                        ? tx.timestamp.split('T')[1]?.split('.')[0]
                        : tx.timestamp.split(' ')[1] || tx.timestamp
                      : '--'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
