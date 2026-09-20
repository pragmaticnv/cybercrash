import React from 'react';
import { HistoricalCase } from '../../types/case';
import { History, Link2, GitFork, ShieldAlert, Layers } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

interface HistoricalLinksCardProps {
  cases: HistoricalCase[];
  similarCases?: any[]; // From result.historical_similarity.similar_cases
}

export const HistoricalLinksCard: React.FC<HistoricalLinksCardProps> = ({
  cases,
  similarCases
}) => {
  const { setSelectedHistoricalCase } = useInvestigationStore();

  const hasSimilarCases = Array.isArray(similarCases) && similarCases.length > 0;

  return (
    <div className="bg-[#071120] border border-white/[0.08] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {hasSimilarCases ? 'HISTORICAL SIMILAR CASES' : 'HISTORICAL CASE INTELLIGENCE'}
          </h3>
        </div>
        <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/25 font-bold">
          {hasSimilarCases ? `${similarCases.length} KNN MATCHES` : `${cases.length} PREVIOUS CASES FOUND`}
        </span>
      </div>

      {/* Note: Do not treat similarity_score as probability */}
      {hasSimilarCases && (
        <p className="text-[10.5px] text-slate-400 font-sans mb-3 leading-tight">
          Cases matched by cosine distance across 11 behavioral features. <span className="text-cyan-300 font-mono font-semibold">Similarity score reflects vector proximity in feature space, not fraud probability.</span>
        </p>
      )}

      {/* Dynamic Similar Cases returned from backend POST /new-case */}
      {hasSimilarCases ? (
        <div className="space-y-3">
          {similarCases.map((sc, idx) => {
            const scoreVal = Number(sc.similarity_score || 0).toFixed(1);
            const amtVal = Number(sc.reported_amount || 0).toLocaleString();
            const txAmtVal = Number(sc.case_tx_amount || 0).toLocaleString();
            const zones = Array.isArray(sc.actual_cashout_zones) ? sc.actual_cashout_zones.join(', ') : (sc.actual_cashout_zones || 'None');

            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#040914] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#071424] transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    {sc.case_id}
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    ₹{amtVal}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-sans">
                  <span>{sc.fraud_type}</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-bold">
                    Similarity: {scoreVal}
                  </span>
                </div>

                {/* Behavioral & Network Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-slate-500">Case Tx Count:</span> <strong className="text-slate-200">{sc.case_tx_count ?? 1}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Tx Amount:</span> <strong className="text-slate-200">₹{txAmtVal}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Network Degree:</span> <strong className="text-slate-200">{sc.network_degree ?? 0}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Network Risk:</span> <strong className="text-slate-200">{Number(sc.network_risk_score ?? 0).toFixed(3)}</strong>
                  </div>
                </div>

                {/* Observed Cashout Zones */}
                <div className="mt-2 text-[10px] font-mono bg-cyan-950/30 border border-cyan-500/20 px-2 py-1 rounded text-cyan-300 flex items-center gap-1.5">
                  <span className="text-slate-400">Observed Cashout:</span>
                  <strong className="text-white font-bold">{zones}</strong>
                </div>
              </div>
            );
          })}
        </div>
      ) : cases.length === 0 ? (
        <div className="p-4 rounded-lg bg-[#040914] text-center text-xs text-slate-400">
          No historical case links detected.
        </div>
      ) : (
        /* Standard Fallback Cases (CASE_007001 default) */
        <div className="space-y-2.5">
          {cases.map((hc) => (
            <div
              key={hc.caseId}
              onClick={() => setSelectedHistoricalCase(hc)}
              className="p-3 rounded-lg bg-[#040914] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#071424] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                  {hc.caseId}
                </span>
                <span className="font-mono text-xs font-bold text-white">{hc.amount}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>{hc.title}</span>
                <span className="text-[11px] font-mono text-slate-400">{hc.state}</span>
              </div>

              <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-1.5 border-t border-white/[0.04]">
                <span>Date: {hc.date}</span>
                <span className="text-emerald-400 font-bold">{hc.similarity}% pattern match</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
