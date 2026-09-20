import React, { useState } from 'react';
import { Layers, Flame, Crosshair, Users, Share2, AlertTriangle, History, Minimize2, Maximize2 } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';

interface LayerOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const LAYERS: LayerOption[] = [
  { id: 'fraud_activity', name: 'Fraud Activity', icon: Flame, color: 'text-orange-400' },
  { id: 'predicted_hotspots', name: 'Predicted Cash-out', icon: Crosshair, color: 'text-red-400' },
  { id: 'mule_concentration', name: 'Mule Concentration', icon: Users, color: 'text-amber-400' },
  { id: 'network_flows', name: 'Cross-State Flows', icon: Share2, color: 'text-cyan-400' },
  { id: 'emerging_risk', name: 'Emerging Risk', icon: AlertTriangle, color: 'text-pink-400' },
  { id: 'historical_cashouts', name: 'Historical Cash-outs', icon: History, color: 'text-emerald-400' }
];

export const MapLayers: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { activeMapLayers, toggleMapLayer } = useI4CStore();

  if (isMinimized) {
    return (
      <div className="absolute top-3 right-3 z-[1000] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          title="Expand Intelligence Layers"
          className="bg-[#070E1A]/95 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-300 rounded-xl px-3 py-2 text-xs shadow-2xl font-sans flex items-center gap-2 text-white group cursor-pointer transition-all hover:bg-[#0B1A2E]"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-[11px] font-bold text-slate-200 group-hover:text-cyan-300">
            LAYERS ({activeMapLayers.length})
          </span>
          <span className="p-1 rounded bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 transition-colors">
            <Maximize2 className="w-3 h-3" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-3 right-3 z-[1000] bg-[#070E1A]/95 backdrop-blur-md border border-white/[0.1] rounded-xl p-2.5 shadow-2xl flex flex-col gap-1.5 min-w-[200px] select-none animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08] text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>INTELLIGENCE LAYERS</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          title="Minimize layers"
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Minimize2 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {LAYERS.map((layer) => {
          const isActive = activeMapLayers.includes(layer.id);
          const Icon = layer.icon;

          return (
            <button
              key={layer.id}
              onClick={() => toggleMapLayer(layer.id)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-white/[0.08] text-white border border-white/[0.15]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                <span className="text-[11.5px] font-medium">{layer.name}</span>
              </div>
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]' : 'bg-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
