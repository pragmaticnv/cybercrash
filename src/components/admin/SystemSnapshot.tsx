import React from 'react';
import { ADMIN_SYSTEM_METRICS } from '../../data/adminDemoData';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const SystemSnapshot: React.FC = () => {
  return (
    <section className="w-full">
      {/* Micro-heading */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#94A3B8] uppercase">
            SYSTEM SNAPSHOT · REAL-TIME TELEMETRY
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#64748B] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>POLLING INTERVAL: 2500ms</span>
        </div>
      </div>

      {/* Snapshot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {ADMIN_SYSTEM_METRICS.map((metric, idx) => {
          const isOperational = metric.label === 'SYSTEM STATUS';

          return (
            <div
              key={idx}
              className="relative rounded-xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-3.5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.16] transition-all group overflow-hidden"
            >
              {/* Subtle top border accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isOperational
                    ? 'bg-gradient-to-r from-emerald-500/70 to-emerald-400/20'
                    : idx === 0
                    ? 'bg-gradient-to-r from-red-500/70 to-red-400/20'
                    : 'bg-gradient-to-r from-cyan-500/50 to-transparent'
                }`}
              />

              {/* Header label */}
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-medium text-[#94A3B8] tracking-wider uppercase">
                  {metric.label}
                </span>
                {isOperational ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-cyan-400 transition-colors" />
                )}
              </div>

              {/* Main value */}
              <div className="my-2 flex items-baseline gap-2">
                <span
                  className={`font-display font-bold text-[24px] tracking-tight leading-none ${
                    isOperational ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {metric.value}
                </span>
              </div>

              {/* Subtitle / Change & Meta */}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono">
                <span
                  className={`font-medium ${
                    isOperational
                      ? 'text-emerald-300'
                      : metric.trend === 'up'
                      ? 'text-cyan-400'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-[#64748B] truncate ml-1 text-right">
                  {metric.meta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
