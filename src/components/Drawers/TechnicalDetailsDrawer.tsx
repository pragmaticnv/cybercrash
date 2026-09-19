import React from 'react';
import { X, Cpu, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

export const TechnicalDetailsDrawer: React.FC = () => {
  const { technicalDrawerOpen, setTechnicalDrawerOpen } = useInvestigationStore();

  if (!technicalDrawerOpen) return null;

  const shapValues = [
    { feature: 'historical_cashout_density_60d', shap: '+0.342', weight: 88, desc: 'Correlated cash extraction events in North Goa corridor' },
    { feature: 'atm_cluster_proximity_index', shap: '+0.285', weight: 76, desc: 'High ATM count within 1.2km radius of candidate exit node' },
    { feature: 'temporal_cadence_window_match', shap: '+0.198', weight: 64, desc: 'Historical syndicate withdrawal timing peaking 18:00 - 21:00' },
    { feature: 'device_tower_imei_proximity', shap: '+0.114', weight: 48, desc: 'Candidate device tower ping in Calangute sector at 21:40' },
    { feature: 'network_rapid_relay_ratio', shap: '+0.089', weight: 35, desc: 'Outbound velocity to secondary mules < 5 minutes' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[#071120] border-l border-white/[0.12] shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200 font-sans">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#040914]">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              MODEL INFERENCE & FEATURE WEIGHTS
            </h2>
            <span className="text-[11px] font-mono text-cyan-300">XGBoost-SpatialTemporal-v4.2.1</span>
          </div>
        </div>
        <button
          onClick={() => setTechnicalDrawerOpen(false)}
          className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
        {/* Model Metrics */}
        <div className="grid grid-cols-2 gap-2.5 font-mono">
          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase block">Inference Latency</span>
            <span className="text-emerald-400 font-bold text-sm">142 ms</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#040914] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase block">Features Evaluated</span>
            <span className="text-cyan-400 font-bold text-sm">48 Variables</span>
          </div>
        </div>

        {/* SHAP Feature Contribution */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block">
            SHAP LOCAL FEATURE CONTRIBUTIONS
          </span>

          <div className="space-y-2.5">
            {shapValues.map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#040914] border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1 font-mono">
                  <span className="text-cyan-300 font-bold text-[11px]">{f.feature}</span>
                  <span className="text-emerald-400 font-extrabold">{f.shap}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${f.weight}%` }} />
                </div>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-[#040914] flex justify-end">
        <button
          onClick={() => setTechnicalDrawerOpen(false)}
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-mono text-xs"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
