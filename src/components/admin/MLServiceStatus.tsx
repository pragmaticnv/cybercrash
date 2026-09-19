import React, { useState, useEffect } from 'react';
import { ML_SERVICES, MLServiceItem } from '../../data/adminDemoData';
import { Cpu, CheckCircle2, Zap, Brain, Sparkles, Activity } from 'lucide-react';

export const MLServiceStatus: React.FC = () => {
  const [lastInferenceSec, setLastInferenceSec] = useState<number>(2.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastInferenceSec((prev) => {
        if (prev > 4.5) return 0.8;
        return parseFloat((prev + 0.3).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[#FF4D58]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              INTELLIGENCE ENGINE
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              ML Inference Pipeline & Geolocation Predictor
            </span>
          </div>
        </div>

        {/* Live Inference Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LAST INFERENCE: {lastInferenceSec}s AGO</span>
        </div>
      </div>

      {/* Services List */}
      <div className="divide-y divide-white/[0.04] my-3">
        {ML_SERVICES.map((svc, i) => (
          <div key={i} className="py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {svc.name}
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-[#94A3B8] border border-white/[0.06]">
                    {svc.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748B] block mt-0.5">
                  {svc.architecture}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10.5px] font-mono text-cyan-400 font-semibold">
                  {svc.accuracyOrThroughput}
                </span>
                <span className="text-[9px] font-mono text-[#64748B]">
                  Latency: {svc.latency}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9.5px] font-mono font-bold tracking-wider uppercase">
                {svc.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-2">
          <span>MODEL VERSION:</span>
          <span className="text-white font-bold bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08]">
            v1.0-DEMO
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Activity className="w-3 h-3" />
          <span>REAL-TIME SHAP + SPATIAL KERNEL PIPELINE</span>
        </div>
      </div>
    </div>
  );
};
