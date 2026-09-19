import React from 'react';
import { PredictionEvidence as EvidenceType } from '../../types/prediction';
import { HelpCircle, ChevronRight, SlidersHorizontal, Info } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

interface PredictionEvidenceProps {
  evidence: EvidenceType[];
}

export const PredictionEvidence: React.FC<PredictionEvidenceProps> = ({ evidence }) => {
  const { toggleTechnicalDrawer } = useInvestigationStore();

  return (
    <div className="bg-[#071120] border border-white/[0.08] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            WHY THIS LOCATION?
          </h3>
        </div>
        <button
          onClick={toggleTechnicalDrawer}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Technical details</span>
        </button>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
        Model-derived supporting factors indicating high-confidence cash extraction:
      </p>

      {/* Evidence Factor Bars */}
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

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isHigh
                      ? 'bg-gradient-to-r from-red-500 to-rose-400'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
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
    </div>
  );
};
