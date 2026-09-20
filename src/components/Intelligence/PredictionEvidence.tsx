import React from 'react';
import { PredictionEvidence as EvidenceType } from '../../types/prediction';
import { HelpCircle, SlidersHorizontal, ArrowUpRight, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

interface PredictionEvidenceProps {
  evidence: EvidenceType[];
  modelReasoning?: {
    positive_signals?: any[];
    negative_signals?: any[];
  };
}

export const PredictionEvidence: React.FC<PredictionEvidenceProps> = ({
  evidence,
  modelReasoning
}) => {
  const { toggleTechnicalDrawer } = useInvestigationStore();

  const hasShapReasoning =
    modelReasoning &&
    (Array.isArray(modelReasoning.positive_signals) || Array.isArray(modelReasoning.negative_signals));

  const positiveSignals = modelReasoning?.positive_signals || [];
  const negativeSignals = modelReasoning?.negative_signals || [];

  return (
    <div className="bg-[#071120] border border-white/[0.08] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {hasShapReasoning ? 'MODEL REASONING & FEATURE ATTRIBUTION' : 'WHY THIS LOCATION?'}
          </h3>
        </div>
        <button
          onClick={toggleTechnicalDrawer}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Technical details</span>
        </button>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed font-sans">
        {hasShapReasoning
          ? 'Model signals contributing to this prediction (SHAP TreeExplainer attribution):'
          : 'Model-derived supporting factors indicating high-confidence cash extraction:'}
      </p>

      {/* When real SHAP model reasoning is returned from POST /new-case */}
      {hasShapReasoning ? (
        <div className="space-y-3.5">
          {/* 1. Positive Signals */}
          <div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-rose-400 uppercase tracking-wider mb-2">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>POSITIVE CONTRIBUTING SIGNALS ({positiveSignals.length})</span>
            </div>

            {positiveSignals.length === 0 ? (
              <div className="p-2 rounded bg-[#040914] text-[11px] text-slate-500 font-mono">
                No dominant positive attribution factors.
              </div>
            ) : (
              <div className="space-y-2">
                {positiveSignals.map((sig, idx) => {
                  const contrib = Number(sig.contribution || 0);
                  const pct = Math.min(100, Math.round(Math.abs(contrib) * 100));

                  return (
                    <div key={idx} className="bg-[#040914] p-2.5 rounded-lg border border-red-500/15">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="text-slate-200 font-medium text-[11.5px]">{sig.feature}</span>
                        <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                          +{contrib.toFixed(3)}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                          style={{ width: `${Math.max(15, pct)}%` }}
                        />
                      </div>

                      <div className="mt-1 text-[10px] font-mono text-slate-400">
                        Signal elevates predicted risk for this cash-out extraction corridor.
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Negative Signals */}
          {negativeSignals.length > 0 && (
            <div className="pt-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>NEGATIVE ATTENUATING SIGNALS ({negativeSignals.length})</span>
              </div>

              <div className="space-y-2">
                {negativeSignals.map((sig, idx) => {
                  const contrib = Number(sig.contribution || 0);
                  const pct = Math.min(100, Math.round(Math.abs(contrib) * 100));

                  return (
                    <div key={idx} className="bg-[#040914] p-2.5 rounded-lg border border-cyan-500/15">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="text-slate-200 font-medium text-[11.5px]">{sig.feature}</span>
                        <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {contrib.toFixed(3)}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                          style={{ width: `${Math.max(15, pct)}%` }}
                        />
                      </div>

                      <div className="mt-1 text-[10px] font-mono text-slate-400">
                        Signal moderates predicted risk score.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Standard Fallback Factors (CASE_007001 default) */
        <div className="space-y-2.5">
          {evidence.map((item, idx) => {
            const isHigh = item.level === 'HIGH';
            return (
              <div key={idx} className="bg-[#040914] p-2.5 rounded-lg border border-white/[0.04]">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-slate-200 font-medium text-[11.5px]">{item.factor}</span>
                  <span
                    className={`font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded ${
                      isHigh
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.level} {item.metric ? `(${item.metric})` : ''}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <div className="mt-1 text-[10.5px] text-slate-400 leading-tight">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
