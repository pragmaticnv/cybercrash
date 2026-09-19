export interface Transaction {
  id: string;
  caseId: string;
  sourceId: string;
  targetId: string;
  sourceLabel: string;
  targetLabel: string;
  amount: string;
  amountRaw: number;
  timestamp: string;
  channel: string; // 'IMPS', 'UPI', 'NEFT', 'RTGS', 'Micro-ATM'
  direction: 'inbound' | 'outbound';
  hopLevel: string; // 'Hop 1', 'Hop 2', 'Hop 3', 'Hop 4', 'Cash-out'
  status: 'COMPLETED' | 'PENDING' | 'INTERCEPTED';
  utr?: string;
  stepIndex?: number;
}
