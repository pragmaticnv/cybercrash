import { BankHistoryEvent, BankLinkedCase } from '../../types/bank';

export const BANK_HISTORY_EVENTS: Record<string, BankHistoryEvent[]> = {
  'ACC_013041': [
    {
      id: 'HIST_01',
      accountId: 'ACC_013041',
      date: '2025-08-14',
      type: 'Alert',
      description: 'Unusual outbound velocity trigger following high-value IMPS inbound',
      outcome: 'Reviewed',
      officerId: 'OPERATOR_492 (Anti-Fraud Desk)',
      notes: 'Customer contacted; confirmed mobile app login with genuine biometric pass.'
    },
    {
      id: 'HIST_02',
      accountId: 'ACC_013041',
      date: '2025-06-02',
      type: 'Transaction review',
      description: 'Multiple receivers fan-out pattern observed during business hours',
      outcome: 'Closed',
      officerId: 'SYSTEM_AUDITOR',
      notes: 'Transaction volume beneath STR escalation threshold.'
    },
    {
      id: 'HIST_03',
      accountId: 'ACC_013041',
      date: '2025-04-19',
      type: 'Alert',
      description: 'Rapid fund movement from new corporate beneficiary',
      outcome: 'Escalated',
      officerId: 'ANALYST_081',
      notes: 'Escalated to internal AML Risk Committee for address re-verification.'
    }
  ],
  'ACC_008564': [
    {
      id: 'HIST_04',
      accountId: 'ACC_008564',
      date: '2025-07-22',
      type: 'Alert',
      description: 'Bulk IMPS settlement bursts to unverified rural accounts',
      outcome: 'Flagged',
      officerId: 'SYSTEM_AUDITOR',
      notes: 'Temporary limits placed on mobile banking daily outbound cap.'
    }
  ]
};

export const BANK_LINKED_CASES: Record<string, BankLinkedCase[]> = {
  'ACC_013041': [
    {
      caseId: 'CASE_007001',
      fraudType: 'Investment Scam',
      reportedAmount: '₹1,00,250',
      complaintState: 'Goa',
      incidentDate: '12 Sep 2025',
      leaAgency: 'Cyber Crime Cell (Goa)',
      primaryMule: 'ACC_013041'
    },
    {
      caseId: 'CASE_008706',
      fraudType: 'Card Fraud & Impersonation',
      reportedAmount: '₹2,61,725',
      complaintState: 'Odisha',
      incidentDate: '28 Jul 2025',
      leaAgency: 'Bhubaneswar Cyber Cell',
      primaryMule: 'ACC_013041'
    }
  ],
  'ACC_008564': [
    {
      caseId: 'CASE_007001',
      fraudType: 'Investment Scam',
      reportedAmount: '₹1,00,250',
      complaintState: 'Goa',
      incidentDate: '12 Sep 2025',
      leaAgency: 'Cyber Crime Cell (Goa)',
      primaryMule: 'ACC_013041'
    }
  ]
};
