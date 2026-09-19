import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldAlert, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { useBankStore } from '../../../store/useBankStore';
import { useNavigate } from 'react-router-dom';

export const EscalationDrawer: React.FC = () => {
  const { selectedAccount, activeDrawer, closeDrawer, setAccountStatus } = useBankStore();
  const [isEscalated, setIsEscalated] = useState(false);
  const navigate = useNavigate();

  if (activeDrawer !== 'escalation' || !selectedAccount) return null;

  const handleConfirmEscalate = () => {
    setIsEscalated(true);
    setAccountStatus(selectedAccount.accountId, 'ESCALATED TO I4C');
  };

  const handleClose = () => {
    setIsEscalated(false);
    closeDrawer();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Backdrop */}
        <div
          onClick={handleClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto"
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
              <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  ESCALATE INTELLIGENCE TO I4C
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                  INTER-AGENCY FRAUD COORDINATION BRIDGE
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 flex-1">
            {!isEscalated ? (
              <>
                <div className="p-4 rounded-xl bg-[#120609] border border-red-500/30">
                  <div className="text-[10px] font-mono text-red-400 uppercase font-bold mb-1">
                    NATIONAL INTELLIGENCE ESCALATION
                  </div>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Escalating this account forwards the multi-tier transaction dispersion graph and KYC discrepancies to the Indian Cyber Crime Coordination Centre (I4C) national database.
                  </div>
                </div>

                {/* Account Details Review */}
                <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08] space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account ID:</span>
                    <span className="text-white font-bold">{selectedAccount.accountId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Holder:</span>
                    <span className="text-white">{selectedAccount.holderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Entity:</span>
                    <span className="text-amber-400">{selectedAccount.bankId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escalation Reason:</span>
                    <span className="text-red-300 font-semibold text-right">Suspicious outbound fan-out pattern</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Centrality:</span>
                    <span className="text-purple-300 font-bold">{selectedAccount.networkDegree} Connected Accounts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Previous Bank Alerts:</span>
                    <span className="text-amber-300 font-bold">{selectedAccount.previousAlertCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Linked Case Dossier:</span>
                    <span className="text-cyan-300 font-bold">{selectedAccount.linkedCaseId || 'None'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <button
                    onClick={handleClose}
                    className="py-2.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-mono font-semibold text-slate-300 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleConfirmEscalate}
                    className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:brightness-110 text-xs font-mono font-bold text-white shadow-lg transition-all"
                  >
                    CONFIRM &amp; ESCALATE
                  </button>
                </div>
              </>
            ) : (
              /* Post-Escalation State */
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-mono">
                    ESCALATION QUEUED FOR I4C
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Dossier for {selectedAccount.accountId} transmitted to I4C National Command Center.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#040914] border border-white/[0.08] text-xs font-mono text-cyan-300">
                  Status: ESCALATED TO I4C · TRANSMISSION TOKEN #ESC-8921
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/i4c');
                    }}
                    className="py-2.5 px-4 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>VIEW IN I4C NATIONAL COMMAND CENTER</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="py-2 px-3 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
