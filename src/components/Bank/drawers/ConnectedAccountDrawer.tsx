import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, ArrowRight, ExternalLink, ShieldAlert, Layers, Building } from 'lucide-react';
import { useBankStore } from '../../../store/useBankStore';
import { BANK_ACCOUNTS } from '../../../data/bank/bankAccounts';
import { useNavigate } from 'react-router-dom';

export const ConnectedAccountDrawer: React.FC = () => {
  const {
    selectedConnectedAccountId,
    activeDrawer,
    closeDrawer,
    networkDepth,
    setNetworkDepth,
    setSelectedAccountId
  } = useBankStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'connected_account' || !selectedConnectedAccountId) return null;

  const connectedAccount = BANK_ACCOUNTS.find((a) => a.accountId === selectedConnectedAccountId) || {
    accountId: selectedConnectedAccountId,
    holderName: 'Connected Beneficiary',
    bankName: 'Inter-Bank Recipient',
    accountType: 'Savings' as const,
    networkRiskScore: 0.65,
    primaryFlag: 'Downstream Mule Relay',
    bankId: 'BANK05',
    accountAgeDays: 310,
    outgoingAmountTotal: 60000,
    incomingAmountTotal: 64000
  };

  const handleExpand = () => {
    if (networkDepth < 3) {
      setNetworkDepth(networkDepth + 1);
    }
    closeDrawer();
  };

  const handleFullInvestigation = () => {
    setSelectedAccountId(connectedAccount.accountId);
    closeDrawer();
    navigate(`/bank/account/${connectedAccount.accountId}`);
  };

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
          className="absolute top-0 right-0 bottom-0 w-full max-w-[440px] bg-[#070E1A] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#0B1424] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  CONNECTED ACCOUNT DOSSIER
                </h3>
                <span className="text-[10px] font-mono text-amber-400 tracking-wider">
                  {connectedAccount.accountId} · INTER-BANK NODE
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
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white">{connectedAccount.accountId}</span>
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
                  Risk Score: {connectedAccount.networkRiskScore.toFixed(3)}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200">{connectedAccount.holderName}</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">{connectedAccount.bankName}</div>
              <div className="text-[10.5px] font-mono text-amber-300 mt-2">
                Classification: {connectedAccount.primaryFlag}
              </div>
            </div>

            {/* Relationship Info */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08] space-y-2 text-xs font-mono">
              <div className="text-slate-400 uppercase text-[10px]">RELATIONSHIP CONTEXT</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Relationship:</span>
                <span className="text-white font-bold">Direct Downstream Receiver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channels:</span>
                <span className="text-cyan-300 font-bold">IMPS, UPI, WALLET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Depth:</span>
                <span className="text-amber-300 font-bold">Level {networkDepth} in Graph</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleExpand}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>EXPAND NETWORK (REVEAL NEXT TIER)</span>
              </button>

              <button
                onClick={handleFullInvestigation}
                className="w-full py-2.5 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>OPEN FULL ACCOUNT INVESTIGATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
