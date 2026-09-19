import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crosshair, Clock, ShieldAlert, CheckCircle2, ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { useI4CStore } from '../../../store/useI4CStore';
import { useNavigate } from 'react-router-dom';

export const HotspotDrawer: React.FC = () => {
  const { selectedHotspot, activeDrawer, closeDrawer, openAccountDrawer } = useI4CStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'hotspot' || !selectedHotspot) return null;

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
          className="absolute top-0 right-0 bottom-0 w-full max-w-[480px] bg-[#070E1A] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#0B1424] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                <Crosshair className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  ZONE {selectedHotspot.zoneId} · EXTRACTION FORECAST
                </h3>
                <span className="text-[10px] font-mono text-red-400 tracking-wider">
                  ML CONFIDENCE: {selectedHotspot.modelConfidence}% · {selectedHotspot.city}
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
          <div className="p-5 space-y-5 flex-1">
            {/* Model Confidence & Window Card */}
            <div className="p-4 rounded-xl bg-[#120609] border border-red-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                  PREDICTED WITHDRAWAL WINDOW
                </span>
                <span className="text-xs font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                  {selectedHotspot.modelConfidence}% CONFIDENCE
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white flex items-center gap-2 mt-1">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{selectedHotspot.estimatedWindow}</span>
              </div>
              <div className="text-xs text-slate-300 font-sans mt-2">
                Dominant Modus: <span className="text-white font-semibold">{selectedHotspot.dominantFraudType}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-xl bg-[#040914] border border-white/[0.08]">
                <div className="text-[9.5px] text-slate-400 uppercase">LINKED CASES</div>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">
                  {selectedHotspot.associatedCasesCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#040914] border border-white/[0.08]">
                <div className="text-[9.5px] text-slate-400 uppercase">MULE ACCOUNTS</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5">
                  {selectedHotspot.associatedMuleAccountsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#040914] border border-white/[0.08]">
                <div className="text-[9.5px] text-slate-400 uppercase">HISTORIC CASH-OUTS</div>
                <div className="text-lg font-bold text-purple-300 mt-0.5">
                  {selectedHotspot.historicalCashOuts}
                </div>
              </div>
            </div>

            {/* Supporting Indicators */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                MODEL DERIVED RISK FACTORS
              </div>
              <div className="space-y-2">
                {selectedHotspot.supportingFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Mules */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
                ASSOCIATED TERMINAL MULE ACCOUNTS
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedHotspot.associatedMules.map((acc) => (
                  <button
                    key={acc}
                    onClick={() => openAccountDrawer(acc)}
                    className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold transition-colors"
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            {/* Associated Cases & Direct LEA Drilldown */}
            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>LINKED INVESTIGATION CASES</span>
                <span className="text-[10px] text-slate-400">ACTIVE DOSSIER</span>
              </div>
              <div className="space-y-1.5">
                {selectedHotspot.associatedCaseIds.map((cId) => (
                  <div
                    key={cId}
                    onClick={() => navigate(`/investigation/${cId}`)}
                    className="px-3 py-2 rounded-lg bg-[#071120] hover:bg-red-950/40 border border-white/[0.06] hover:border-red-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <span className="text-xs font-mono font-bold text-white group-hover:text-red-300">
                      {cId}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 group-hover:underline flex items-center gap-1">
                      <span>Launch LEA Case View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => {
                if (selectedHotspot.associatedCaseIds[0]) {
                  navigate(`/investigation/${selectedHotspot.associatedCaseIds[0]}`);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-[#9E0F18] hover:brightness-110 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all"
            >
              <span>DRILL INTO LEA CASE INVESTIGATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
