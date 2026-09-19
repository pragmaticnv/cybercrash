import React from 'react';
import { SYSTEM_SERVICES } from '../../data/adminDemoData';
import { X, Activity, Server, Database, Radio, Cpu, ShieldCheck, HardDrive } from 'lucide-react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#050B16] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-wide uppercase">
                SYSTEM HEALTH DIAGNOSTICS
              </h2>
              <span className="text-[10.5px] font-mono text-[#94A3B8] tracking-wider uppercase">
                Gov-Net Cybercrime Intelligence Platform Infrastructure
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Services */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SYSTEM_SERVICES.map((svc, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#040914] border border-white/[0.06] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[13px] font-mono font-bold text-white block">
                        {svc.name}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{svc.category}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold">
                    {svc.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono">
                  <div>
                    <span className="text-[#64748B] block">LATENCY</span>
                    <span className="text-cyan-300 font-bold">{svc.latency}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">UPTIME</span>
                    <span className="text-emerald-400 font-bold">{svc.uptime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#64748B] block">ENDPOINT</span>
                    <span className="text-white/80 truncate block">{svc.endpoint}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Cluster Specs */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>CLUSTER TOPOLOGY:</span>
              <span className="text-white">Multi-Region Kubernetes (India Central / West)</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>NCRP INGESTION THROUGHPUT:</span>
              <span className="text-cyan-300">12,400 events/min (Peak)</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>ML GPU CLUSTER:</span>
              <span className="text-emerald-400">4x NVIDIA A100 TensorRT (Active Inference)</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>GEO-SPATIAL MAP TILES:</span>
              <span className="text-white">India High-Res ATM & Cyber Crime Boundary Layers</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/[0.08] bg-white/[0.015] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <span>DIAGNOSTIC STATUS: ALL SUBSYSTEMS NOMINAL</span>
          <button
            onClick={onClose}
            className="py-1 px-3 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
