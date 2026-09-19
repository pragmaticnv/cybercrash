import {
  I4CNationalSummary,
  I4CStateSummary,
  I4CFraudPattern,
  I4CFraudType,
  I4CNetwork,
  I4CHotspot,
  I4CIntelligenceAlert,
  I4CNationalTrendPoint,
  I4CStateFlow,
  I4CHistoricalPattern,
  I4CSearchResult
} from '../types/i4c';

export const i4cNationalSummary: I4CNationalSummary = {
  activeCases: 12482,
  activeCasesDelta: '+8.4% (7d)',
  fraudExposure: '₹184.6 Cr',
  fraudExposureDelta: '+₹14.2 Cr (7d)',
  muleNetworks: 327,
  muleNetworksDelta: '+19 identified',
  predictedHotspots: 42,
  predictedHotspotsDelta: '6 active windows',
  crossStateNetworks: 86,
  crossStateNetworksDelta: '+11 cross-border',
  lastUpdated: 'Live National Feed · 14 Sep 2025, 14:45 IST'
};

export const i4cStatesData: I4CStateSummary[] = [
  {
    id: 'GA',
    name: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    activeCases: 428,
    reportedAmount: '₹8.4 Cr',
    amountRaw: 84000000,
    muleAccounts: 137,
    activeNetworks: 18,
    predictedHotspots: 5,
    topFraudType: 'Investment Scam',
    topFraudPercent: 41,
    riskLevel: 'CRITICAL',
    fraudBreakdown: [
      { type: 'Investment Scam', percent: 41, cases: 175 },
      { type: 'UPI Fraud', percent: 27, cases: 116 },
      { type: 'Phishing', percent: 16, cases: 68 },
      { type: 'Other', percent: 16, cases: 69 }
    ],
    predictedZones: [
      { zoneId: 'GA_Z05', confidence: 97.9, timeWindow: '18:00 – 21:00', dominantFraud: 'Investment Scam' },
      { zoneId: 'GA_Z02', confidence: 89.3, timeWindow: '14:30 – 17:30', dominantFraud: 'UPI Funnel' },
      { zoneId: 'GA_Z08', confidence: 83.7, timeWindow: '20:00 – 23:00', dominantFraud: 'ATM Extraction' }
    ],
    associatedCaseIds: ['CASE_007001', 'CASE_007312', 'CASE_007455']
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    lat: 19.7515,
    lng: 75.7139,
    activeCases: 2940,
    reportedAmount: '₹44.2 Cr',
    amountRaw: 442000000,
    muleAccounts: 812,
    activeNetworks: 64,
    predictedHotspots: 11,
    topFraudType: 'UPI Fraud',
    topFraudPercent: 38,
    riskLevel: 'CRITICAL',
    fraudBreakdown: [
      { type: 'UPI Fraud', percent: 38, cases: 1117 },
      { type: 'Investment Scam', percent: 31, cases: 911 },
      { type: 'Digital Arrest', percent: 19, cases: 558 },
      { type: 'Loan App Fraud', percent: 12, cases: 354 }
    ],
    predictedZones: [
      { zoneId: 'MH_Z12', confidence: 91.4, timeWindow: '14:00 – 18:00', dominantFraud: 'UPI Mule Funnel' },
      { zoneId: 'MH_Z04', confidence: 88.6, timeWindow: '16:00 – 19:30', dominantFraud: 'Cash-out Hub' }
    ],
    associatedCaseIds: ['CASE_007113', 'CASE_007204', 'CASE_007419']
  },
  {
    id: 'KA',
    name: 'Karnataka',
    lat: 15.3173,
    lng: 75.7139,
    activeCases: 1845,
    reportedAmount: '₹29.1 Cr',
    amountRaw: 291000000,
    muleAccounts: 510,
    activeNetworks: 41,
    predictedHotspots: 8,
    topFraudType: 'Account Takeover',
    topFraudPercent: 34,
    riskLevel: 'HIGH',
    fraudBreakdown: [
      { type: 'Account Takeover', percent: 34, cases: 627 },
      { type: 'Investment Scam', percent: 29, cases: 535 },
      { type: 'Phishing', percent: 21, cases: 387 },
      { type: 'UPI Fraud', percent: 16, cases: 296 }
    ],
    predictedZones: [
      { zoneId: 'KA_Z08', confidence: 87.2, timeWindow: '20:00 – 23:00', dominantFraud: 'ATM Dispersion' },
      { zoneId: 'KA_Z03', confidence: 82.5, timeWindow: '12:00 – 15:00', dominantFraud: 'Layer 3 Mule' }
    ],
    associatedCaseIds: ['CASE_007240', 'CASE_007389']
  },
  {
    id: 'DL',
    name: 'Delhi NCR',
    lat: 28.7041,
    lng: 77.1025,
    activeCases: 2180,
    reportedAmount: '₹36.8 Cr',
    amountRaw: 368000000,
    muleAccounts: 645,
    activeNetworks: 52,
    predictedHotspots: 9,
    topFraudType: 'Digital Arrest Scam',
    topFraudPercent: 44,
    riskLevel: 'CRITICAL',
    fraudBreakdown: [
      { type: 'Digital Arrest', percent: 44, cases: 959 },
      { type: 'Investment Scam', percent: 28, cases: 610 },
      { type: 'Remote Access', percent: 18, cases: 392 },
      { type: 'Other', percent: 10, cases: 219 }
    ],
    predictedZones: [
      { zoneId: 'DL_Z03', confidence: 84.6, timeWindow: '17:00 – 20:30', dominantFraud: 'Fast Extraction Hub' }
    ],
    associatedCaseIds: ['CASE_007550', 'CASE_007612']
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    lat: 22.2587,
    lng: 71.1924,
    activeCases: 1120,
    reportedAmount: '₹17.4 Cr',
    amountRaw: 174000000,
    muleAccounts: 320,
    activeNetworks: 27,
    predictedHotspots: 4,
    topFraudType: 'Investment Scam',
    topFraudPercent: 46,
    riskLevel: 'HIGH',
    fraudBreakdown: [
      { type: 'Investment Scam', percent: 46, cases: 515 },
      { type: 'UPI Fraud', percent: 31, cases: 347 },
      { type: 'Loan App Fraud', percent: 23, cases: 258 }
    ],
    predictedZones: [
      { zoneId: 'GJ_Z04', confidence: 76.5, timeWindow: '19:00 – 22:00', dominantFraud: 'Mule Funnel' }
    ],
    associatedCaseIds: ['CASE_007780']
  },
  {
    id: 'TS',
    name: 'Telangana',
    lat: 18.1124,
    lng: 79.0193,
    activeCases: 1340,
    reportedAmount: '₹19.8 Cr',
    amountRaw: 198000000,
    muleAccounts: 390,
    activeNetworks: 33,
    predictedHotspots: 6,
    topFraudType: 'Remote Access Scam',
    topFraudPercent: 36,
    riskLevel: 'HIGH',
    fraudBreakdown: [
      { type: 'Remote Access', percent: 36, cases: 482 },
      { type: 'Investment Scam', percent: 32, cases: 429 },
      { type: 'UPI Fraud', percent: 32, cases: 429 }
    ],
    predictedZones: [
      { zoneId: 'TS_Z07', confidence: 81.3, timeWindow: '15:30 – 18:30', dominantFraud: 'Crypto Gateway Mule' }
    ],
    associatedCaseIds: ['CASE_007890']
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    lat: 27.0238,
    lng: 74.2179,
    activeCases: 950,
    reportedAmount: '₹12.3 Cr',
    amountRaw: 123000000,
    muleAccounts: 290,
    activeNetworks: 24,
    predictedHotspots: 3,
    topFraudType: 'UPI Fraud',
    topFraudPercent: 49,
    riskLevel: 'MODERATE',
    fraudBreakdown: [
      { type: 'UPI Fraud', percent: 49, cases: 465 },
      { type: 'Phishing', percent: 33, cases: 313 },
      { type: 'Other', percent: 18, cases: 172 }
    ],
    predictedZones: [
      { zoneId: 'RJ_Z01', confidence: 79.8, timeWindow: '13:00 – 16:00', dominantFraud: 'Secondary Split' }
    ],
    associatedCaseIds: ['CASE_007955']
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    activeCases: 1420,
    reportedAmount: '₹18.6 Cr',
    amountRaw: 186000000,
    muleAccounts: 460,
    activeNetworks: 36,
    predictedHotspots: 5,
    topFraudType: 'Loan App Fraud',
    topFraudPercent: 42,
    riskLevel: 'HIGH',
    fraudBreakdown: [
      { type: 'Loan App Fraud', percent: 42, cases: 596 },
      { type: 'UPI Fraud', percent: 35, cases: 497 },
      { type: 'Investment Scam', percent: 23, cases: 327 }
    ],
    predictedZones: [
      { zoneId: 'UP_Z09', confidence: 78.2, timeWindow: '18:00 – 21:00', dominantFraud: 'Micro-Split Funnel' }
    ],
    associatedCaseIds: ['CASE_008012']
  }
];

