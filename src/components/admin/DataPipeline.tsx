import React from 'react';
import { DATA_PIPELINE_STAGES } from '../../data/adminDemoData';
import { 
  GitCommit, 
  Radio, 
  Layers, 
  Cpu, 
  BrainCircuit, 
  ShieldAlert, 
  Building2, 
  ArrowRight,
  Activity
} from 'lucide-react';

export const DataPipeline: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'feed':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'tx':
        return <Layers className="w-4 h-4 text-sky-400" />;
      case 'features':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'ml':
        return <BrainCircuit className="w-4 h-4 text-red-400" />;
      case 'risk':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'agency':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              DATA PIPELINE
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              End-to-End Forensic Processing & Dispatch Stream
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>ACTIVE FLOW · 100% HEALTH</span>
        </div>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="my-5 relative">
        {/* Subtle connecting line spanning background */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-cyan-500/30 via-red-500/40 to-emerald-500/30 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {DATA_PIPELINE_STAGES.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3 rounded-xl bg-[#040A14] border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col items-center text-center relative group"
            >
              {/* Step indicator dot */}
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {getIcon(stage.id)}
              </div>

              {/* Title */}
              <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase leading-tight mb-1">
                {stage.name}
              </span>

              {/* Rate & Status */}
              <span className="text-[9.5px] font-mono text-cyan-300">
                {stage.rate}
              </span>
              <span className="text-[8.5px] font-mono text-[#64748B] mt-0.5 uppercase tracking-widest">
                {stage.status}
              </span>

              {/* Pulse line indicator */}
              <div className="w-full h-0.5 bg-cyan-500/20 group-hover:bg-cyan-500/60 transition-colors mt-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Footnote */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[9.5px] font-mono text-[#64748B]">
        <span>NCRP INGESTION ➔ GRAPH ENRICHMENT ➔ ML GEOLOCATION ➔ LEA ACTION</span>
        <span className="text-emerald-400">LATENCY BUDGET: &lt;150ms COMPLETE PIPELINE</span>
      </div>
    </div>
  );
};
