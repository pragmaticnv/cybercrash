import React, { useState } from 'react';
import { Sparkles, X, Play, Target, Clock, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { apiFetch } from '../../api/apiClient';

interface LivePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaseId?: string;
  onApplyPrediction?: (prediction: any) => void;
}

export const LivePredictionModal: React.FC<LivePredictionModalProps> = ({
  isOpen,
  onClose,
  defaultCaseId = 'CASE_007001',
  onApplyPrediction
}) => {
  const [caseId, setCaseId] = useState(defaultCaseId);
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunInference = async () => {
    if (!caseId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<any>(`/cases/${encodeURIComponent(caseId.trim())}/prediction?top_k=${topK}`);
      setResult(data);
      if (onApplyPrediction) {
        onApplyPrediction(data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to execute inference on backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#070F1E] border border-cyan-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A162B] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide uppercase font-sans flex items-center gap-2">
                LIVE ML PREDICTION ENGINE
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                Spatial-Temporal XGBoost v2 · Real-Time Inference
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                TARGET CASE ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="e.g. CASE_007001"
                  className="w-full bg-[#040914] border border-white/[0.12] rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setCaseId('CASE_007001')}
                  className="text-[10px] font-mono px-2 py-2 rounded bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white shrink-0"
                >
                  CASE 7001
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                TOP-K HOTSPOTS
              </label>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full bg-[#040914] border border-white/[0.12] rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value={3}>Top 3</option>
                <option value={5}>Top 5 (Recommended)</option>
                <option value={10}>Top 10</option>
              </select>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleRunInference}
            disabled={loading || !caseId.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 font-sans font-bold text-sm tracking-wider uppercase text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>EVALUATING 17 SHAP FEATURES & GEOLOCATION...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>EXECUTE LIVE ML PREDICTION</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Live Inference Results */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-white/[0.08] animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold uppercase">
                  INFERENCE RESULTS · {result.caseId}
                </span>
                <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                  LATENCY: {result.modelMetadata?.inferenceLatencyMs || 14}ms
                </span>
              </div>

              {/* Top Hotspot Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    PREDICTED EXTRACTION ZONE
                  </span>
                  <span className="text-xl font-bold font-mono text-white">
                    {result.predictedZone}
                  </span>
                  <span className="text-xs text-cyan-300 block font-sans">
                    {result.clusterName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    CONFIDENCE SCORE
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-400">
                    {result.confidencePercent}
                  </span>
                </div>
              </div>

              {/* Candidate ATMs */}
              <div>
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>IDENTIFIED ATM CANDIDATES ({result.atms?.length || 0})</span>
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {result.atms?.map((atm: any, i: number) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-semibold text-white">{atm.name}</span>
                        <span className="text-slate-400 block text-[10px]">{atm.bank} · {atm.address}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        atm.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {atm.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
