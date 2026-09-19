import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Zap, ArrowRight, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { useI4CStore } from '../../../store/useI4CStore';
import { useNavigate } from 'react-router-dom';

export const IntelligenceDrawer: React.FC = () => {
  const {
    selectedIntelligenceAlert,
    activeDrawer,
    closeDrawer,
    openHotspotById,
    openNetworkById,
    setSelectedFraudType
  } = useI4CStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'alert' || !selectedIntelligenceAlert) return null;

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
              <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  INTELLIGENCE SIGNAL
                </h3>
                <span className="text-[10px] font-mono text-red-400 tracking-wider">
                  {selectedIntelligenceAlert.category} · {selectedIntelligenceAlert.timestamp}
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
            <div className="p-4 rounded-xl bg-[#120609] border border-red-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-red-400">
                  SEVERITY: {selectedIntelligenceAlert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedIntelligenceAlert.timestamp}
                </span>
              </div>
              <h4 className="text-base font-bold text-white leading-snug">
                {selectedIntelligenceAlert.title}
              </h4>
              <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                {selectedIntelligenceAlert.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#040914] border border-white/[0.08]">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">TARGET IDENTIFIER</div>
              <div className="text-sm font-mono font-bold text-cyan-300">
                {selectedIntelligenceAlert.targetId} ({selectedIntelligenceAlert.targetType.toUpperCase()})
              </div>
            </div>

            {/* Contextual Drilldown */}
            {selectedIntelligenceAlert.targetType === 'hotspot' && (
              <button
                onClick={() => openHotspotById(selectedIntelligenceAlert.targetId)}
                className="w-full py-2.5 px-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>OPEN HOTSPOT INTELLIGENCE DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {selectedIntelligenceAlert.targetType === 'network' && (
              <button
                onClick={() => openNetworkById(selectedIntelligenceAlert.targetId)}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>EXPLORE MULTI-STATE NETWORK TOPOLOGY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {selectedIntelligenceAlert.targetType === 'fraud' && (
              <button
                onClick={() => {
                  setSelectedFraudType(selectedIntelligenceAlert.targetId);
                  closeDrawer();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>FILTER NATIONAL INTELLIGENCE BY MODUS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
