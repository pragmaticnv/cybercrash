export interface PredictionEvidence {
  factor: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // 0-100
  description: string;
  metric?: string;
}

export interface ATMCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bank: string;
  risk: 'Critical' | 'High' | 'Medium';
  status: string; // e.g. '₹40,000 Withdrawn' or 'Pending Interception'
  window?: string; // '18:00 – 21:00'
  cctv?: string;
  address?: string;
}

export interface CandidateZone {
  zone: string;
  state: string;
  score: number;
  status: string;
  highlight?: boolean;
}

export interface WithdrawalWindow {
  window: string;
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  label: string;
}

export interface Prediction {
  caseId: string;
  predictedZone: string; // 'GA_Z05'
  confidenceScore: number; // 0.979
  confidencePercent: string; // '97.9%'
  timeWindow: string; // '18:00 – 21:00'
  clusterName: string; // 'ATM CLUSTER #04 · NORTH GOA'
  centerCoordinates: {
    lat: number;
    lng: number;
  };
  radiusMeters: number;
  atms: ATMCluster[];
  candidateZones: CandidateZone[];
  withdrawalWindows: WithdrawalWindow[];
  evidence: PredictionEvidence[];
  modelMetadata: {
    modelName: string;
    version: string;
    inferenceLatencyMs: number;
    featuresEvaluated: number;
    trainingCutoff: string;
  };
}
