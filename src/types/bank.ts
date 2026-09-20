export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'REVIEWED' | 'CLEARED';

export type AccountInvestigationStatus = 'ACTIVE' | 'FLAGGED FOR REVIEW' | 'REVIEW HOLD ACTIVE' | 'ESCALATED TO I4C' | 'CLEARED';

export type BankChannel = 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'WALLET' | 'CARD' | 'ATM';

export interface BankAccount {
  accountId: string;
  bankId: string;
  bankName: string;
  holderName: string;
  accountType: 'Savings' | 'Current' | 'Salary' | 'Corporate';
  accountAgeDays: number;
  accountStatus: 'ACTIVE' | 'DORMANT' | 'FLAGGED' | 'FROZEN';
  previousAlertCount: number;
  stateCode: string;
  branchName: string;
  ifsc: string;

  // Inflow / Outflow
  incomingAmountTotal: number;
  incomingTransactionCount: number;
  uniqueSenders: number;

  outgoingAmountTotal: number;
  outgoingTransactionCount: number;
  uniqueReceivers: number;

  // Mathematical & Model Indicators
  fundSplitRatio: number;
  transferVelocity: number;
  networkDegree: number;
  networkRiskScore: number;

  // Flags & Notes
  primaryFlag: string;
  kycStatus: string;
  openedDate: string;
  turnoverSummary: string;
  velocityNote: string;
  linkedCaseId?: string;
}

export interface BankTransaction {
  transactionId: string;
  timestamp: string;
  sourceAccount: string;
  sourceBank?: string;
  destinationAccount: string;
  destinationBank?: string;
  destinationHolder?: string;
  amount: number;
  channel: BankChannel;
  transactionDirection: 'CREDIT' | 'DEBIT';
  caseId?: string;
  hop?: number;
  status: 'COMPLETED' | 'FLAGGED' | 'HELD';
  riskLabel?: string;
  isSuspicious: boolean;
}

export interface BankAlert {
  alertId: string;
  severity: AlertSeverity;
  accountId: string;
  accountHolder: string;
  bankId: string;
  transactionId?: string;
  timestamp: string;
  amount?: number;
  reason: string;
  signals: string[];
  status: 'OPEN' | 'REVIEW' | 'ESCALATED' | 'RESOLVED';
  networkRiskScore: number;
  outboundCount: number;
  uniqueReceivers: number;
  paymentChannels: string[];
}

export interface BankRiskSignal {
  id: string;
  label: string;
  observedValue: string;
  category: 'OBSERVED' | 'DERIVED' | 'MODEL_SIGNAL';
  context: string;
  level: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'NORMAL';
}

export interface BankHistoryEvent {
  id: string;
  accountId: string;
  date: string;
  type: 'Alert' | 'Transaction review' | 'KYC Audit' | 'Escalation' | 'Case Link';
  description: string;
  outcome: 'Reviewed' | 'Closed' | 'Escalated' | 'Flagged';
  officerId: string;
  notes?: string;
}

export interface BankLinkedCase {
  caseId: string;
  fraudType: string;
  reportedAmount: string;
  complaintState: string;
  incidentDate: string;
  leaAgency: string;
  primaryMule: string;
}

export interface BankNetworkNodeData {
  id: string;
  label: string;
  subLabel: string;
  accountType?: string;
  bankId?: string;
  networkRiskScore?: number;
  isPrimary?: boolean;
  depth: number;
  amount?: string;
  channel?: string;
  [key: string]: any;
}

export interface BankNetworkEdgeData {
  id: string;
  source: string;
  target: string;
  amount: string;
  channel: string;
  direction: string;
  timestamp: string;
}

export interface BankActivityEvent {
  id: string;
  time: string;
  transactionId: string;
  type: string;
  source: string;
  destination: string;
  amount: string;
  channel: BankChannel;
}
