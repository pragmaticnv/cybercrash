import React, { useState } from 'react';
import { Prediction } from '../../types/prediction';
import { Target, Clock, Sparkles, AlertCircle, Building2, MapPin, Gauge } from 'lucide-react';
import { LivePredictionModal } from './LivePredictionModal';

interface PredictionCardProps {
  prediction: Prediction;
  hotspots?: any[]; // Dynamic hotspots from result.hotspots
  selectedHotspotIndex?: number;
  onSelectHotspotIndex?: (index: number) => void;
  onPredictionChange?: (newPrediction: Prediction) => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction: initialPrediction,
  hotspots,
  selectedHotspotIndex = 0,
  onSelectHotspotIndex,
  onPredictionChange
}) => {
  const [prediction, setPrediction] = useState<Prediction>(initialPrediction);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    setPrediction(initialPrediction);
  }, [initialPrediction]);

  const hasDynamicHotspots = Array.isArray(hotspots) && hotspots.length > 0;
  const activeHotspot = hasDynamicHotspots ? hotspots[selectedHotspotIndex] || hotspots[0] : null;

  const currentZone = activeHotspot ? activeHotspot.zone_id : prediction.predictedZone;
  const currentZoneName = activeHotspot
    ? `${activeHotspot.zone_name} (${activeHotspot.state_code})`
    : (prediction.clusterName || 'Identified Corridor');
  const currentConfidence = activeHotspot
    ? `${(Number(activeHotspot.risk_score || 0) * 100).toFixed(1)}%`
    : prediction.confidencePercent;
  const currentAtms = activeHotspot
    ? (activeHotspot.nearest_atms || activeHotspot.atm_candidates || [])
    : prediction.atms;

  return (
    <div className="bg-gradient-to-b from-[#0A182E] to-[#071120] border border-cyan-500/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
      {/* Tactical Glow Effect */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
            AI CASH-OUT PREDICTION
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
            XGBoost v2
          </span>
        </div>
      </div>

      {/* Hotspots Switcher Tabs (If multiple hotspots returned from POST /new-case) */}
      {hasDynamicHotspots && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>TOP PREDICTED HOTSPOTS ({hotspots.length})</span>
            <span className="text-cyan-400">SELECT TO INSPECT</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 bg-[#040A14] p-1 rounded-lg border border-white/[0.06]">
            {hotspots.slice(0, 5).map((h, i) => {
              const isSelected = i === selectedHotspotIndex;
              const pct = (Number(h.risk_score || 0) * 100).toFixed(1);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectHotspotIndex && onSelectHotspotIndex(i)}
                  className={`py-1 px-1 rounded text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 font-bold shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                      : 'bg-white/[0.02] border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="block text-[9px] font-mono text-slate-400">#{h.rank || i + 1}</span>
                  <span className="block text-[10.5px] font-mono font-bold truncate">{h.zone_id}</span>
                  <span className="block text-[9.5px] font-mono text-emerald-400 font-semibold">{pct}%</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary Highlight Block */}
      <div className="flex items-center justify-between bg-[#030914] p-3.5 rounded-lg border border-cyan-500/20 mb-3">
        <div>
          <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">
            Predicted Extraction Zone
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-display font-extrabold text-white tracking-wider">
              {currentZone}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              ({currentZoneName})
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">
            Model Confidence
          </span>
          <span className="text-2xl font-mono font-extrabold text-red-400">
            {currentConfidence}
          </span>
        </div>
      </div>

      {/* Dynamic Hotspot Metrics Grid (from backend POST /new-case) */}
      {activeHotspot && (
        <div className="grid grid-cols-3 gap-2 mb-3 bg-[#030914] p-2.5 rounded-lg border border-white/[0.06] text-[10.5px] font-mono">
          <div>
            <span className="text-slate-500 block uppercase text-[9px]">Distance</span>
            <span className="text-white font-bold">{activeHotspot.distance_km ?? 0} km</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px]">ATM Density</span>
            <span className="text-cyan-300 font-bold">{activeHotspot.atm_density ?? 0}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px]">Location Risk</span>
            <span className="text-amber-400 font-bold">{Number(activeHotspot.location_risk ?? 0).toFixed(3)}</span>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04]">
            <span className="text-slate-500 block uppercase text-[9px]">Hist. Cashouts</span>
            <span className="text-slate-300 font-bold">{activeHotspot.historical_cashout_count ?? 0}</span>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04]">
            <span className="text-slate-500 block uppercase text-[9px]">Recent 24h</span>
            <span className="text-slate-300 font-bold">{activeHotspot.recent_cashout_24h ?? 0}</span>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04]">
            <span className="text-slate-500 block uppercase text-[9px]">Nearest ATMs</span>
            <span className="text-emerald-400 font-bold">{currentAtms.length}</span>
          </div>
        </div>
      )}

      {/* Estimated Withdrawal Window */}
      <div className="bg-[#030914] p-3 rounded-lg border border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-slate-400 uppercase block">
              Estimated Withdrawal Window
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {prediction.timeWindow || '18:00 – 21:00'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Likelihood</span>
          <span className="font-mono text-xs font-bold text-amber-400">PEAK SYNDICATE</span>
        </div>
      </div>

      {/* Forensic Disclaimer */}
      <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-400 leading-tight font-sans">
        <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
        <span>Generated by XGBoost geospatial model evaluating temporal cadence and ATM topology. Not legal certainty.</span>
      </div>
    </div>
  );
};
