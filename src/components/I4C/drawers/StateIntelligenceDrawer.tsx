import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ShieldAlert, Crosshair, Network, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { useI4CStore } from '../../../store/useI4CStore';
import { useNavigate } from 'react-router-dom';

export const StateIntelligenceDrawer: React.FC = () => {
  const { selectedState, activeDrawer, closeDrawer, openHotspotById, openNetworkById } = useI4CStore();
  const navigate = useNavigate();

  if (activeDrawer !== 'state' || !selectedState) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-[480px] bg-[#070F1E] border-l border-white/[0.12] shadow-2xl flex flex-col pointer-events-auto overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 bg-[#0A162B] border-b border-white/[0.1] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {selectedState.name} CYBERCRIME INTELLIGENCE
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                  STATE CODE: {selectedState.id} · REGIONAL SURVEILLANCE
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

          {/* Content Body */}
          <div className="p-5 space-y-5 flex-1">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#040A14] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE CASES</div>
                <div className="text-xl font-mono font-bold text-white mt-0.5">
                  {selectedState.activeCases.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#040A14] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">REPORTED AMOUNT</div>
                <div className="text-xl font-mono font-bold text-red-400 mt-0.5">
                  {selectedState.reportedAmount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#040A14] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">MULE ACCOUNTS</div>
                <div className="text-xl font-mono font-bold text-amber-300 mt-0.5">
                  {selectedState.muleAccounts}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#040A14] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE NETWORKS</div>
                <div className="text-xl font-mono font-bold text-purple-300 mt-0.5">
                  {selectedState.activeNetworks}
                </div>
              </div>
            </div>

            {/* Top Fraud Breakdown */}
            <div className="p-4 rounded-xl bg-[#040A14] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                TOP FRAUD MODUS OPERANDI
              </div>
              <div className="space-y-2.5">
                {selectedState.fraudBreakdown.map((f) => (
                  <div key={f.type}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white">{f.type}</span>
                      <span className="text-cyan-300 font-bold">{f.percent}% ({f.cases} cases)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-red-500 rounded-full"
                        style={{ width: `${f.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predicted Cash-Out Zones */}
            <div className="p-4 rounded-xl bg-[#040A14] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5" />
                  PREDICTED CASH-OUT ZONES
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedState.predictedZones.length} ACTIVE
                </span>
              </div>
              <div className="space-y-2">
                {selectedState.predictedZones.map((z) => (
                  <div
                    key={z.zoneId}
                    onClick={() => openHotspotById(z.zoneId)}
                    className="p-2.5 rounded-lg bg-[#071120] hover:bg-[#0C1A30] border border-red-500/20 hover:border-red-500/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-red-300 flex items-center gap-1.5">
                        <span>{z.zoneId}</span>
                        <span className="text-[10px] font-normal text-slate-400">({z.dominantFraud})</span>
                      </div>
                      <div className="text-[10.5px] font-mono text-amber-300 mt-0.5">
                        Window: {z.timeWindow}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
                      {z.confidence}% ML
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Cases & LEA Investigation Links */}
            <div className="p-4 rounded-xl bg-[#040A14] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>ASSOCIATED INVESTIGATION CASES</span>
                <span className="text-[10px] text-slate-400">LEA WORKSPACE READY</span>
              </div>
              <div className="space-y-1.5">
                {selectedState.associatedCaseIds.map((cId) => (
                  <div
                    key={cId}
                    onClick={() => navigate(`/investigation/${cId}`)}
                    className="px-3 py-2 rounded-lg bg-[#071120] hover:bg-cyan-950/40 border border-white/[0.06] hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">
                        {cId}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                        Active Lead
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 group-hover:underline flex items-center gap-1">
                      <span>Open LEA Case</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => openNetworkById('N-017')}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Network className="w-3.5 h-3.5" />
                <span>VIEW NETWORKS</span>
              </button>
              <button
                onClick={() => {
                  if (selectedState.associatedCaseIds[0]) {
                    navigate(`/investigation/${selectedState.associatedCaseIds[0]}`);
                  }
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>VIEW CASE CLUSTERS</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
