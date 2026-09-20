import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useI4CStore } from '../../store/useI4CStore';
import { i4cStatesData, i4cHotspots, i4cStateFlows } from '../../data/i4cMockData';
import { MapLayers } from './MapLayers';
import { I4CStateSummary, I4CHotspot } from '../../types/i4c';
import { ArrowRight, Crosshair, ShieldAlert, Sparkles, Navigation, Globe, Eye } from 'lucide-react';
import { GOOGLE_MAP_TILE_URLS } from '../../config/maps';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';

import { apiFetch } from '../../api/apiClient';

function getComplaintCoords(location?: any): [number, number] {
  if (!location) return [15.4989, 73.8278];
  if (typeof location === 'object' && location.lat && location.lng) {
    return [location.lat, location.lng];
  }
  const l = String(location).toLowerCase();
  if (l.includes('goa') || l.includes('panaji')) return [15.4989, 73.8278];
  if (l.includes('punjab') || l.includes('amritsar')) return [31.6340, 74.8723];
  if (l.includes('tamil nadu') || l.includes('chennai')) return [13.0827, 80.2707];
  if (l.includes('delhi')) return [28.6139, 77.2090];
  if (l.includes('maharashtra') || l.includes('mumbai')) return [19.0760, 72.8777];
  if (l.includes('karnataka') || l.includes('bengaluru')) return [12.9716, 77.5946];
  return [15.4989, 73.8278];
}

// Controller to smoothly pan/zoom to the active extraction corridor
const ActiveCorridorController: React.FC<{ focusTarget: [number, number] | null }> = ({ focusTarget }) => {
  const map = useMap();
  useEffect(() => {
    if (focusTarget) {
      map.flyTo(focusTarget, 6, { animate: true, duration: 1.2 });
    }
  }, [focusTarget, map]);
  return null;
};

// Helper to select matching arrowhead marker ID based on flow color
const getFlowArrowId = (color: string) => {
  const c = color.toLowerCase();
  if (c.includes('ef4444') || c.includes('red')) return 'flowArrowRed';
  if (c.includes('f59e0b') || c.includes('amber')) return 'flowArrowAmber';
  if (c.includes('ec4899') || c.includes('pink')) return 'flowArrowPink';
  if (c.includes('10b981') || c.includes('emerald') || c.includes('green')) return 'flowArrowEmerald';
  return 'flowArrowCyan';
};

