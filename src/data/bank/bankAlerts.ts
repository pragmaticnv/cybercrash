import { BankAlert } from '../../types/bank';

export const BANK_ALERTS: BankAlert[] = [
  {
    alertId: 'ALT_009182',
    severity: 'HIGH',
    accountId: 'ACC_013041',
    accountHolder: 'Naveen Kumar',
    bankId: 'BANK05',
    transactionId: 'TXN_0066249',
    timestamp: '12 Sep 2025, 23:24 IST (4m post-credit)',
    amount: 53439,
    reason: 'Rapid outbound movement following ₹1,00,250 inflow',
    signals: [
      '8 outgoing transactions within 90 minutes',
      '8 unique receivers across multiple branches',
      '4 distinct payment channels (UPI, IMPS, RTGS, WALLET)',
      'Transfer velocity index: 0.141'
    ],
    status: 'OPEN',
    networkRiskScore: 0.285964,
    outboundCount: 8,
    uniqueReceivers: 8,
    paymentChannels: ['UPI', 'IMPS', 'RTGS', 'WALLET']
  },
  {
    alertId: 'ALT_009185',
    severity: 'CRITICAL',
    accountId: 'ACC_008564',
    accountHolder: 'Suresh Patil',
    bankId: 'BANK05',
    transactionId: 'TXN_0120194',
    timestamp: '13 Sep 2025, 02:16 IST',
    amount: 88000,
    reason: 'Layer 2 Funneling aggregation & high-velocity split',
    signals: [
      'Repeated instant debit transfers to dormant student accounts',
      'Account turnover ₹89.2L flagged across 34 cyber crime cells',
      'High network degree: 16 connected nodes'
    ],
    status: 'OPEN',
    networkRiskScore: 0.8124,
    outboundCount: 4,
    uniqueReceivers: 4,
    paymentChannels: ['RTGS', 'NEFT']
  },
  {
    alertId: 'ALT_009190',
    severity: 'CRITICAL',
    accountId: 'ACC_006877',
    accountHolder: 'Vikram Salgaonkar',
    bankId: 'BANK05',
    transactionId: 'TXN_0124810',
    timestamp: '13 Sep 2025, 03:04 IST',
    amount: 60000,
    reason: 'Terminal cash-out staging at predicted Mapusa ATM corridor',
    signals: [
      '100% fund drain ratio within 4 minutes of IMPS credit',
      'Account age < 90 days with zero prior domestic utility payments',
      'Predicted cash-out zone match: GA_Z05 (97.9% ML Confidence)'
    ],
    status: 'OPEN',
    networkRiskScore: 0.9412,
    outboundCount: 3,
    uniqueReceivers: 1,
    paymentChannels: ['IMPS', 'ATM']
  },
  {
    alertId: 'ALT_008940',
    severity: 'MEDIUM',
    accountId: 'ACC_008833',
    accountHolder: 'Sunil G.',
    bankId: 'BANK05',
    transactionId: 'TXN_0097457',
    timestamp: '12 Sep 2025, 18:40 IST',
    amount: 12751,
    reason: 'Unusual wallet load and rapid UPI micro-settlement',
    signals: [
      'Sudden revival of dormant savings balance',
      'Multi-channel conversion within single banking session'
    ],
    status: 'REVIEW',
    networkRiskScore: 0.512,
    outboundCount: 1,
    uniqueReceivers: 1,
    paymentChannels: ['WALLET', 'UPI']
  }
];
