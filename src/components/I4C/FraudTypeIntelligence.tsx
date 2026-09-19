import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ShieldCheck, Filter } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cFraudTypes } from '../../data/i4cMockData';

export const FraudTypeIntelligence: React.FC = () => {
  const { selectedFraudType, setSelectedFraudType } = useI4CStore();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              FRAUD-TYPE DISTRIBUTION
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Click a fraud category to filter national intelligence &amp; map
            </div>
          </div>
        </div>
        {selectedFraudType && (
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
            ACTIVE: {selectedFraudType}
          </span>
        )}
      </div>

      {/* Horizontal Bar Chart using Recharts */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={i4cFraudTypes}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length) {
                const fraudType = state.activePayload[0].payload.type;
                setSelectedFraudType(fraudType);
              }
            }}
          >
            <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(val) => `${val}`} />
            <YAxis
              type="category"
              dataKey="type"
              stroke="#CBD5E1"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#091322] border border-white/20 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                      <div className="font-bold text-white mb-1">{data.type}</div>
                      <div className="text-slate-300">Cases: <span className="text-cyan-300">{data.cases.toLocaleString()}</span></div>
                      <div className="text-slate-300">Exposure: <span className="text-red-400">{data.reportedAmount}</span></div>
                      <div className="text-slate-300">States: <span className="text-amber-300">{data.statesAffected} affected</span></div>
                      <div className="text-slate-300">Growth: <span className="text-emerald-400">{data.trend}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="cases" radius={[0, 4, 4, 0]} cursor="pointer">
              {i4cFraudTypes.map((entry) => (
                <Cell
                  key={`cell-${entry.type}`}
                  fill={selectedFraudType === entry.type ? '#38BDF8' : entry.color}
                  opacity={selectedFraudType && selectedFraudType !== entry.type ? 0.35 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick summary strip */}
      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
        {i4cFraudTypes.map((item) => (
          <div
            key={item.type}
            onClick={() => setSelectedFraudType(item.type)}
            className={`cursor-pointer p-1.5 rounded transition-colors ${
              selectedFraudType === item.type ? 'bg-white/[0.1] text-cyan-300' : 'hover:bg-white/[0.04] text-slate-400'
            }`}
          >
            <div className="text-[10px] font-bold truncate">{item.type}</div>
            <div className="text-[10.5px] font-semibold text-white">{item.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
