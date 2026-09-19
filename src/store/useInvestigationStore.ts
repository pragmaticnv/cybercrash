import { create } from 'zustand';
import { HistoricalCase } from '../types/case';

export type InvestigationMode = 'overview' | 'trace' | 'network' | 'history';

export type BaseMapLayer = 'google-tactical' | 'google-satellite' | 'google-roadmap' | 'carto-dark';

interface InvestigationState {
  selectedCaseId: string | null;
  activeMode: InvestigationMode;
  selectedAccountId: string | null;
  selectedTransactionId: string | null;
  selectedHistoricalCase: HistoricalCase | null;
  technicalDrawerOpen: boolean;
  searchQuery: string;
  selectedBaseLayer: BaseMapLayer;
  mapFilters: {
    showAtms: boolean;
    showCandidateZones: boolean;
    showComplaint: boolean;
  };
  
  // Actions
  setSelectedCaseId: (id: string | null) => void;
  setActiveMode: (mode: InvestigationMode) => void;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedTransactionId: (id: string | null) => void;
  setSelectedHistoricalCase: (hc: HistoricalCase | null) => void;
  setTechnicalDrawerOpen: (open: boolean) => void;
  toggleTechnicalDrawer: () => void;
  setSearchQuery: (query: string) => void;
  setBaseLayer: (layer: BaseMapLayer) => void;
  toggleMapFilter: (key: 'showAtms' | 'showCandidateZones' | 'showComplaint') => void;
  resetInvestigationState: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  selectedCaseId: null,
  activeMode: 'overview',
  selectedAccountId: null,
  selectedTransactionId: null,
  selectedHistoricalCase: null,
  technicalDrawerOpen: false,
  searchQuery: '',
  selectedBaseLayer: 'google-tactical',
  mapFilters: {
    showAtms: true,
    showCandidateZones: true,
    showComplaint: true,
  },

  setSelectedCaseId: (id) => set({ selectedCaseId: id }),
  setActiveMode: (mode) => set({ activeMode: mode }),
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
  setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),
  setSelectedHistoricalCase: (hc) => set({ selectedHistoricalCase: hc }),
  setTechnicalDrawerOpen: (open) => set({ technicalDrawerOpen: open }),
  toggleTechnicalDrawer: () => set((state) => ({ technicalDrawerOpen: !state.technicalDrawerOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBaseLayer: (layer) => set({ selectedBaseLayer: layer }),
  toggleMapFilter: (key) =>
    set((state) => ({
      mapFilters: {
        ...state.mapFilters,
        [key]: !state.mapFilters[key],
      },
    })),
  resetInvestigationState: () =>
    set({
      selectedAccountId: null,
      selectedTransactionId: null,
      selectedHistoricalCase: null,
      technicalDrawerOpen: false,
      activeMode: 'overview',
    }),
}));
