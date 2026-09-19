import React from 'react';
import { useInvestigationStore, BaseMapLayer } from '../../store/useInvestigationStore';
import { Layers, Globe, Satellite, Map as MapIcon, ShieldCheck } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const { mapFilters, toggleMapFilter, selectedBaseLayer, setBaseLayer } = useInvestigationStore();

  const baseLayers: { id: BaseMapLayer; label: string; icon: React.ReactNode }[] = [
    { id: 'google-tactical', label: 'Google Tactical Dark', icon: <MapIcon className="w-3 h-3" /> },
    { id: 'google-satellite', label: 'Google 4K Satellite', icon: <Satellite className="w-3 h-3" /> },
    { id: 'google-roadmap', label: 'Google Roadmap HD', icon: <Globe className="w-3 h-3" /> },
    { id: 'carto-dark', label: 'CartoDB Dark', icon: <Layers className="w-3 h-3" /> },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-[#071120]/95 backdrop-blur-md border border-white/[0.12] rounded-xl p-3.5 text-xs shadow-2xl max-w-[260px] font-sans">
      {/* Google Maps API Status */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.08]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
          GOOGLE MAPS ENGINE
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          API CONNECTED
        </span>
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
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-mono transition-all text-left ${
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
              className="rounded border-slate-700 text-red-500 focus:ring-0 bg-[#0B1728]"
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
              className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-[#0B1728]"
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
              className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-[#0B1728]"
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
