import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Prediction } from '../../types/prediction';
import { Case } from '../../types/case';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { MapLegend } from './MapLegend';
import { AlertCircle, Clock, Crosshair, MapPin, ShieldAlert } from 'lucide-react';

interface MapInvestigationProps {
  prediction: Prediction;
  caseData: Case;
}

import { GOOGLE_MAP_TILE_URLS } from '../../config/maps';

// Controller to smoothly pan/fit bounds
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const MapInvestigation: React.FC<MapInvestigationProps> = ({ prediction, caseData }) => {
  const { mapFilters, setTechnicalDrawerOpen, selectedBaseLayer } = useInvestigationStore();

  const centerLat = prediction.centerCoordinates.lat;
  const centerLng = prediction.centerCoordinates.lng;

  // Determine active tile configuration from Tactical Open GIS Providers
  let activeTileUrl = GOOGLE_MAP_TILE_URLS.tacticalDark;
  let activeTileClass = 'tactical-dark-tiles';
  let activeAttribution = '&copy; CARTO &copy; OpenStreetMap';
  let maxZoomLevel = 20;

  if (selectedBaseLayer === 'google-satellite') {
    activeTileUrl = GOOGLE_MAP_TILE_URLS.satellite;
    activeTileClass = '';
    activeAttribution = '&copy; Esri World Imagery';
    maxZoomLevel = 21;
  } else if (selectedBaseLayer === 'google-roadmap') {
    activeTileUrl = GOOGLE_MAP_TILE_URLS.roadmap;
    activeTileClass = '';
    activeAttribution = '&copy; OpenStreetMap contributors';
    maxZoomLevel = 20;
  } else if (selectedBaseLayer === 'carto-dark') {
    activeTileUrl = GOOGLE_MAP_TILE_URLS.cartoDark;
    activeTileClass = '';
    activeAttribution = '&copy; Esri Dark Canvas &copy; OpenStreetMap';
    maxZoomLevel = 19;
  }

  // Custom DOM-rendered icons to guarantee 0 asset 404s and ultra-high fidelity cyber aesthetics
  const predictedZoneIcon = L.divIcon({
    className: 'custom-leaflet-predicted-zone',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
        <!-- Multi-layer pulsing radar rings -->
        <div class="absolute w-24 h-24 rounded-full border border-red-500/40 bg-red-500/10 animate-ping"></div>
        <div class="absolute w-16 h-16 rounded-full border border-red-500/60 bg-red-500/15 pulsing-predicted-beacon"></div>
        
        <!-- Center Target Reticle -->
        <div class="relative z-10 w-9 h-9 rounded-full bg-[#0E0406] border-2 border-red-500 flex items-center justify-center shadow-[0_0_18px_rgba(239,68,68,0.9)]">
          <div class="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_#FF2222]"></div>
        </div>

        <!-- Floating Tactical Label -->
        <div class="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded bg-[#0A101C]/95 border border-red-500/50 shadow-2xl backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span class="font-mono text-[11px] font-bold text-white tracking-wider">PREDICTED CASH-OUT</span>
          <span class="font-mono text-[11px] font-extrabold text-red-400 border-l border-white/20 pl-1.5">${prediction.predictedZone} · ${prediction.confidencePercent}</span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  const complaintIcon = L.divIcon({
    className: 'custom-leaflet-complaint',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
        <div class="w-8 h-8 rounded-full bg-[#051324] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.8)]">
          <div class="w-2.5 h-2.5 rounded-full bg-cyan-300"></div>
        </div>
        <div class="absolute top-9 whitespace-nowrap px-2 py-0.5 rounded bg-[#081324]/90 border border-cyan-500/40 shadow-lg font-mono text-[10.5px] text-cyan-200">
          COMPLAINT ORIGIN · ${caseData.victim.name}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  const createAtmIcon = (atmName: string, isCritical: boolean) =>
    L.divIcon({
      className: 'custom-leaflet-atm',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
          <div class="w-7 h-7 rounded-md ${isCritical ? 'bg-red-950/80 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]' : 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'} border-2 flex items-center justify-center">
            <span class="text-[10px] font-mono font-bold ${isCritical ? 'text-red-400' : 'text-amber-300'}">ATM</span>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#02060D]">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={[centerLat, centerLng]} zoom={12} />

        {/* Tactical GIS Base Tile Layer */}
        <TileLayer
          key={selectedBaseLayer}
          attribution={activeAttribution}
          url={activeTileUrl}
          subdomains={['a', 'b', 'c', 'd']}
          className={activeTileClass}
          maxZoom={maxZoomLevel}
        />

        {/* Predicted Zone Circumference */}
        {mapFilters.showCandidateZones && (
          <Circle
            center={[centerLat, centerLng]}
            radius={prediction.radiusMeters}
            pathOptions={{
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* 1. DOMINANT PREDICTED CASH-OUT ZONE MARKER */}
        {mapFilters.showCandidateZones && (
          <Marker position={[centerLat, centerLng]} icon={predictedZoneIcon}>
            <Popup className="tactical-popup" maxWidth={360}>
              <div className="p-4 select-none font-sans text-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.1] pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      PREDICTED CASH-OUT ZONE
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40">
                    {prediction.confidencePercent}
                  </span>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-[#050C16] border border-white/[0.06] p-2 rounded">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase block">ZONE CODE</span>
                    <span className="font-mono font-bold text-white text-sm">{prediction.predictedZone}</span>
                  </div>
                  <div className="bg-[#050C16] border border-white/[0.06] p-2 rounded">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase block">CASH-OUT WINDOW</span>
                    <span className="font-mono font-bold text-amber-300 text-xs">{prediction.timeWindow}</span>
                  </div>
                  <div className="bg-[#050C16] border border-white/[0.06] p-2 rounded">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase block">CLUSTER CLUSTER</span>
                    <span className="font-mono font-bold text-slate-200 text-xs">3 Commercial ATMs</span>
                  </div>
                  <div className="bg-[#050C16] border border-white/[0.06] p-2 rounded">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase block">REGION STATUS</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">Tier-1 Watchlist</span>
                  </div>
                </div>

                {/* WHY THIS LOCATION? Section */}
                <div className="border-t border-white/[0.08] pt-2.5">
                  <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>WHY THIS LOCATION?</span>
                  </div>

                  <ul className="space-y-1.5 text-xs">
                    {prediction.evidence.slice(0, 4).map((ev, idx) => (
                      <li key={idx} className="flex items-start justify-between gap-2 bg-white/[0.02] p-1.5 rounded">
                        <span className="text-slate-300 text-[11px]">{ev.factor}</span>
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          ev.level === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {ev.level} ({ev.metric})
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setTechnicalDrawerOpen(true)}
                    className="w-full mt-3 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors text-center"
                  >
                    View Model Explanation & Evidence →
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 2. COMPLAINT LOCATION */}
        {mapFilters.showComplaint && caseData.complaintLocation && (
          <Marker
            position={[caseData.complaintLocation.lat, caseData.complaintLocation.lng]}
            icon={complaintIcon}
          >
            <Popup className="tactical-popup" maxWidth={300}>
              <div className="p-3 select-none font-sans text-slate-200">
                <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1.5 mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase">COMPLAINT LOCATION</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Complainant: </span>
                    <span className="text-white font-medium">{caseData.victim.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Bank: </span>
                    <span className="text-slate-200 font-mono">{caseData.victim.bank}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Reported Loss: </span>
                    <span className="text-red-400 font-mono font-bold">{caseData.amount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Time Filed: </span>
                    <span className="text-slate-300 font-mono">{caseData.complaintTime}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 3. ATM CLUSTERS */}
        {mapFilters.showAtms &&
          prediction.atms.map((atm) => (
            <Marker
              key={atm.id}
              position={[atm.lat, atm.lng]}
              icon={createAtmIcon(atm.name, atm.risk === 'Critical')}
            >
              <Popup className="tactical-popup" maxWidth={320}>
                <div className="p-3 select-none font-sans text-slate-200">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 mb-2">
                    <span className="font-mono text-xs font-bold text-white uppercase">{atm.id}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        atm.risk === 'Critical'
                          ? 'bg-red-950/70 text-red-400 border border-red-600/40'
                          : 'bg-amber-950/70 text-amber-300 border border-amber-600/40'
                      }`}
                    >
                      {atm.risk} Risk
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-100">{atm.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{atm.bank}</p>
                    
                    <div className="mt-2 p-2 rounded bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10.5px] font-mono text-slate-400 uppercase block">ATM Status</span>
                      <span className={`font-mono text-xs font-bold ${atm.risk === 'Critical' ? 'text-red-400' : 'text-amber-300'}`}>
                        {atm.status}
                      </span>
                    </div>

                    {atm.window && (
                      <div className="text-[11px] text-amber-300 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{atm.window}</span>
                      </div>
                    )}

                    {atm.cctv && (
                      <div className="text-[10.5px] text-slate-400 italic mt-1 border-t border-white/[0.06] pt-1">
                        {atm.cctv}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <MapLegend />
    </div>
  );
};
