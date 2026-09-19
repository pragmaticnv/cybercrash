import { create } from 'zustand';
import {
  I4CStateSummary,
  I4CNetwork,
  I4CHotspot,
  I4CIntelligenceAlert,
  TimeRange,
  TrendMetric
} from '../types/i4c';
import { i4cStatesData, i4cNetworks, i4cHotspots } from '../data/i4cMockData';

interface I4CStoreState {
  // Selections
  selectedState: I4CStateSummary | null;
  selectedFraudType: string | null;
  selectedNetwork: I4CNetwork | null;
  selectedHotspot: I4CHotspot | null;
  selectedIntelligenceAlert: I4CIntelligenceAlert | null;
  selectedAccountId: string | null;

  // Global filters
  timeRange: TimeRange;
  trendMetric: TrendMetric;
  activeMapLayers: string[];
  searchQuery: string;

  // Drawers
  activeDrawer: 'state' | 'network' | 'hotspot' | 'alert' | 'account' | null;

  // Actions
  setSelectedState: (state: I4CStateSummary | null) => void;
  openStateDrawer: (state: I4CStateSummary) => void;
  openStateById: (stateId: string) => void;

  setSelectedNetwork: (network: I4CNetwork | null) => void;
  openNetworkDrawer: (network: I4CNetwork) => void;
  openNetworkById: (networkId: string) => void;

  setSelectedHotspot: (hotspot: I4CHotspot | null) => void;
  openHotspotDrawer: (hotspot: I4CHotspot) => void;
  openHotspotById: (zoneId: string) => void;

  setSelectedIntelligenceAlert: (alert: I4CIntelligenceAlert | null) => void;
  openAlertDrawer: (alert: I4CIntelligenceAlert) => void;

  openAccountDrawer: (accountId: string) => void;
  closeDrawer: () => void;

  setSelectedFraudType: (fraudType: string | null) => void;
  setTimeRange: (range: TimeRange) => void;
  setTrendMetric: (metric: TrendMetric) => void;
  toggleMapLayer: (layerId: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useI4CStore = create<I4CStoreState>((set) => ({
  selectedState: null,
  selectedFraudType: null,
  selectedNetwork: null,
  selectedHotspot: null,
  selectedIntelligenceAlert: null,
  selectedAccountId: null,

  timeRange: '7D',
  trendMetric: 'cases',
  activeMapLayers: ['fraud_activity', 'predicted_hotspots', 'emerging_risk', 'network_flows'],
  searchQuery: '',
  activeDrawer: null,

  setSelectedState: (state) => set({ selectedState: state }),
  openStateDrawer: (state) => set({ selectedState: state, activeDrawer: 'state' }),
  openStateById: (stateId) => {
    const found = i4cStatesData.find((s) => s.id === stateId || s.name.toLowerCase() === stateId.toLowerCase());
    if (found) {
      set({ selectedState: found, activeDrawer: 'state' });
    }
  },

  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
  openNetworkDrawer: (network) => set({ selectedNetwork: network, activeDrawer: 'network' }),
  openNetworkById: (networkId) => {
    const found = i4cNetworks.find((n) => n.id === networkId);
    if (found) {
      set({ selectedNetwork: found, activeDrawer: 'network' });
    }
  },

  setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
  openHotspotDrawer: (hotspot) => set({ selectedHotspot: hotspot, activeDrawer: 'hotspot' }),
  openHotspotById: (zoneId) => {
    const found = i4cHotspots.find((h) => h.zoneId === zoneId);
    if (found) {
      set({ selectedHotspot: found, activeDrawer: 'hotspot' });
    }
  },

  setSelectedIntelligenceAlert: (alert) => set({ selectedIntelligenceAlert: alert }),
  openAlertDrawer: (alert) => set({ selectedIntelligenceAlert: alert, activeDrawer: 'alert' }),

  openAccountDrawer: (accountId) => set({ selectedAccountId: accountId, activeDrawer: 'account' }),
  closeDrawer: () => set({ activeDrawer: null }),

  setSelectedFraudType: (fraudType) =>
    set((state) => ({
      selectedFraudType: state.selectedFraudType === fraudType ? null : fraudType
    })),

  setTimeRange: (timeRange) => set({ timeRange }),
  setTrendMetric: (trendMetric) => set({ trendMetric }),

  toggleMapLayer: (layerId) =>
    set((state) => ({
      activeMapLayers: state.activeMapLayers.includes(layerId)
        ? state.activeMapLayers.filter((l) => l !== layerId)
        : [...state.activeMapLayers, layerId]
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetFilters: () =>
    set({
      selectedFraudType: null,
      timeRange: '7D',
      trendMetric: 'cases',
      activeMapLayers: ['fraud_activity', 'predicted_hotspots', 'emerging_risk', 'network_flows'],
      searchQuery: ''
    })
}));
