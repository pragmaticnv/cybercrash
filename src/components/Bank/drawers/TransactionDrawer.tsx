import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ArrowRight, ExternalLink, ShieldAlert, CheckCircle2, Building } from 'lucide-react';
import { useBankStore } from '../../../store/useBankStore';
import { useNavigate } from 'react-router-dom';

export const TransactionDrawer: React.FC = () => {
  const { selectedTransaction, activeDrawer, closeDrawer, setSelectedAccountId } = useBankStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'transaction' || !selectedTransaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-[460px] bg-[#070E1A] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#0B1424] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  TRANSACTION INTELLIGENCE
                </h3>
                <span className="text-[10px] font-mono text-amber-400 tracking-wider">
                  {selectedTransaction.transactionId} · {selectedTransaction.channel}
                </span>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 flex-1">
            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">TRANSACTION AMOUNT</div>
                <div className="text-2xl font-mono font-bold text-white mt-0.5">
                  ₹{selectedTransaction.amount.toLocaleString()}
                </div>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  selectedTransaction.transactionDirection === 'CREDIT'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
              >
                {selectedTransaction.transactionDirection}
              </span>
            </div>

            {/* Source & Destination */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08] space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">ORIGINATING ACCOUNT</span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">{selectedTransaction.sourceAccount}</div>
                    <div className="text-[11px] text-slate-400">{selectedTransaction.sourceBank || 'Originating Node'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAccountId(selectedTransaction.sourceAccount);
                      closeDrawer();
                      navigate(`/bank/account/${selectedTransaction.sourceAccount}`);
                    }}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Inspect &rarr;
                  </button>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">BENEFICIARY ACCOUNT</span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">{selectedTransaction.destinationAccount}</div>
                    <div className="text-[11px] text-slate-400">{selectedTransaction.destinationBank || 'Recipient Node'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAccountId(selectedTransaction.destinationAccount);
                      closeDrawer();
                      navigate(`/bank/account/${selectedTransaction.destinationAccount}`);
                    }}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Inspect &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.08]">
                <span className="text-[9.5px] text-slate-400 uppercase block">PAYMENT RAIL</span>
                <span className="font-bold text-white mt-0.5 block">{selectedTransaction.channel}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.08]">
                <span className="text-[9.5px] text-slate-400 uppercase block">INTERCEPT TIME</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{selectedTransaction.timestamp}</span>
              </div>
            </div>

            {/* Risk Context */}
            {selectedTransaction.riskLabel && (
              <div className="p-3.5 rounded-xl bg-[#120609] border border-red-500/30">
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                  BEHAVIOURAL INTERCEPT SIGNAL
                </span>
                <div className="text-xs text-slate-200 font-sans leading-relaxed">
                  {selectedTransaction.riskLabel}
                </div>
              </div>
            )}

            {/* Linked Case Button */}
            {selectedTransaction.caseId && (
              <button
                onClick={() => navigate(`/investigation/${selectedTransaction.caseId}`)}
                className="w-full py-2.5 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>OPEN LINKED LEA INVESTIGATION ({selectedTransaction.caseId})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
