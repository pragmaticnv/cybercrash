import React from 'react';
import { useInvestigationStore } from '../../store/useInvestigationStore';

export const MapLegend: React.FC = () => {
  const { mapFilters, toggleMapFilter } = useInvestigationStore();

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-[#071120]/90 backdrop-blur-md border border-white/[0.12] rounded-lg p-3 text-xs shadow-2xl max-w-[240px]">
      <div className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-bold mb-2 pb-1 border-b border-white/[0.08]">
        MAP INTELLIGENCE LAYERS
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
          <span className="font-mono text-[11px]">ATM CLUSTER (3)</span>
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

      <div className="mt-3 pt-2 border-t border-white/[0.08] text-[10px] font-mono text-slate-500">
        GEOGRAPHIC FOCUS: GOA (GA_Z05)
      </div>
    </div>
  );
};
