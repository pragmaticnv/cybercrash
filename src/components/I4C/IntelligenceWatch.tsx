import React from 'react';
import { ShieldAlert, Zap, ArrowUpRight, Crosshair, Network, TrendingUp, AlertTriangle } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cIntelligenceAlerts } from '../../data/i4cMockData';
import { I4CIntelligenceAlert } from '../../types/i4c';

export const IntelligenceWatch: React.FC = () => {
  const {
    openAlertDrawer,
    openHotspotById,
    openNetworkById,
    setSelectedFraudType
  } = useI4CStore();

  const handleAlertClick = (alert: I4CIntelligenceAlert) => {
    if (alert.targetType === 'hotspot') {
      openHotspotById(alert.targetId);
    } else if (alert.targetType === 'network') {
      openNetworkById(alert.targetId);
    } else if (alert.targetType === 'fraud') {
      setSelectedFraudType(alert.targetId);
    } else {
      openAlertDrawer(alert);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NEW EMERGING HOTSPOT':
      case 'PREDICTION UPDATE':
        return <Crosshair className="w-3.5 h-3.5 text-red-400" />;
      case 'CROSS-STATE NETWORK':
      case 'HIGH-VALUE NETWORK':
        return <Network className="w-3.5 h-3.5 text-amber-400" />;
      case 'RAPID FRAUD GROWTH':
        return <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ELEVATED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="w-full h-[520px] lg:h-[560px] bg-[#030712] border border-white/[0.08] rounded-xl flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 bg-[#060D1A] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-red-400" />
            INTELLIGENCE WATCH
          </h2>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          5 ACTIVE SIGNALS
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06] p-2 space-y-2">
        {i4cIntelligenceAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => handleAlertClick(alert)}
            className="p-3 rounded-lg bg-[#07101E]/70 hover:bg-[#0C1A30] border border-white/[0.05] hover:border-cyan-500/40 cursor-pointer transition-all group select-none"
          >
            {/* Top row: Category & Severity */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                {getCategoryIcon(alert.category)}
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300">
                  {alert.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getSeverityBadge(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>{alert.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            {/* Description */}
            <div className="text-[11.5px] text-slate-400 font-sans mt-1 leading-snug">
              {alert.description}
            </div>

            {/* Target ID pill */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Target: {alert.targetId}
              </span>
              {alert.confidence && (
                <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Confidence: {alert.confidence}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-[#050A14] border-t border-white/[0.06] text-center">
        <span className="text-[10px] font-mono text-slate-500">
          Algorithmic event correlation powered by CYBERCRASH multi-agency ML
        </span>
      </div>
    </div>
  );
};
