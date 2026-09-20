import React, { useState } from 'react';
import { useInvestigationStore, BaseMapLayer } from '../../store/useInvestigationStore';
import { Layers, Globe, Satellite, Map as MapIcon, Minimize2, Maximize2 } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { mapFilters, toggleMapFilter, selectedBaseLayer, setBaseLayer } = useInvestigationStore();

  const baseLayers: { id: BaseMapLayer; label: string; icon: React.ReactNode }[] = [
    { id: 'google-tactical', label: 'Tactical Cyber Dark', icon: <MapIcon className="w-3 h-3" /> },
    { id: 'google-satellite', label: '4K Satellite (Esri)', icon: <Satellite className="w-3 h-3" /> },
    { id: 'google-roadmap', label: 'Roadmap HD (OSM)', icon: <Globe className="w-3 h-3" /> },
    { id: 'carto-dark', label: 'Minimal Dark Canvas', icon: <Layers className="w-3 h-3" /> },
  ];

  // Minimized Compact Trigger
  if (isMinimized) {
    return (
      <div className="absolute bottom-4 right-4 z-[1000] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          title="Expand Map Layers & Telemetry Controls"
          className="bg-[#071120]/95 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-300 rounded-xl px-3 py-2 text-xs shadow-2xl font-sans flex items-center gap-2.5 text-white group cursor-pointer transition-all hover:bg-[#0B1A2E] hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-[11px] font-bold text-slate-200 group-hover:text-cyan-300">
            {baseLayers.find((b) => b.id === selectedBaseLayer)?.label || 'MAP LAYERS'}
          </span>
          <span className="p-1 rounded bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 ml-0.5 transition-colors">
            <Maximize2 className="w-3 h-3" />
          </span>
        </button>
      </div>
    );
  }

  // Expanded Floating Window with Minimize Control
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-[#071120]/95 backdrop-blur-md border border-white/[0.12] rounded-xl p-3.5 text-xs shadow-2xl max-w-[260px] font-sans animate-in fade-in duration-200 select-none">
      {/* Tactical GIS Engine Status & Minimize Button */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            TACTICAL GIS ENGINE
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            GIS ONLINE
          </span>
        </div>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          title="Minimize map view controls"
          className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 border border-white/[0.06] group"
        >
          <Minimize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
          <span className="text-[9.5px] font-mono">MINIMIZE</span>
        </button>
      </div>

      {/* Base Layer Switcher */}
      <div className="mb-3">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
          BASE SATELLITE / VECTOR LAYER
        </span>
        <div className="grid grid-cols-1 gap-1">
          {baseLayers.map((b) => {
            const isSelected = selectedBaseLayer === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setBaseLayer(b.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-mono transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {b.icon}
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forensic Intelligence Layers */}
      <div className="pt-2 border-t border-white/[0.08]">
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
          OVERLAY TELEMETRY
        </div>

        <div className="space-y-2 select-none">
          {/* Predicted Cash-out Zone */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={mapFilters.showCandidateZones}
              onChange={() => toggleMapFilter('showCandidateZones')}
              className="rounded border-slate-700 text-red-500 focus:ring-0 bg-[#0B1728] cursor-pointer"
            />
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="font-mono text-[11px]">PREDICTED CASH-OUT</span>
          </label>

          {/* ATM Clusters */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={mapFilters.showAtms}
              onChange={() => toggleMapFilter('showAtms')}
              className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-[#0B1728] cursor-pointer"
            />
            <div className="w-3 h-3 rounded-md bg-amber-500 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="font-mono text-[11px]">ATM CLUSTERS (3)</span>
          </label>

          {/* Complaint Location */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={mapFilters.showComplaint}
              onChange={() => toggleMapFilter('showComplaint')}
              className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-[#0B1728] cursor-pointer"
            />
            <div className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-200 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="font-mono text-[11px]">COMPLAINT LOCATION</span>
          </label>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/[0.08] text-[9.5px] font-mono text-slate-500 flex items-center justify-between">
        <span>SECTOR: NORTH GOA</span>
        <span>LAT: 15.54°N</span>
      </div>
    </div>
  );
};
