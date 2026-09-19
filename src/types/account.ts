import { HistoricalCase } from './case';

export interface Account {
  id: string; // e.g. 'ACC_013041'
  label: string; // e.g. 'PRIMARY MULE'
  holder: string; // e.g. 'Naveen Kumar'
  bank: string; // e.g. 'Axis Bank' or 'BANK05'
  ifsc: string;
  branch: string;
  role: string;
  accountType: string; // 'Savings', 'Current', 'Compromised Salary'
  accountAgeDays: number; // 1701
  status: 'ACTIVE' | 'FLAGGED' | 'FROZEN' | 'UNDER SURVEILLANCE';
  previousAlerts: number; // 1
  incomingAmount: string; // '₹1,13,973'
  incomingTransactions: number; // 5
  uniqueSenders: number; // 5
  outgoingAmount: string; // '₹53,439'
  outgoingTransactions: number; // 8
  uniqueReceivers: number; // 8
  fundSplitRatio: number; // 0.468874
  networkDegree: number; // 13
  networkRiskScore: number; // 0.285964
  flag: string; // 'PRIMARY TARGET'
  kycStatus: string; // 'High Risk (Forged Rent Agreement)'
  openedDate?: string; // '18 Aug 2025'
  turnover?: string; // '₹42,80,000 in last 14 days'
  velocity?: string; // 'Rapid outbound transfer within 4m 12s'
  historicalCases?: HistoricalCase[];
}
