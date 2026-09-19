import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { LineChart as ChartIcon, Calendar, Activity, DollarSign, Crosshair, Network } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cNationalTrends } from '../../data/i4cMockData';
import { TimeRange, TrendMetric } from '../../types/i4c';

export const NationalTrends: React.FC = () => {
  const { timeRange, setTimeRange, trendMetric, setTrendMetric } = useI4CStore();

  const data = i4cNationalTrends[timeRange];

  const getMetricConfig = () => {
    switch (trendMetric) {
      case 'cases':
        return {
          label: 'Incident Volume (Cases)',
          dataKey: 'cases',
          color: '#38BDF8',
          gradientId: 'casesGrad',
          unit: 'cases'
        };
      case 'amount':
        return {
          label: 'Reported Exposure (₹ Lakhs)',
          dataKey: 'amount',
          color: '#EF4444',
          gradientId: 'amountGrad',
          unit: '₹ Lakhs'
        };
      case 'cashouts':
        return {
          label: 'Cash-Out Events',
          dataKey: 'cashouts',
          color: '#F59E0B',
          gradientId: 'cashoutsGrad',
          unit: 'cash-outs'
        };
      case 'networks':
        return {
          label: 'Active Syndicates',
          dataKey: 'networks',
          color: '#A855F7',
          gradientId: 'networksGrad',
          unit: 'syndicates'
        };
    }
  };

  const metricConfig = getMetricConfig();

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl">
      {/* Header with Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              NATIONAL ACTIVITY TRENDS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Aggregated temporal trajectory across all state cyber crime coordination cells
            </div>
          </div>
        </div>

        {/* Controls: Metric Switcher + Time Range Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric selector pills */}
          <div className="flex items-center bg-[#070F1C] p-0.5 rounded-lg border border-white/[0.08]">
            {(['cases', 'amount', 'cashouts', 'networks'] as TrendMetric[]).map((m) => (
              <button
                key={m}
                onClick={() => setTrendMetric(m)}
                className={`px-2.5 py-1 rounded text-[10.5px] font-mono font-semibold uppercase transition-all ${
                  trendMetric === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Time range selector pills */}
          <div className="flex items-center bg-[#070F1C] p-0.5 rounded-lg border border-white/[0.08]">
            {(['24H', '7D', '30D', '90D'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded text-[10.5px] font-mono font-semibold uppercase transition-all ${
                  timeRange === r
                    ? 'bg-white/[0.12] text-white border border-white/[0.2]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id={metricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#162234" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={10.5} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={10.5} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#091322] border border-white/20 p-2.5 rounded-lg shadow-2xl text-xs font-mono">
                      <div className="text-slate-400 mb-1">{label}</div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metricConfig.color }} />
                        <span>{metricConfig.label}:</span>
                        <span style={{ color: metricConfig.color }}>
                          {payload[0].value?.toLocaleString()} {metricConfig.unit}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metricConfig.dataKey}
              stroke={metricConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${metricConfig.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
