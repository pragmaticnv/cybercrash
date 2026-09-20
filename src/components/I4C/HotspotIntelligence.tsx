import React from 'react';
import { Crosshair, Clock, AlertCircle, ArrowUpRight, Shield, Layers } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cHotspots } from '../../data/i4cMockData';
import { I4CHotspot } from '../../types/i4c';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';

export const HotspotIntelligence: React.FC = () => {
  const { openHotspotDrawer, selectedFraudType } = useI4CStore();
  const { activeCase, prediction } = useActiveCaseStore();

  const combinedHotspots = React.useMemo(() => {
    let list = [...i4cHotspots];
    if (activeCase && prediction) {
      const zoneId = prediction.predictedZone || 'ZONE-ACTIVE-01';
      const city = activeCase.complaintLocation?.city || activeCase.state || 'Surat';
      const state = activeCase.complaintLocation?.state || activeCase.state || 'Gujarat';
      const conf = prediction.confidenceScore ? Math.round(prediction.confidenceScore > 1 ? prediction.confidenceScore : prediction.confidenceScore * 100) : 88;

      const dynamicHotspot: I4CHotspot = {
        zoneId: zoneId,
        city: city,
        state: state,
        stateCode: activeCase.stateCode || 'GA',
        lat: prediction.centerCoordinates?.lat || 21.1702,
        lng: prediction.centerCoordinates?.lng || 72.8311,
        locationRisk: 'Critical',
        dominantFraudType: activeCase.type || 'Investment Scam',
        modelConfidence: conf,
        estimatedWindow: prediction.timeWindow || '14:00 - 18:00',
        associatedCasesCount: 1,
        associatedCaseIds: [activeCase.id],
        associatedMuleAccountsCount: 3,
        associatedMules: [activeCase.primaryMule],
        historicalCashOuts: 4,
        atmDensity: 'Very High',
        recentActivitySummary: `High-probability extraction vector predicted by ML model for Case ${activeCase.id}. Primary mule: ${activeCase.primaryMule}.`,
        supportingFactors: [
          'Target Mule Proximity Vector',
          'Inter-State Rapid Outbound Relay',
          'High Density Commercial ATM Cluster'
        ]
      };

      // Remove duplicate if exists by zoneId, and prepend
      list = [dynamicHotspot, ...list.filter(h => h.zoneId !== zoneId)];
    }
    return list;
  }, [activeCase, prediction]);

  const filteredHotspots = selectedFraudType
    ? combinedHotspots.filter((h) => h.dominantFraudType.toLowerCase().includes(selectedFraudType.toLowerCase()))
    : combinedHotspots;

  return (
    <div className="w-full bg-[#030712] border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              PREDICTED CASH-OUT HOTSPOTS
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Machine-learning extraction forecasting at national scale
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
          {filteredHotspots.length} ACTIVE ZONES
        </span>
      </div>

      {/* Hotspots List */}
      <div className="space-y-2.5">
        {filteredHotspots.map((spot) => {
          const isActiveTarget = spot.zoneId === prediction?.predictedZone;
          return (
            <div
              key={spot.zoneId}
              onClick={() => openHotspotDrawer(spot)}
              className={`p-3 rounded-lg border transition-all cursor-pointer group select-none ${
                isActiveTarget
                  ? 'border-red-500/80 bg-[#140a10] ring-1 ring-red-500/40 hover:bg-[#1a0d16]'
                  : 'bg-[#080E1A] border-white/[0.06] hover:border-red-500/40 hover:bg-[#0E1726]'
              }`}
            >
              {/* Top row: Zone ID, confidence, state */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
                    {spot.zoneId}
                  </span>
                  {isActiveTarget && (
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
                      ACTIVE CASE TARGET
                    </span>
                  )}
                  <span className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                  {spot.city} ({spot.state})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">
                  {spot.modelConfidence}% ML CONF
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Dominant fraud & Time Window */}
            <div className="flex items-center justify-between text-[11.5px] text-slate-300 font-sans mb-2">
              <span className="text-slate-400">
                Fraud: <span className="text-white font-medium">{spot.dominantFraudType}</span>
              </span>
              <div className="flex items-center gap-1 font-mono text-amber-300 text-xs">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{spot.estimatedWindow}</span>
              </div>
            </div>

            {/* Associated stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">LINKED CASES</div>
                <div className="text-xs font-bold text-cyan-300">{spot.associatedCasesCount}</div>
              </div>
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">MULE ACCOUNTS</div>
                <div className="text-xs font-bold text-amber-300">{spot.associatedMuleAccountsCount}</div>
              </div>
              <div className="bg-[#050A14] p-1.5 rounded">
                <div className="text-[9px] text-slate-400">ATM DENSITY</div>
                <div className="text-xs font-bold text-purple-300">{spot.atmDensity}</div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
