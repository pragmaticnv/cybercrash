import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity } from 'lucide-react';
import { BankAccount } from '../../types/bank';

interface AccountActivityChartProps {
  account: BankAccount;
}

export const AccountActivityChart: React.FC<AccountActivityChartProps> = ({ account }) => {
  const [metricMode, setMetricMode] = useState<'AMOUNT' | 'COUNT'>('AMOUNT');
  const [flowFilter, setFlowFilter] = useState<'ALL' | 'INFLOW' | 'OUTFLOW'>('ALL');

  // Realistic timeline data aligned with the account's transactions
  const timelineData = [
    { time: '22:00', inboundAmount: 0, outboundAmount: 0, inboundCount: 0, outboundCount: 0 },
    { time: '23:00', inboundAmount: 100250, outboundAmount: 0, inboundCount: 1, outboundCount: 0 },
    { time: '00:00', inboundAmount: 13723, outboundAmount: 22570, inboundCount: 2, outboundCount: 2 },
    { time: '01:00', inboundAmount: 0, outboundAmount: 21774, inboundCount: 0, outboundCount: 3 },
    { time: '02:00', inboundAmount: 0, outboundAmount: 5391, inboundCount: 0, outboundCount: 2 },
    { time: '03:00', inboundAmount: 0, outboundAmount: 3704, inboundCount: 0, outboundCount: 1 },
    { time: '04:00', inboundAmount: 0, outboundAmount: 0, inboundCount: 0, outboundCount: 0 }
  ];

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header with Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              TEMPORAL TRANSACTION ACTIVITY
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Flow divergence between initial credit and subsequent fan-out bursts
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Flow Toggle */}
          <div className="flex items-center bg-[#070E1A] p-0.5 rounded border border-white/[0.08] text-[10px] font-mono font-bold">
            {(['ALL', 'INFLOW', 'OUTFLOW'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFlowFilter(mode)}
                className={`px-2 py-0.5 rounded transition-all ${
                  flowFilter === mode
                    ? 'bg-white/[0.12] text-white border border-white/[0.2]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center bg-[#070E1A] p-0.5 rounded border border-white/[0.08] text-[10px] font-mono font-bold">
            {(['AMOUNT', 'COUNT'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetricMode(m)}
                className={`px-2 py-0.5 rounded transition-all ${
                  metricMode === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#162234" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#091322] border border-white/20 p-2 rounded text-xs font-mono shadow-xl">
                      <div className="text-slate-400 mb-1">{label}</div>
                      {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5" style={{ color: entry.color }}>
                          <span>{entry.name}:</span>
                          <span className="font-bold">
                            {metricMode === 'AMOUNT' ? `₹${entry.value.toLocaleString()}` : `${entry.value} tx`}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {(flowFilter === 'ALL' || flowFilter === 'INFLOW') && (
              <Bar
                dataKey={metricMode === 'AMOUNT' ? 'inboundAmount' : 'inboundCount'}
                name="Incoming"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
              />
            )}
            {(flowFilter === 'ALL' || flowFilter === 'OUTFLOW') && (
              <Bar
                dataKey={metricMode === 'AMOUNT' ? 'outboundAmount' : 'outboundCount'}
                name="Outgoing"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
