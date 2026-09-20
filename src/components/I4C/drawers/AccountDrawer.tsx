import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldAlert, ArrowRight, ExternalLink, Building, CreditCard } from 'lucide-react';
import { useI4CStore } from '../../../store/useI4CStore';
import { useNavigate } from 'react-router-dom';

export const AccountDrawer: React.FC = () => {
  const { selectedAccountId, activeDrawer, closeDrawer, openNetworkById } = useI4CStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'account' || !selectedAccountId) return null;

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
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {selectedAccountId}
                </h3>
                <span className="text-[10px] font-mono text-amber-400 tracking-wider">
                  SUSPECTED MULE NODE · BANK SURVEILLANCE
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
              <div className="text-[10px] font-mono text-slate-400 uppercase">MULE PROFILE</div>
              <div className="text-base font-mono font-bold text-white mt-1">Naveen Kumar (Mapped Mule)</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">Axis Bank · Panaji Commercial Branch</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500">INFLOW TOTAL</div>
                  <div className="font-bold text-cyan-300">₹1,00,250</div>
                </div>
                <div className="p-2 rounded bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500">FAN-OUT COUNT</div>
                  <div className="font-bold text-red-400">8 Outgoing Tx</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                ASSOCIATED SYNDICATE
              </div>
              <div
                onClick={() => openNetworkById('N-017')}
                className="p-2.5 rounded-lg bg-[#081220] hover:bg-[#0C1A30] border border-amber-500/30 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-amber-300">NETWORK N-017</div>
                  <div className="text-[11px] text-slate-400">Western Coastal Mule Funnel</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                PRIMARY INVESTIGATION CASE REF
              </div>
              <div className="p-2.5 rounded-lg bg-[#081220] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-300">CASE_007001</div>
                  <div className="text-[11px] text-slate-400">Investment Scam · Goa Cyber Crime Cell</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  NCRP LINKED
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
