export type TimeRange = '24H' | '7D' | '30D' | '90D';

export type TrendMetric = 'cases' | 'amount' | 'cashouts' | 'networks';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'NOTICE';

export interface I4CNationalSummary {
  activeCases: number;
  activeCasesDelta: string;
  fraudExposure: string;
  fraudExposureDelta: string;
  muleNetworks: number;
  muleNetworksDelta: string;
  predictedHotspots: number;
  predictedHotspotsDelta: string;
  crossStateNetworks: number;
  crossStateNetworksDelta: string;
  lastUpdated: string;
}

export interface I4CStateSummary {
  id: string; // State Code e.g. 'GA'
  name: string; // e.g. 'Goa'
  lat: number;
  lng: number;
  activeCases: number;
  reportedAmount: string;
  amountRaw: number;
  muleAccounts: number;
  activeNetworks: number;
  predictedHotspots: number;
  topFraudType: string;
  topFraudPercent: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  fraudBreakdown: { type: string; percent: number; cases: number }[];
  predictedZones: { zoneId: string; confidence: number; timeWindow: string; dominantFraud: string }[];
  associatedCaseIds: string[];
}

export interface I4CFraudPattern {
  id: string;
  fraudType: string;
  growthPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  currentVolume: number;
  reportedAmount: string;
  affectedStatesCount: number;
  affectedStates: string[];
  emergingHotspotsCount: number;
  sparklineData: { time: string; value: number }[];
}

export interface I4CFraudType {
  type: string;
  cases: number;
  reportedAmount: string;
  amountRaw: number;
  percent: number;
  trend: string;
  statesAffected: number;
  color: string;
}

export interface I4CNetwork {
  id: string; // e.g. 'N-017'
  name: string;
  totalAccounts: number;
  associatedCasesCount: number;
  associatedCaseIds: string[];
  statesCount: number;
  states: string[];
  amountTraced: string;
  amountRaw: number;
  primaryMuleAccount: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  flowPattern: string;
  lastActive: string;
  associatedAccounts: string[];
}

export interface I4CNetworkNode {
  id: string;
  type: 'account' | 'case' | 'state' | 'network';
  label: string;
  subLabel?: string;
  riskScore?: number;
  data: Record<string, any>;
}

export interface I4CNetworkEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface I4CHotspot {
  zoneId: string; // e.g. 'GA_Z05'
  state: string;
  stateCode: string;
  city: string;
  lat: number;
  lng: number;
  modelConfidence: number; // e.g. 97.9
  dominantFraudType: string;
  estimatedWindow: string; // e.g. '18:00–21:00'
  associatedCasesCount: number;
  associatedCaseIds: string[];
  associatedMuleAccountsCount: number;
  associatedMules: string[];
  historicalCashOuts: number;
  atmDensity: 'High' | 'Very High' | 'Medium';
  locationRisk: 'Critical' | 'Severe' | 'Elevated';
  recentActivitySummary: string;
  supportingFactors: string[];
}

export interface I4CIntelligenceAlert {
  id: string;
  category: 'NEW EMERGING HOTSPOT' | 'CROSS-STATE NETWORK' | 'RAPID FRAUD GROWTH' | 'HIGH-VALUE NETWORK' | 'PREDICTION UPDATE';
  title: string;
  targetId: string; // e.g. 'GA_Z05', 'N-017', etc.
  targetType: 'hotspot' | 'network' | 'fraud' | 'case' | 'state';
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  confidence?: number;
  stateCode?: string;
}

export interface I4CNationalTrendPoint {
  time: string;
  cases: number;
  amount: number; // in Lakhs
  cashouts: number;
  networks: number;
}

export interface I4CStateFlow {
  id: string;
  fromState: string;
  fromCoords: [number, number]; // [lat, lng]
  toState: string;
  toCoords: [number, number]; // [lat, lng]
  amount: string;
  txCount: number;
  networkId: string;
  color: string;
}

export interface I4CHistoricalPattern {
  fraudType: string;
  recurringNetworksCount: number;
  linkedCasesCount: number;
  statesCount: number;
  totalLoss: string;
  networkIds: string[];
}

export interface I4CSearchResult {
  id: string;
  type: 'CASE' | 'ACCOUNT' | 'NETWORK' | 'ZONE' | 'TRANSACTION';
  title: string;
  subtitle: string;
  tag?: string;
  targetId: string;
}