export const i4cFraudPatterns: I4CFraudPattern[] = [
  {
    id: 'pat-1',
    fraudType: 'Investment Scam',
    growthPercent: 34,
    trendDirection: 'up',
    currentVolume: 4280,
    reportedAmount: '₹68.4 Cr',
    affectedStatesCount: 7,
    affectedStates: ['Goa', 'Maharashtra', 'Karnataka', 'Delhi', 'Gujarat', 'Telangana', 'Rajasthan'],
    emergingHotspotsCount: 4,
    sparklineData: [
      { time: 'Day 1', value: 240 },
      { time: 'Day 2', value: 280 },
      { time: 'Day 3', value: 310 },
      { time: 'Day 4', value: 390 },
      { time: 'Day 5', value: 430 },
      { time: 'Day 6', value: 520 },
      { time: 'Day 7', value: 610 }
    ]
  },
  {
    id: 'pat-2',
    fraudType: 'UPI Fraud',
    growthPercent: 21,
    trendDirection: 'up',
    currentVolume: 3890,
    reportedAmount: '₹42.8 Cr',
    affectedStatesCount: 11,
    affectedStates: ['Maharashtra', 'Goa', 'Karnataka', 'Rajasthan', 'Uttar Pradesh', 'Delhi', 'Gujarat', 'Tamil Nadu'],
    emergingHotspotsCount: 3,
    sparklineData: [
      { time: 'Day 1', value: 410 },
      { time: 'Day 2', value: 420 },
      { time: 'Day 3', value: 450 },
      { time: 'Day 4', value: 470 },
      { time: 'Day 5', value: 490 },
      { time: 'Day 6', value: 510 },
      { time: 'Day 7', value: 540 }
    ]
  },
  {
    id: 'pat-3',
    fraudType: 'Remote Access Scam',
    growthPercent: 18,
    trendDirection: 'up',
    currentVolume: 1640,
    reportedAmount: '₹22.1 Cr',
    affectedStatesCount: 5,
    affectedStates: ['Telangana', 'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu'],
    emergingHotspotsCount: 2,
    sparklineData: [
      { time: 'Day 1', value: 160 },
      { time: 'Day 2', value: 175 },
      { time: 'Day 3', value: 185 },
      { time: 'Day 4', value: 190 },
      { time: 'Day 5', value: 215 },
      { time: 'Day 6', value: 230 },
      { time: 'Day 7', value: 250 }
    ]
  },
  {
    id: 'pat-4',
    fraudType: 'Digital Arrest Scam',
    growthPercent: 29,
    trendDirection: 'up',
    currentVolume: 1280,
    reportedAmount: '₹31.5 Cr',
    affectedStatesCount: 6,
    affectedStates: ['Delhi', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Punjab', 'Haryana'],
    emergingHotspotsCount: 3,
    sparklineData: [
      { time: 'Day 1', value: 110 },
      { time: 'Day 2', value: 125 },
      { time: 'Day 3', value: 145 },
      { time: 'Day 4', value: 160 },
      { time: 'Day 5', value: 178 },
      { time: 'Day 6', value: 195 },
      { time: 'Day 7', value: 220 }
    ]
  },
  {
    id: 'pat-5',
    fraudType: 'Loan App Fraud',
    growthPercent: 14,
    trendDirection: 'up',
    currentVolume: 1392,
    reportedAmount: '₹19.8 Cr',
    affectedStatesCount: 8,
    affectedStates: ['Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Bihar', 'Madhya Pradesh'],
    emergingHotspotsCount: 1,
    sparklineData: [
      { time: 'Day 1', value: 180 },
      { time: 'Day 2', value: 185 },
      { time: 'Day 3', value: 190 },
      { time: 'Day 4', value: 195 },
      { time: 'Day 5', value: 200 },
      { time: 'Day 6', value: 208 },
      { time: 'Day 7', value: 215 }
    ]
  }
];

export const i4cFraudTypes: I4CFraudType[] = [
  { type: 'Investment Scam', cases: 4280, reportedAmount: '₹68.4 Cr', amountRaw: 684000000, percent: 34.3, trend: '+34%', statesAffected: 7, color: '#EF4444' },
  { type: 'UPI Fraud', cases: 3890, reportedAmount: '₹42.8 Cr', amountRaw: 428000000, percent: 31.2, trend: '+21%', statesAffected: 11, color: '#F59E0B' },
  { type: 'Digital Arrest', cases: 1280, reportedAmount: '₹31.5 Cr', amountRaw: 315000000, percent: 10.3, trend: '+29%', statesAffected: 6, color: '#EC4899' },
  { type: 'Remote Access', cases: 1640, reportedAmount: '₹22.1 Cr', amountRaw: 221000000, percent: 13.1, trend: '+18%', statesAffected: 5, color: '#38BDF8' },
  { type: 'Loan App Fraud', cases: 1392, reportedAmount: '₹19.8 Cr', amountRaw: 198000000, percent: 11.1, trend: '+14%', statesAffected: 8, color: '#10B981' }
];

export const i4cNetworks: I4CNetwork[] = [
  {
    id: 'N-017',
    name: 'Western Coastal Mule Funnel',
    totalAccounts: 38,
    associatedCasesCount: 17,
    associatedCaseIds: ['CASE_007001', 'CASE_007113', 'CASE_007312', 'CASE_007455'],
    statesCount: 5,
    states: ['Goa', 'Maharashtra', 'Karnataka', 'Telangana', 'Gujarat'],
    amountTraced: '₹42.7 Lakhs',
    amountRaw: 4270000,
    primaryMuleAccount: 'ACC_013041',
    riskLevel: 'CRITICAL',
    flowPattern: 'Split-layer funneling across 3 tiers into coastal ATM clusters',
    lastActive: '12 mins ago',
    associatedAccounts: ['ACC_013041', 'ACC_008833', 'ACC_012691', 'ACC_001097', 'ACC_003639', 'ACC_008564', 'ACC_001276', 'ACC_006877']
  },
  {
    id: 'N-031',
    name: 'NCR Cross-Border Digital Arrest Network',
    totalAccounts: 21,
    associatedCasesCount: 9,
    associatedCaseIds: ['CASE_007550', 'CASE_007612'],
    statesCount: 3,
    states: ['Delhi', 'Uttar Pradesh', 'Haryana'],
    amountTraced: '₹18.4 Lakhs',
    amountRaw: 1840000,
    primaryMuleAccount: 'ACC_029412',
    riskLevel: 'CRITICAL',
    flowPattern: 'Rapid RTGS aggregation followed by simultaneous crypto off-ramps',
    lastActive: '45 mins ago',
    associatedAccounts: ['ACC_029412', 'ACC_034110', 'ACC_049281']
  },
  {
    id: 'N-042',
    name: 'Deccan Micro-Splitting Syndicate',
    totalAccounts: 17,
    associatedCasesCount: 7,
    associatedCaseIds: ['CASE_007240', 'CASE_007890'],
    statesCount: 4,
    states: ['Karnataka', 'Telangana', 'Maharashtra', 'Andhra Pradesh'],
    amountTraced: '₹12.8 Lakhs',
    amountRaw: 1280000,
    primaryMuleAccount: 'ACC_019943',
    riskLevel: 'HIGH',
    flowPattern: 'Sub-₹10,000 UPI velocity bursts across student bank accounts',
    lastActive: '2 hours ago',
    associatedAccounts: ['ACC_019943', 'ACC_022194', 'ACC_038102']
  },
  {
    id: 'N-065',
    name: 'Northern Loan App Mule Pool',
    totalAccounts: 14,
    associatedCasesCount: 6,
    associatedCaseIds: ['CASE_008012'],
    statesCount: 2,
    states: ['Uttar Pradesh', 'Rajasthan'],
    amountTraced: '₹9.2 Lakhs',
    amountRaw: 920000,
    primaryMuleAccount: 'ACC_044219',
    riskLevel: 'ELEVATED',
    flowPattern: 'Virtual account redirection via private NBFC payment gateways',
    lastActive: '4 hours ago',
    associatedAccounts: ['ACC_044219', 'ACC_051280']
  }
];

export const i4cHotspots: I4CHotspot[] = [
  {
    zoneId: 'GA_Z05',
    state: 'Goa',
    stateCode: 'GA',
    city: 'Mapusa / Porvorim Sector',
    lat: 15.5925,
    lng: 73.8150,
    modelConfidence: 97.9,
    dominantFraudType: 'Investment Scam',
    estimatedWindow: '18:00 – 21:00 IST',
    associatedCasesCount: 14,
    associatedCaseIds: ['CASE_007001', 'CASE_007312'],
    associatedMuleAccountsCount: 23,
    associatedMules: ['ACC_013041', 'ACC_008564', 'ACC_006877'],
    historicalCashOuts: 31,
    atmDensity: 'Very High',
    locationRisk: 'Critical',
    recentActivitySummary: 'Cluster of 5 ATM terminals within 800m corridor exhibiting multi-card sequential cash-outs',
    supportingFactors: [
      'ATM Terminal Density: 18 units in 1.2km radius',
      'Historical Cash-Out Confirmations: 31 verified events in past 60 days',
      'High Velocity Layer-3 NEFT/IMPS funnel convergence',
      'Location Risk Multiplier: High tourist/off-highway transient volume'
    ]
  },
  {
    zoneId: 'MH_Z12',
    state: 'Maharashtra',
    stateCode: 'MH',
    city: 'Navi Mumbai Hub',
    lat: 19.0330,
    lng: 73.0297,
    modelConfidence: 91.4,
    dominantFraudType: 'UPI Fraud',
    estimatedWindow: '14:00 – 18:00 IST',
    associatedCasesCount: 19,
    associatedCaseIds: ['CASE_007113'],
    associatedMuleAccountsCount: 34,
    associatedMules: ['ACC_029412', 'ACC_034110'],
    historicalCashOuts: 48,
    atmDensity: 'High',
    locationRisk: 'Severe',
    recentActivitySummary: 'Micro-ATM kiosk aggregations with rapid turnover of merchant QR codes',
    supportingFactors: [
      'POS/Micro-ATM Concentration: 24 active merchant nodes',
      'Cross-district money movement from Goa & Karnataka',
      'Repeated instant withdrawal triggers following SMS notifications'
    ]
  },
  {
    zoneId: 'KA_Z08',
    state: 'Karnataka',
    stateCode: 'KA',
    city: 'Bengaluru Electronic City',
    lat: 12.8399,
    lng: 77.6770,
    modelConfidence: 87.2,
    dominantFraudType: 'Account Takeover',
    estimatedWindow: '20:00 – 23:00 IST',
    associatedCasesCount: 11,
    associatedCaseIds: ['CASE_007240'],
    associatedMuleAccountsCount: 18,
    associatedMules: ['ACC_019943'],
    historicalCashOuts: 22,
    atmDensity: 'Very High',
    locationRisk: 'Elevated',
    recentActivitySummary: 'Night-shift ATM withdrawals using stolen debit card PINs generated via phishing',
    supportingFactors: [
      'High night-time transaction volume masking anomalies',
      'Linked to Network N-042 multi-state funnel',
      'ATM dispersion model indicates 87.2% probability of withdrawal within window'
    ]
  },
  {
    zoneId: 'DL_Z03',
    state: 'Delhi NCR',
    stateCode: 'DL',
    city: 'Rohini Sector 14',
    lat: 28.7180,
    lng: 77.1180,
    modelConfidence: 84.6,
    dominantFraudType: 'Digital Arrest Scam',
    estimatedWindow: '17:00 – 20:30 IST',
    associatedCasesCount: 16,
    associatedCaseIds: ['CASE_007550', 'CASE_007612'],
    associatedMuleAccountsCount: 27,
    associatedMules: ['ACC_034110'],
    historicalCashOuts: 39,
    atmDensity: 'High',
    locationRisk: 'Severe',
    recentActivitySummary: 'Coordinated withdrawals post fraudulent Skype interrogation impersonation calls',
    supportingFactors: [
      'Rapid transfer to 12 distinct bank branches across NCR within 25 minutes',
      'Model detects repeated IP/device access signatures for mule account onboarding'
    ]
  },
  {
    zoneId: 'RJ_Z01',
    state: 'Rajasthan',
    stateCode: 'RJ',
    city: 'Bharatpur Border Cluster',
    lat: 27.2152,
    lng: 77.5030,
    modelConfidence: 79.8,
    dominantFraudType: 'UPI Marketplace Fraud',
    estimatedWindow: '13:00 – 16:00 IST',
    associatedCasesCount: 8,
    associatedCaseIds: ['CASE_007955'],
    associatedMuleAccountsCount: 14,
    associatedMules: ['ACC_051280'],
    historicalCashOuts: 19,
    atmDensity: 'Medium',
    locationRisk: 'Elevated',
    recentActivitySummary: 'Rural CSP (Customer Service Point) withdrawals utilizing biometric authentication bypasses',
    supportingFactors: [
      'CSP kiosk reliance with low surveillance CCTV coverage',
      'Inter-state border proximity allowing swift cross-jurisdictional transit'
    ]
  }
];

export const i4cIntelligenceAlerts: I4CIntelligenceAlert[] = [
  {
    id: 'alt-001',
    category: 'NEW EMERGING HOTSPOT',
    title: 'GA_Z05 Cash-Out Activity Escalation',
    targetId: 'GA_Z05',
    targetType: 'hotspot',
    description: 'Model detects 97.9% probability of withdrawal surge between 18:00–21:00 in Mapusa/Porvorim sector. 14 linked cases detected.',
    severity: 'CRITICAL',
    timestamp: '4 mins ago',
    confidence: 97.9,
    stateCode: 'GA'
  },
  {
    id: 'alt-002',
    category: 'CROSS-STATE NETWORK',
    title: 'Syndicate N-017 Expanding into Karnataka',
    targetId: 'N-017',
    targetType: 'network',
    description: '38 accounts identified across 5 states with ₹42.7L traced funds funneling from Goa into Belagavi and Mumbai.',
    severity: 'HIGH',
    timestamp: '18 mins ago',
    stateCode: 'GA'
  },
  {
    id: 'alt-003',
    category: 'RAPID FRAUD GROWTH',
    title: 'Investment Scam Spike (+34% above baseline)',
    targetId: 'Investment Scam',
    targetType: 'fraud',
    description: 'Algorithmic surge alert: 7 states affected, 4 new cash-out zones emerging with 4,280 active reported incidents.',
    severity: 'HIGH',
    timestamp: '32 mins ago'
  },
  {
    id: 'alt-004',
    category: 'HIGH-VALUE NETWORK',
    title: 'Syndicate N-031 Detected in NCR',
    targetId: 'N-031',
    targetType: 'network',
    description: 'High-velocity RTGS transfers totaling ₹18.4L traced to Digital Arrest extortion operations.',
    severity: 'CRITICAL',
    timestamp: '1 hour ago',
    stateCode: 'DL'
  },
  {
    id: 'alt-005',
    category: 'PREDICTION UPDATE',
    title: 'MH_Z12 Confidence Calibrated to 91.4%',
    targetId: 'MH_Z12',
    targetType: 'hotspot',
    description: 'Model recalculation incorporates 3 new cases reported within 45 mins. Window narrowed to 14:00–18:00.',
    severity: 'ELEVATED',
    timestamp: '1.5 hours ago',
    confidence: 91.4,
    stateCode: 'MH'
  }
];

export const i4cStateFlows: I4CStateFlow[] = [
  {
    id: 'flow-1',
    fromState: 'Goa',
    fromCoords: [15.2993, 74.1240],
    toState: 'Karnataka',
    toCoords: [15.3173, 75.7139],
    amount: '₹34.8L',
    txCount: 42,
    networkId: 'N-017',
    color: '#EF4444'
  },
  {
    id: 'flow-2',
    fromState: 'Karnataka',
    fromCoords: [15.3173, 75.7139],
    toState: 'Maharashtra',
    toCoords: [19.7515, 75.7139],
    amount: '₹28.4L',
    txCount: 36,
    networkId: 'N-017',
    color: '#F59E0B'
  },
  {
    id: 'flow-3',
    fromState: 'Telangana',
    fromCoords: [18.1124, 79.0193],
    toState: 'Karnataka',
    toCoords: [15.3173, 75.7139],
    amount: '₹19.2L',
    txCount: 24,
    networkId: 'N-042',
    color: '#38BDF8'
  },
  {
    id: 'flow-4',
    fromState: 'Delhi NCR',
    fromCoords: [28.7041, 77.1025],
    toState: 'Gujarat',
    toCoords: [22.2587, 71.1924],
    amount: '₹22.6L',
    txCount: 19,
    networkId: 'N-031',
    color: '#EC4899'
  },
  {
    id: 'flow-5',
    fromState: 'Uttar Pradesh',
    fromCoords: [26.8467, 80.9462],
    toState: 'Rajasthan',
    toCoords: [27.0238, 74.2179],
    amount: '₹14.1L',
    txCount: 16,
    networkId: 'N-065',
    color: '#10B981'
  }
];

export const i4cNationalTrends: Record<'24H' | '7D' | '30D' | '90D', I4CNationalTrendPoint[]> = {
  '24H': [
    { time: '00:00', cases: 380, amount: 48, cashouts: 12, networks: 82 },
    { time: '04:00', cases: 210, amount: 26, cashouts: 6, networks: 78 },
    { time: '08:00', cases: 460, amount: 62, cashouts: 18, networks: 94 },
    { time: '12:00', cases: 890, amount: 135, cashouts: 38, networks: 142 },
    { time: '16:00', cases: 1140, amount: 192, cashouts: 54, networks: 178 },
    { time: '20:00', cases: 1380, amount: 240, cashouts: 68, networks: 210 },
    { time: '23:59', cases: 940, amount: 154, cashouts: 42, networks: 165 }
  ],
  '7D': [
    { time: 'Mon', cases: 1620, amount: 220, cashouts: 34, networks: 190 },
    { time: 'Tue', cases: 1740, amount: 245, cashouts: 38, networks: 205 },
    { time: 'Wed', cases: 1890, amount: 280, cashouts: 44, networks: 232 },
    { time: 'Thu', cases: 2120, amount: 310, cashouts: 51, networks: 260 },
    { time: 'Fri', cases: 2450, amount: 385, cashouts: 62, networks: 295 },
    { time: 'Sat', cases: 2840, amount: 440, cashouts: 74, networks: 320 },
    { time: 'Sun', cases: 2280, amount: 350, cashouts: 56, networks: 302 }
  ],
  '30D': [
    { time: 'Week 1', cases: 7800, amount: 980, cashouts: 180, networks: 210 },
    { time: 'Week 2', cases: 8900, amount: 1240, cashouts: 215, networks: 254 },
    { time: 'Week 3', cases: 10400, amount: 1520, cashouts: 270, networks: 298 },
    { time: 'Week 4', cases: 12482, amount: 1846, cashouts: 340, networks: 327 }
  ],
  '90D': [
    { time: 'Month 1', cases: 24000, amount: 3400, cashouts: 610, networks: 190 },
    { time: 'Month 2', cases: 31000, amount: 4600, cashouts: 840, networks: 260 },
    { time: 'Month 3', cases: 42500, amount: 6200, cashouts: 1180, networks: 327 }
  ]
};

export const i4cHistoricalPatterns: I4CHistoricalPattern[] = [
  {
    fraudType: 'Investment Scam',
    recurringNetworksCount: 14,
    linkedCasesCount: 63,
    statesCount: 9,
    totalLoss: '₹14.8 Cr',
    networkIds: ['N-017', 'N-031']
  },
  {
    fraudType: 'UPI Funnel Syndicate',
    recurringNetworksCount: 8,
    linkedCasesCount: 41,
    statesCount: 11,
    totalLoss: '₹9.4 Cr',
    networkIds: ['N-017', 'N-042']
  },
  {
    fraudType: 'Digital Arrest Scheme',
    recurringNetworksCount: 6,
    linkedCasesCount: 29,
    statesCount: 5,
    totalLoss: '₹11.2 Cr',
    networkIds: ['N-031']
  }
];

export const i4cSearchDatabase: I4CSearchResult[] = [
  { id: 'CASE_007001', type: 'CASE', title: 'CASE_007001', subtitle: 'Investment Scam · Goa (₹1,00,250)', tag: 'PRIORITY HIGH', targetId: 'CASE_007001' },
  { id: 'CASE_007113', type: 'CASE', title: 'CASE_007113', subtitle: 'UPI Fraud · Maharashtra (₹45,600)', tag: 'ACTIVE', targetId: 'CASE_007113' },
  { id: 'CASE_007240', type: 'CASE', title: 'CASE_007240', subtitle: 'Account Takeover · Karnataka (₹78,000)', tag: 'ACTIVE', targetId: 'CASE_007240' },
  { id: 'ACC_013041', type: 'ACCOUNT', title: 'ACC_013041', subtitle: 'Primary Mule Hub · Axis Bank (Goa)', tag: 'SUSPECTED MULE', targetId: 'ACC_013041' },
  { id: 'ACC_008564', type: 'ACCOUNT', title: 'ACC_008564', subtitle: 'Layer 2 Mule Hub · HDFC Bank (Margao)', tag: 'LINKED MULE', targetId: 'ACC_008564' },
  { id: 'ACC_006877', type: 'ACCOUNT', title: 'ACC_006877', subtitle: 'Cash-out Mule · Canara Bank (Mapusa)', tag: 'ATM CASH-OUT', targetId: 'ACC_006877' },
  { id: 'N-017', type: 'NETWORK', title: 'NETWORK N-017', subtitle: '38 accounts · 17 cases · 5 states (₹42.7L)', tag: 'CRITICAL SYNDICATE', targetId: 'N-017' },
  { id: 'N-031', type: 'NETWORK', title: 'NETWORK N-031', subtitle: '21 accounts · 9 cases · 3 states (₹18.4L)', tag: 'DIGITAL ARREST', targetId: 'N-031' },
  { id: 'GA_Z05', type: 'ZONE', title: 'ZONE GA_Z05', subtitle: 'Mapusa/Porvorim Sector · Confidence: 97.9%', tag: 'ACTIVE WINDOW', targetId: 'GA_Z05' },
  { id: 'MH_Z12', type: 'ZONE', title: 'ZONE MH_Z12', subtitle: 'Navi Mumbai Hub · Confidence: 91.4%', tag: 'PREDICTED', targetId: 'MH_Z12' },
  { id: 'UTR892100482910', type: 'TRANSACTION', title: 'UTR892100482910', subtitle: '₹1,00,250 · IMPS Transfer (Victim → Primary Mule)', tag: 'INITIAL LOSS', targetId: 'UTR892100482910' }
];
