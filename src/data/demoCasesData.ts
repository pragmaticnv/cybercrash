export interface DemoCasePreset {
  case_id: string;
  fraud_type: string;
  reported_amount: number;
  complaint_state: string;
  primary_account: string;
  title: string;
  badge: string;
  description: string;
  transactions: {
    source_account: string;
    destination_account: string;
    amount: number;
    timestamp: string;
  }[];
}

export const DEMO_CASE_PRESETS: Record<string, DemoCasePreset> = {
  LIVE_DEMO_001: {
    case_id: 'LIVE_DEMO_001',
    fraud_type: 'Investment Scam',
    reported_amount: 150000,
    complaint_state: 'GA',
    primary_account: 'ACC_013041',
    title: 'Investment Scam · Panaji, Goa',
    badge: 'LIVE BENCHMARK',
    description: 'High-yield stock trading scheme with rapid 3-tier outbound relay terminating at Panaji coastal ATMs.',
    transactions: [
      { source_account: 'ACC_013041', destination_account: 'ACC_010028', amount: 80000, timestamp: '2026-09-19T18:15:00' },
      { source_account: 'ACC_010028', destination_account: 'ACC_012795', amount: 50000, timestamp: '2026-09-19T18:35:00' },
      { source_account: 'ACC_012795', destination_account: 'ACC_006625', amount: 30000, timestamp: '2026-09-19T18:50:00' }
    ]
  },
  LIVE_DEMO_002: {
    case_id: 'LIVE_DEMO_002',
    fraud_type: 'UPI Fraud',
    reported_amount: 275000,
    complaint_state: 'PB',
    primary_account: 'NEW_MULE_001',
    title: 'UPI Fraud · Amritsar, Punjab',
    badge: 'INTER-STATE CORRIDOR',
    description: 'Deceptive QR code & UPI mandate relay funneling proceeds through Punjab into Western laundering nodes.',
    transactions: [
      { source_account: 'NEW_MULE_001', destination_account: 'ACC_010028', amount: 100000, timestamp: '2026-09-19T17:30:00' },
      { source_account: 'ACC_010028', destination_account: 'NEW_ACC_001', amount: 70000, timestamp: '2026-09-19T17:55:00' },
      { source_account: 'NEW_ACC_001', destination_account: 'ACC_012795', amount: 50000, timestamp: '2026-09-19T18:20:00' },
      { source_account: 'NEW_ACC_001', destination_account: 'NEW_ACC_002', amount: 30000, timestamp: '2026-09-19T18:40:00' }
    ]
  },
  LIVE_DEMO_003: {
    case_id: 'LIVE_DEMO_003',
    fraud_type: 'Marketplace Fraud',
    reported_amount: 250000,
    complaint_state: 'TN',
    primary_account: 'NEW_MULE_002',
    title: 'Marketplace Fraud · Chennai, Tamil Nadu',
    badge: 'HIGH VELOCITY',
    description: 'E-commerce marketplace escrow diversion across multi-tier regional syndicate cash-out clusters.',
    transactions: [
      { source_account: 'NEW_MULE_002', destination_account: 'NEW_ACC_101', amount: 90000, timestamp: '2026-09-19T16:10:00' },
      { source_account: 'NEW_ACC_101', destination_account: 'NEW_ACC_102', amount: 60000, timestamp: '2026-09-19T16:45:00' },
      { source_account: 'NEW_ACC_102', destination_account: 'NEW_ACC_103', amount: 40000, timestamp: '2026-09-19T17:15:00' },
      { source_account: 'NEW_ACC_101', destination_account: 'NEW_ACC_104', amount: 20000, timestamp: '2026-09-19T17:35:00' }
    ]
  },
  DEMO_EXISTING_001: {
    case_id: 'DEMO_EXISTING_001',
    fraud_type: 'Investment Scam',
    reported_amount: 150000,
    complaint_state: 'GA',
    primary_account: 'ACC_013041',
    title: 'Pre-Existing Mule Syndicate · Western Hub',
    badge: 'HISTORICAL NETWORK',
    description: 'Benchmark scenario evaluating ML model detection speed against established layer-2 mule accounts.',
    transactions: [
      { source_account: 'ACC_013041', destination_account: 'ACC_010028', amount: 80000, timestamp: '2026-09-19T18:15:00' },
      { source_account: 'ACC_010028', destination_account: 'ACC_012795', amount: 50000, timestamp: '2026-09-19T18:35:00' },
      { source_account: 'ACC_012795', destination_account: 'ACC_006625', amount: 30000, timestamp: '2026-09-19T18:50:00' }
    ]
  },
  DEMO_MIXED_001: {
    case_id: 'DEMO_MIXED_001',
    fraud_type: 'UPI Fraud',
    reported_amount: 275000,
    complaint_state: 'PB',
    primary_account: 'NEW_MULE_001',
    title: 'Cross-Border Relay Network · Northern Sector',
    badge: 'MIXED NODES',
    description: 'Multi-jurisdictional relay testing spatial transit corridor classification and extraction time window.',
    transactions: [
      { source_account: 'NEW_MULE_001', destination_account: 'ACC_010028', amount: 100000, timestamp: '2026-09-19T17:30:00' },
      { source_account: 'ACC_010028', destination_account: 'NEW_ACC_001', amount: 70000, timestamp: '2026-09-19T17:55:00' },
      { source_account: 'NEW_ACC_001', destination_account: 'ACC_012795', amount: 50000, timestamp: '2026-09-19T18:20:00' },
      { source_account: 'NEW_ACC_001', destination_account: 'NEW_ACC_002', amount: 30000, timestamp: '2026-09-19T18:40:00' }
    ]
  },
  DEMO_NEW_001: {
    case_id: 'DEMO_NEW_001',
    fraud_type: 'Marketplace Fraud',
    reported_amount: 250000,
    complaint_state: 'TN',
    primary_account: 'NEW_MULE_002',
    title: 'Rapid Zero-Shot Mule Ring · Southern Grid',
    badge: 'NEW ACCOUNTS',
    description: 'Freshly activated unmapped mule ring testing real-time XGBoost geolocation model generalization.',
    transactions: [
      { source_account: 'NEW_MULE_002', destination_account: 'NEW_ACC_101', amount: 90000, timestamp: '2026-09-19T16:10:00' },
      { source_account: 'NEW_ACC_101', destination_account: 'NEW_ACC_102', amount: 60000, timestamp: '2026-09-19T16:45:00' },
      { source_account: 'NEW_ACC_102', destination_account: 'NEW_ACC_103', amount: 40000, timestamp: '2026-09-19T17:15:00' },
      { source_account: 'NEW_ACC_101', destination_account: 'NEW_ACC_104', amount: 20000, timestamp: '2026-09-19T17:35:00' }
    ]
  }
};
