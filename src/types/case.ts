export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseStatus = 'ACTIVE INVESTIGATION' | 'UNDER SURVEILLANCE' | 'PENDING REVIEW' | 'CLOSED';

export interface VictimInfo {
  name: string;
  account: string;
  bank: string;
  branch: string;
  amount: string;
  utr?: string;
  contact?: string;
  location?: string;
}

export interface Case {
  id: string; // e.g. 'CASE_007001'
  type: string; // e.g. 'Investment Scam'
  state: string; // e.g. 'Goa'
  stateCode: string; // e.g. 'GA'
  amount: string; // e.g. '₹1,00,250'
  amountRaw: number; // 100250
  status: CaseStatus;
  priority: CasePriority;
  primaryMule: string; // e.g. 'ACC_013041'
  incidentTime: string; // e.g. '12 Sep 2025, 21:14:02 IST'
  complaintTime: string; // e.g. '12 Sep 2025, 23:20'
  predictedZone: string; // e.g. 'GA_Z05'
  riskScore: number; // e.g. 0.979
  riskPercent: string; // e.g. '97.9%'
  timeWindow: string; // e.g. '18:00 – 21:00'
  assignedTo: string; // e.g. 'LEA — Cyber Cell (GA)'
  networkAccounts: number;
  transactionsTraced: number;
  maxDepth: number;
  downstreamAmount: string;
  victim: VictimInfo;
  lastUpdated?: string;
  complaintLocation?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
}

export interface HistoricalCase {
  caseId: string;
  title: string;
  date: string;
  amount: string;
  similarity: number; // e.g. 98.6
  state: string;
  accountInvolved?: string;
  sharedLink: string;
  syndicate: string;
  status: string;
}
