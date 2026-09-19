import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cFraudPatterns } from '../../data/i4cMockData';
import { I4CFraudPattern } from '../../types/i4c';

export const EmergingPatterns: React.FC = () => {
  const { selectedFraudType, setSelectedFraudType } = useI4CStore();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              EMERGING FRAUD PATTERNS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Algorithmic pattern detection across multi-state jurisdiction clusters
            </div>
          </div>
        </div>
        {selectedFraudType && (
          <button
            onClick={() => setSelectedFraudType(null)}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 transition-colors"
          >
            Clear Filter ({selectedFraudType}) ✕
          </button>
        )}
      </div>

      {/* Grid of Ranked Emerging Patterns with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {i4cFraudPatterns.map((pat) => {
          const isSelected = selectedFraudType === pat.fraudType;

          return (
            <div
              key={pat.id}
              onClick={() => setSelectedFraudType(pat.fraudType)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#0E223D] border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'bg-[#060D1A] border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#091526]'
              }`}
            >
              {/* Top Row: Name & Growth badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white leading-tight">{pat.fraudType}</span>
                  <span className="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
                    +{pat.growthPercent}%
                  </span>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <div>
                    <div className="text-[9.5px] text-slate-400 uppercase">VOLUME</div>
                    <div className="text-sm font-bold text-white">{pat.currentVolume.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9.5px] text-slate-400 uppercase">EXPOSURE</div>
                    <div className="text-xs font-semibold text-red-400">{pat.reportedAmount}</div>
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="h-12 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pat.sparklineData}>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0A1220] border border-white/20 p-1 rounded text-[9.5px] font-mono text-cyan-300">
                              {payload[0].value} cases
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isSelected ? '#38BDF8' : '#EF4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom metadata */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{pat.affectedStatesCount} States</span>
                <span className="text-cyan-400">{pat.emergingHotspotsCount} Hotspots</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