// Subcomponent to project SVG curved bezier flow lines directly on top of Leaflet
const CrossStateFlowOverlay: React.FC<{ liveFlows?: any[] }> = ({ liveFlows }) => {
  const map = useMap();
  const [, setTick] = useState(0);
  const { activeMapLayers, openNetworkById } = useI4CStore();
  const { activeCase, prediction } = useActiveCaseStore();

  useEffect(() => {
    const handleMove = () => setTick((t) => t + 1);
    map.on('move', handleMove);
    map.on('zoom', handleMove);
    return () => {
      map.off('move', handleMove);
      map.off('zoom', handleMove);
    };
  }, [map]);

  if (!activeMapLayers.includes('network_flows')) return null;

  const baseFlows = liveFlows && liveFlows.length > 0 ? liveFlows : i4cStateFlows;
  const combinedFlows = [...baseFlows];
  if (activeCase && prediction?.centerCoordinates) {
    const from = getComplaintCoords(activeCase.complaintLocation);
    const to: [number, number] = [
      prediction.centerCoordinates.lat || 21.1702,
      prediction.centerCoordinates.lng || 72.8311
    ];
    const fromName = typeof activeCase.complaintLocation === 'object' ? activeCase.complaintLocation.city : (activeCase.state || 'Origin');
    const toName = prediction.clusterName || prediction.predictedZone || 'Predicted Destination';

    combinedFlows.unshift({
      id: `active-case-flow-${activeCase.id}`,
      networkId: 'NET-CRASH-01',
      fromState: fromName,
      toState: toName,
      fromCoords: from,
      toCoords: to,
      amount: `${activeCase.amount || '₹1,50,000'} (LIVE)`,
      txCount: 4,
      color: '#EF4444'
    });
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[450]">
      <defs>
        {/* Directional Arrowheads for each flow color */}
        <marker id="flowArrowRed" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EF4444" />
        </marker>
        <marker id="flowArrowAmber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F59E0B" />
        </marker>
        <marker id="flowArrowCyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38BDF8" />
        </marker>
        <marker id="flowArrowPink" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EC4899" />
        </marker>
        <marker id="flowArrowEmerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
        </marker>
      </defs>

      {combinedFlows.map((flow) => {
        const p1 = map.latLngToContainerPoint(L.latLng(flow.fromCoords[0], flow.fromCoords[1]));
        const p2 = map.latLngToContainerPoint(L.latLng(flow.toCoords[0], flow.toCoords[1]));

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) return null;

        // Calculate a gentle perpendicular curve midpoint
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const curvature = 0.20;
        const normalX = -dy * curvature;
        const normalY = dx * curvature;
        const ctrlX = midX + normalX;
        const ctrlY = midY + normalY;

        const pathData = `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`;
        const arrowMarkerId = getFlowArrowId(flow.color);

        return (
          <g 
            key={flow.id} 
            className="cursor-pointer pointer-events-auto group" 
            onClick={() => openNetworkById(flow.networkId)}
          >
            <title>{`${flow.fromState} → ${flow.toState}: ${flow.amount} (${flow.txCount} transactions)`}</title>

            {/* 1. Ambient Glow underneath */}
            <path
              d={pathData}
              fill="none"
              stroke={flow.color}
              strokeWidth="6"
              strokeOpacity="0.18"
              className="filter blur-[3px]"
            />

            {/* 2. Solid Clearly Connected Continuous Arc with Directional Arrowhead */}
            <path
              d={pathData}
              fill="none"
              stroke={flow.color}
              strokeWidth="2.2"
              strokeOpacity="0.55"
              strokeLinecap="round"
              markerEnd={`url(#${arrowMarkerId})`}
            />

            {/* 3. Smooth Moving Dash Stream */}
            <path
              d={pathData}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="10 24"
              strokeLinecap="round"
              strokeOpacity="0.85"
              className="animate-[flowDash_2.2s_linear_infinite]"
            />

            {/* 4. Real-time Animated Particle Gliding Across State Flow */}
            <circle r="3.2" fill="#FFFFFF" opacity="0.95">
              <animateMotion dur="2.4s" repeatCount="indefinite" path={pathData} />
            </circle>
            <circle r="2" fill={flow.color} opacity="0.8">
              <animateMotion dur="2.4s" begin="0.15s" repeatCount="indefinite" path={pathData} />
            </circle>

            {/* 5. Origin Node Point (Source) */}
            <circle cx={p1.x} cy={p1.y} r="3.5" fill={flow.color} />
            <circle cx={p1.x} cy={p1.y} r="6" fill="none" stroke={flow.color} strokeWidth="1" strokeOpacity="0.7" />

            {/* 6. Destination Node Point (Sink / Target) */}
            <circle cx={p2.x} cy={p2.y} r="4" fill={flow.color} />
            <circle cx={p2.x} cy={p2.y} r="8" fill="none" stroke={flow.color} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 2" />

            {/* 7. Midpoint Tactical Amount Badge */}
            <g transform={`translate(${midX + normalX * 0.45}, ${midY + normalY * 0.45})`} className="transition-transform group-hover:scale-110">
              <rect
                x="-22"
                y="-8"
                width="44"
                height="16"
                rx="8"
                fill="#040914"
                stroke={flow.color}
                strokeWidth="1"
                strokeOpacity="0.9"
              />
              <text
                textAnchor="middle"
                y="3.5"
                fill="#F8FAFC"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                {flow.amount}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

export const NationalMap: React.FC = () => {
  const {
    activeMapLayers,
    openStateDrawer,
    openHotspotDrawer,
    selectedFraudType
  } = useI4CStore();
  const { activeCase, prediction } = useActiveCaseStore();

  const [baseTheme, setBaseTheme] = useState<'carto' | 'tactical' | 'satellite' | 'roadmap'>('carto');
  const [focusTarget, setFocusTarget] = useState<[number, number] | null>(null);
  const [liveMapData, setLiveMapData] = useState<{
    states?: I4CStateSummary[];
    hotspots?: I4CHotspot[];
    flows?: any[];
  } | null>(null);
  const [mapApiOnline, setMapApiOnline] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    apiFetch<any>('/i4c/map')
      .then((data) => {
        if (isMounted && data) {
          setLiveMapData(data);
          setMapApiOnline(true);
        }
      })
      .catch(() => {
        // Fallback to local intelligence data
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeStates = liveMapData?.states || i4cStatesData;

  // Filter states if a fraud type filter is active
  const filteredStates = selectedFraudType
    ? activeStates.filter((s) => s.topFraudType === selectedFraudType || s.fraudBreakdown.some((b) => b.type === selectedFraudType))
    : activeStates;

  const combinedHotspots = React.useMemo(() => {
    let list = [...(liveMapData?.hotspots || i4cHotspots)];
    if (activeCase && prediction?.centerCoordinates) {
      const zoneId = prediction.predictedZone || 'GA_Z05';
      const city = activeCase.complaintLocation?.city || activeCase.state || 'Panaji';
      const state = activeCase.complaintLocation?.state || activeCase.state || 'Goa';
      const conf = prediction.confidenceScore ? Math.round(prediction.confidenceScore > 1 ? prediction.confidenceScore : prediction.confidenceScore * 100) : 88;

      list = [
        {
          zoneId: zoneId,
          city: city,
          state: state,
          stateCode: activeCase.stateCode || 'GA',
          lat: prediction.centerCoordinates.lat || 15.5925,
          lng: prediction.centerCoordinates.lng || 73.8135,
          locationRisk: 'Critical' as const,
          dominantFraudType: activeCase.type || 'Investment Scam',
          modelConfidence: conf,
          estimatedWindow: prediction.timeWindow || '18:00 – 21:00',
          associatedCasesCount: 1,
          associatedCaseIds: [activeCase.id],
          associatedMuleAccountsCount: 3,
          associatedMules: [activeCase.primaryMule],
          historicalCashOuts: 4,
          atmDensity: 'Very High' as const,
          recentActivitySummary: `Live high-probability extraction vector for active case ${activeCase.id}.`,
          supportingFactors: [
            'Target Mule Proximity Vector',
            'Inter-State Rapid Outbound Relay',
            'High Density Commercial ATM Cluster'
          ]
        },
        ...list.filter(h => h.zoneId !== zoneId)
      ];
    }
    return list;
  }, [activeCase, prediction]);

  const filteredHotspots = selectedFraudType
    ? combinedHotspots.filter((h) => h.dominantFraudType.includes(selectedFraudType))
    : combinedHotspots;

  return (
    <div className="relative w-full h-[520px] lg:h-[560px] bg-[#02060D] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col">
      {/* Top Banner with Theme Switcher & Filter Status */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-[#070E1A]/95 backdrop-blur-md border border-white/[0.12] px-3 py-1.5 rounded-lg shadow-xl">
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/[0.1]">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase text-white font-semibold tracking-wider">
            INDIA THEATER INTELLIGENCE
          </span>
        </div>

        {/* Base Map Switcher Pills */}
        <div className="flex items-center bg-[#030712] p-0.5 rounded-md border border-white/[0.08] text-[10px] font-mono font-semibold">
          <button
            onClick={() => setBaseTheme('carto')}
            className={`px-2 py-0.5 rounded transition-all ${
              baseTheme === 'carto'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Minimal Dark
          </button>
          <button
            onClick={() => setBaseTheme('tactical')}
            className={`px-2 py-0.5 rounded transition-all ${
              baseTheme === 'tactical'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Dark
          </button>
          <button
            onClick={() => setBaseTheme('satellite')}
            className={`px-2 py-0.5 rounded transition-all ${
              baseTheme === 'satellite'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4K Satellite
          </button>
          <button
            onClick={() => setBaseTheme('roadmap')}
            className={`px-2 py-0.5 rounded transition-all ${
              baseTheme === 'roadmap'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Roadmap HD
          </button>
        </div>

        {/* Map API Status Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{mapApiOnline ? 'MAP API: CONNECTED (FASTAPI)' : 'MAP ENGINE: ONLINE (HD)'}</span>
        </div>

        {activeCase && (
          <button
            onClick={() => {
              if (prediction?.centerCoordinates?.lat && prediction?.centerCoordinates?.lng) {
                setFocusTarget([prediction.centerCoordinates.lat, prediction.centerCoordinates.lng]);
              } else {
                setFocusTarget(getComplaintCoords(activeCase.complaintLocation));
              }
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 text-[10px] font-mono cursor-pointer transition-all"
          >
            <Crosshair className="w-3 h-3 text-red-400 animate-pulse" />
            <span>FOCUS {activeCase.id} CORRIDOR</span>
          </button>
        )}

        {selectedFraudType && (
          <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
            FILTER: {selectedFraudType}
          </span>
        )}
      </div>

      <MapLayers />

      {/* Leaflet Map Canvas */}
      <div className="w-full h-full relative">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.8}
          minZoom={4}
          maxZoom={10}
          scrollWheelZoom={true}
          className="w-full h-full"
          attributionControl={false}
        >
          {focusTarget && <ActiveCorridorController focusTarget={focusTarget} />}
          {/* Base Tile Layer */}
          <TileLayer
            key={baseTheme}
            url={
              baseTheme === 'satellite'
                ? GOOGLE_MAP_TILE_URLS.satellite
                : baseTheme === 'roadmap'
                ? GOOGLE_MAP_TILE_URLS.roadmap
                : baseTheme === 'tactical'
                ? GOOGLE_MAP_TILE_URLS.tacticalDark
                : GOOGLE_MAP_TILE_URLS.cartoDark
            }
            subdomains={['a', 'b', 'c', 'd']}
            className={baseTheme === 'tactical' ? 'tactical-dark-tiles' : ''}
            maxZoom={20}
            attribution="&copy; Google Maps &copy; Esri"
          />

          {/* D3/SVG Flow Overlay for Cross-State Suspicious Fund Movements */}
          <CrossStateFlowOverlay liveFlows={liveMapData?.flows} />

          {/* State Intelligence Nodes - Compact Tactical Sizing */}
          {activeMapLayers.includes('fraud_activity') &&
            filteredStates.map((state) => {
              const radius = Math.max(6, Math.min(11, Math.round(Math.sqrt(state.activeCases) * 0.22)));
              const isCritical = state.riskLevel === 'CRITICAL';
              const color = isCritical ? '#EF4444' : state.riskLevel === 'HIGH' ? '#F59E0B' : '#38BDF8';

              return (
                <CircleMarker
                  key={state.id}
                  center={[state.lat, state.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    weight: 1.5,
                    fillColor: color,
                    fillOpacity: 0.45
                  }}
                  eventHandlers={{
                    click: () => openStateDrawer(state)
                  }}
                >
                  <Popup className="tactical-i4c-popup">
                    <div className="p-3 min-w-[200px] bg-[#0A1322] text-white rounded-lg">
                      <div className="flex items-center justify-between border-b border-white/[0.1] pb-1.5 mb-2">
                        <span className="font-bold text-sm text-cyan-300">{state.name.toUpperCase()}</span>
                        <span
                          className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {state.riskLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-slate-400">CASES</div>
                          <div className="font-bold text-white">{state.activeCases.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">REPORTED</div>
                          <div className="font-bold text-red-400">{state.reportedAmount}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">MULES</div>
                          <div className="font-bold text-amber-300">{state.muleAccounts}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">HOTSPOTS</div>
                          <div className="font-bold text-cyan-300">{state.predictedHotspots}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => openStateDrawer(state)}
                        className="w-full mt-3 py-1 px-2 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-[11px] font-mono font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>EXPLORE STATE DOSSIER</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

          {/* Predicted Cash-Out Hotspots: Compact Tactical Nodes */}
          {activeMapLayers.includes('predicted_hotspots') &&
            filteredHotspots.map((hotspot) => (
              <CircleMarker
                key={hotspot.zoneId}
                center={[hotspot.lat, hotspot.lng]}
                radius={7.5}
                pathOptions={{
                  color: '#EF4444',
                  weight: 2,
                  fillColor: '#EF4444',
                  fillOpacity: 0.8
                }}
                eventHandlers={{
                  click: () => openHotspotDrawer(hotspot)
                }}
              >
                <Popup className="tactical-i4c-popup">
                  <div className="p-3 min-w-[210px] bg-[#120609] border border-red-500/40 text-white rounded-lg">
                    <div className="flex items-center justify-between border-b border-red-500/30 pb-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-red-400 animate-spin" />
                        <span className="font-bold text-xs text-white">{hotspot.zoneId}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">
                        {hotspot.modelConfidence}% ML
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-sans">{hotspot.city}</div>
                    <div className="mt-2 text-[11px] font-mono text-amber-300">
                      Window: {hotspot.estimatedWindow}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {hotspot.associatedCasesCount} linked cases · {hotspot.associatedMuleAccountsCount} mules
                    </div>
                    <button
                      onClick={() => openHotspotDrawer(hotspot)}
                      className="w-full mt-2.5 py-1 px-2 rounded bg-red-600/40 hover:bg-red-600/60 text-red-200 text-[11px] font-mono font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>INSPECT PREDICTION</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>

      {/* Map Footer Intelligence Legend */}
      <div className="w-full bg-[#040914] border-t border-white/[0.06] px-4 py-1.5 flex flex-wrap items-center justify-between text-[10.5px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Critical Severity (Cases &gt; 2,000)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>High Severity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Moderate Severity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-500 rounded" />
            <span>Observed Inter-State Fund Trajectory</span>
          </div>
        </div>
        <div className="text-slate-500 text-[10px]">
          Click any state node or predicted hotspot to drill down
        </div>
      </div>
    </div>
  );
};
