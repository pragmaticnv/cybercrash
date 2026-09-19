/* =====================================================
   CYBERCRASH LEA — Digital Forensic Investigation Data
   ===================================================== */

export const ACTIVE_CASE = {
  id: 'CASE_007001',
  type: 'Investment Scam',
  state: 'Goa',
  stateCode: 'GA',
  amount: '₹1,00,250',
  amountRaw: 100250,
  status: 'ACTIVE INVESTIGATION',
  priority: 'HIGH PRIORITY',
  primaryMule: 'ACC_013041',
  incidentTime: '12 Sep 2025, 21:14:02 IST',
  predictedZone: 'GA_Z05',
  riskScore: 0.979,
  riskPercent: '97.9%',
  timeWindow: '6 – 9 PM',
  assignedTo: 'LEA — Cyber Cell (GA)',
  networkAccounts: 106,
  transactionsTraced: 122,
  maxDepth: 4,
  downstreamAmount: '₹6,90,537',
  victim: {
    name: 'R. K. Sharma',
    account: 'ACC_VICTIM_9901',
    bank: 'State Bank of India',
    branch: 'Panaji Main Branch',
    amount: '₹1,00,250',
    utr: 'UTR892100482910'
  }
};

export const MOCK_CASES = [
  ACTIVE_CASE,
  {
    id: 'CASE_007113',
    type: 'UPI Fraud',
    state: 'Maharashtra',
    stateCode: 'MH',
    amount: '₹45,600',
    amountRaw: 45600,
    status: 'ACTIVE INVESTIGATION',
    priority: 'MEDIUM PRIORITY',
    primaryMule: 'ACC_029412',
    predictedZone: 'MH_Z12',
    riskScore: 0.914,
    riskPercent: '91.4%',
    timeWindow: '3 – 6 PM',
  },
  {
    id: 'CASE_007245',
    type: 'Job Fraud',
    state: 'Karnataka',
    stateCode: 'KA',
    amount: '₹78,300',
    amountRaw: 78300,
    status: 'ACTIVE INVESTIGATION',
    priority: 'MEDIUM PRIORITY',
    primaryMule: 'ACC_031849',
    predictedZone: 'KA_Z08',
    riskScore: 0.876,
    riskPercent: '87.6%',
    timeWindow: '12 – 3 PM',
  },
  {
    id: 'CASE_007301',
    type: 'Phishing',
    state: 'Delhi',
    stateCode: 'DL',
    amount: '₹22,150',
    amountRaw: 22150,
    status: 'UNDER SURVEILLANCE',
    priority: 'LOW PRIORITY',
    primaryMule: 'ACC_049102',
    predictedZone: 'DL_Z03',
    riskScore: 0.821,
    riskPercent: '82.1%',
    timeWindow: '6 – 9 AM',
  },
  {
    id: 'CASE_007412',
    type: 'Loan App Fraud',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    amount: '₹1,25,000',
    amountRaw: 125000,
    status: 'ACTIVE INVESTIGATION',
    priority: 'HIGH PRIORITY',
    primaryMule: 'ACC_051189',
    predictedZone: 'TN_Z07',
    riskScore: 0.789,
    riskPercent: '78.9%',
    timeWindow: '9 – 12 PM',
  },
];

/* ── Progressive Trace Sequence ──────────────────────── */
export const TRACE_STEPS = [
  {
    stepIndex: 0,
    sourceId: 'VICTIM',
    targetId: 'ACC_013041',
    sourceLabel: 'VICTIM (R. K. Sharma)',
    targetLabel: 'ACC_013041 (Primary Mule)',
    amount: '₹1,00,250',
    timestamp: '21:14:02',
    channel: 'IMPS Direct Transfer',
    hopLevel: 'Hop 1'
  },
  {
    stepIndex: 1,
    sourceId: 'ACC_013041',
    targetId: 'ACC_008564',
    sourceLabel: 'ACC_013041',
    targetLabel: 'ACC_008564 (Layer 2 Mule)',
    amount: '₹98,000',
    timestamp: '21:18:14',
    channel: 'NEFT Fast Route',
    hopLevel: 'Hop 2'
  },
  {
    stepIndex: 2,
    sourceId: 'ACC_008564',
    targetId: 'ACC_001276',
    sourceLabel: 'ACC_008564',
    targetLabel: 'ACC_001276 (Split Mule)',
    amount: '₹64,000',
    timestamp: '21:26:25',
    channel: 'RTGS Split',
    hopLevel: 'Hop 3'
  },
  {
    stepIndex: 3,
    sourceId: 'ACC_001276',
    targetId: 'ACC_006877',
    sourceLabel: 'ACC_001276',
    targetLabel: 'ACC_006877 (Syndicate Layer)',
    amount: '₹60,000',
    timestamp: '21:34:50',
    channel: 'Instant Clearing',
    hopLevel: 'Hop 4'
  },
  {
    stepIndex: 4,
    sourceId: 'ACC_006877',
    targetId: 'ATM_GOA_01',
    sourceLabel: 'ACC_006877',
    targetLabel: 'ATM_GOA_01 (Calangute Beach)',
    amount: '₹40,000',
    timestamp: '22:04:10',
    channel: 'Micro-ATM Cashout',
    hopLevel: 'Cash-out'
  },
  {
    stepIndex: 5,
    sourceId: 'ACC_006877',
    targetId: 'ATM_GOA_05',
    sourceLabel: 'ACC_006877',
    targetLabel: 'ATM_GOA_05 (Panaji Market)',
    amount: '₹20,000',
    timestamp: 'PREDICTED 6–9 PM',
    channel: 'ATM Pending Cashout',
    hopLevel: 'Imminent'
  }
];

/* ── Forensic Node Telemetry (Inspector Drawer) ──────── */
export const NODE_TELEMETRY = {
  'VICTIM': {
    id: 'VICTIM',
    label: 'VICTIM ACCOUNT',
    holder: 'R. K. Sharma',
    bank: 'State Bank of India',
    ifsc: 'SBIN0001284',
    branch: 'Panaji Main Branch, Goa',
    role: 'Complainant / Defrauded Investor',
    amount: '₹1,00,250',
    kycStatus: 'Verified (Genuine Aadhar/PAN)',
    device: 'iPhone 14 (Goa IP)',
    flag: 'DEFRAUDED'
  },
  'ACC_013041': {
    id: 'ACC_013041',
    label: 'PRIMARY MULE',
    holder: 'Naveen Kumar',
    bank: 'Axis Bank',
    ifsc: 'UTIB0000841',
    branch: 'Panaji City Branch, Goa',
    role: 'Primary Mule (Layer 1 Recipient)',
    amount: '₹1,00,250',
    kycStatus: 'High Risk (Forged Rent Agreement)',
    openedDate: '18 Aug 2025 (25 days old account)',
    turnover: '₹42,80,000 in last 14 days',
    velocity: 'Rapid outbound transfer within 4m 12s',
    flag: 'PRIMARY TARGET'
  },
  'ACC_008564': {
    id: 'ACC_008564',
    label: 'LAYER 2 MULE',
    holder: 'Suresh Patil',
    bank: 'HDFC Bank',
    ifsc: 'HDFC0001092',
    branch: 'Margao Branch, Goa',
    role: 'Layer 2 Funneling Node',
    amount: '₹98,000 received (₹2,250 cut)',
    kycStatus: 'Compromised Salary Account',
    openedDate: '12 Jan 2023',
    turnover: '₹89,20,000 across 34 cyber cases',
    velocity: 'Instant relay to split mules',
    flag: 'MULE RING HUB'
  },
  'ACC_001276': {
    id: 'ACC_001276',
    label: 'LAYER 3 SPLIT MULE',
    holder: 'Pooja Varma',
    bank: 'ICICI Bank',
    ifsc: 'ICIC0000452',
    branch: 'Vasco Da Gama, Goa',
    role: 'Layer 3 Split & Layering',
    amount: '₹64,000 received',
    kycStatus: 'Dormant Student Account Revived',
    openedDate: '04 Nov 2024',
    turnover: '₹18,50,000',
    velocity: 'Transferred to syndicate aggregator',
    flag: 'LAYERING NODE'
  },
  'ACC_006877': {
    id: 'ACC_006877',
    label: 'FINAL WITHDRAWAL MULE',
    holder: 'Vikram Salgaonkar',
    bank: 'Canara Bank',
    ifsc: 'CNRB0002190',
    branch: 'Mapusa Market, Goa',
    role: 'Cash-out Facilitator',
    amount: '₹60,000 received',
    kycStatus: 'Proxy Account / Mule Card Holder',
    openedDate: '29 Jun 2025',
    turnover: 'Multiple ATM debit card hits',
    velocity: 'Physical ATM withdrawals in progress',
    flag: 'IMMEDIATE FREEZE'
  },
  'ATM_GOA_01': {
    id: 'ATM_GOA_01',
    label: 'CALANGUTE BEACH ATM',
    location: 'Calangute Circle, North Goa (GA_Z05)',
    bank: 'State Bank ATM #GA-092',
    status: '₹40,000 WITHDRAWN at 22:04 IST',
    cctv: 'CCTV Captured: Helmet-wearing individual',
    flag: 'PHYSICAL EXTRACTION'
  },
  'ATM_GOA_05': {
    id: 'ATM_GOA_05',
    label: 'PANAJI MARKET ATM',
    location: 'Panaji Municipal Market, Goa (GA_Z05)',
    bank: 'HDFC Bank ATM #GA-118',
    status: 'PREDICTED PENDING WITHDRAWAL: ₹20,000',
    window: 'High likelihood window: 6 – 9 PM',
    flag: 'INTERCEPTION TARGET'
  }
};

/* ── Network Orbital Topology ────────────────────────── */
export const NETWORK_TOPOLOGY = {
  center: {
    id: 'ACC_013041',
    label: 'ACC_013041',
    type: 'center',
    desc: 'Primary Mule Hub',
    amount: '₹1,00,250',
    risk: 'CRITICAL'
  },
  orbit1_mules: [
    { id: 'ACC_008564', label: 'ACC_008564', role: 'Layer 2 Hop', bank: 'HDFC', amount: '₹98,000' },
    { id: 'ACC_015823', label: 'ACC_015823', role: 'Parallel Layer 2', bank: 'Kotak', amount: '₹1,40,000' },
    { id: 'ACC_009021', label: 'ACC_009021', role: 'Previously Seen', bank: 'SBI', amount: '₹2,10,000' },
    { id: 'ACC_005809', label: 'ACC_005809', role: 'Phishing Mule', bank: 'ICICI', amount: '₹85,000' },
    { id: 'ACC_014794', label: 'ACC_014794', role: 'Remote Scam Hop', bank: 'PNB', amount: '₹3,20,000' },
    { id: 'ACC_001276', label: 'ACC_001276', role: 'Split Layer', bank: 'ICICI', amount: '₹64,000' },
    { id: 'ACC_006877', label: 'ACC_006877', role: 'Cash-out Mule', bank: 'Canara', amount: '₹60,000' },
  ],
  orbit2_cases: [
    { id: 'CASE_009636', label: 'CASE_009636', type: 'Account Takeover', similarity: '98.6%', state: 'Goa' },
    { id: 'CASE_000846', label: 'CASE_000846', type: 'Phishing', similarity: '98.2%', state: 'Maharashtra' },
    { id: 'CASE_008706', label: 'CASE_008706', type: 'Card Fraud', similarity: '97.4%', state: 'Goa' },
    { id: 'CASE_008739', label: 'CASE_008739', type: 'Remote Access Scam', similarity: '96.1%', state: 'Karnataka' },
  ],
  orbit3_infra: [
    { id: 'DEV_98A2', label: 'DEVICE_ID_98A2', desc: 'Shared Android IMEI across 4 Mules' },
    { id: 'IP_103_21', label: 'IP: 103.21.58.4', desc: 'Proxy Exit Node (Mekong Region)' },
    { id: 'SIM_VIRTUAL', label: 'SIM CLUSTER #4', desc: '8 Virtual VoIP numbers routed via Cambodia' }
  ]
};

/* ── Hotspot Geographic Telemetry ────────────────────── */
export const HOTSPOT_DATA = {
  primaryState: 'GOA',
  primaryZone: 'GA_Z05',
  confidenceScore: 97.9,
  status: 'PREDICTED CASHOUT ZONE',
  timeWindow: '6 – 9 PM',
  clusterName: 'ATM CLUSTER #04 · NORTH GOA',
  coordinates: '15.5438° N, 73.7553° E',
  atms: [
    { id: 'ATM_GOA_01', name: 'State Bank ATM — Calangute Circle', lat: 15.544, lng: 73.755, risk: 'High', status: '₹40K Withdrawn' },
    { id: 'ATM_GOA_05', name: 'HDFC ATM — Panaji Market Promenade', lat: 15.498, lng: 73.827, risk: 'Critical', status: 'Pending Interception' },
    { id: 'ATM_GOA_09', name: 'Axis Bank ATM — Candolim Main Road', lat: 15.518, lng: 73.768, risk: 'High', status: 'Patrol Alert Dispatched' }
  ],
  candidateZones: [
    { zone: 'GA_Z05', state: 'Goa', score: 97.9, status: 'PRIMARY TARGET', highlight: true },
    { zone: 'MH_Z12', state: 'Maharashtra (Mumbai South)', score: 91.4, status: 'SECONDARY' },
    { zone: 'KA_Z08', state: 'Karnataka (Bengaluru Central)', score: 87.6, status: 'MONITORED' },
    { zone: 'DL_Z03', state: 'Delhi (South West)', score: 82.1, status: 'MONITORED' },
    { zone: 'TN_Z07', state: 'Tamil Nadu (Chennai Central)', score: 78.9, status: 'LOW PROBABILITY' }
  ],
  withdrawalWindows: [
    { window: '6 – 9 PM', score: 97.9, priority: 'HIGH', label: 'Peak Syndicate Operation Window' },
    { window: '3 – 6 PM', score: 62.3, priority: 'MEDIUM', label: 'Initial Staging Window' },
    { window: '6 – 9 AM', score: 41.7, priority: 'LOW', label: 'Secondary Cleanup Window' }
  ]
};

/* ── Historical Timeline Hybrid ──────────────────────── */
export const HISTORICAL_CASES = [
  {
    caseId: 'CASE_005121',
    title: 'Telegram Fake Stock Investment Scam',
    date: '14 Jul 2025',
    amount: '₹1,45,000',
    similarity: 98.6,
    state: 'Goa (GA)',
    sharedLink: 'Identical mule account hierarchy and same Axis Bank Panaji branch.',
    syndicate: 'Syndicate "Golden Triangle Lotus"',
    status: 'CONVICTED / ASSETS SEIZED'
  },
  {
    caseId: 'CASE_002804',
    title: 'UPI QR Phishing & Rapid Funneling',
    date: '28 May 2025',
    amount: '₹92,000',
    similarity: 98.2,
    state: 'Maharashtra / Goa',
    sharedLink: 'Matching Device Fingerprint DEVICE_ID_98A2 and IMEI sequence.',
    syndicate: 'Syndicate "Golden Triangle Lotus"',
    status: 'ACCOUNTS FROZEN (₹88,000 RECOVERED)'
  },
  {
    caseId: 'CASE_005981',
    title: 'Part-Time Rating Job Scam',
    date: '19 Aug 2025',
    amount: '₹2,10,000',
    similarity: 97.0,
    state: 'Goa (GA)',
    sharedLink: 'Cash-out targeted exact same ATM_GOA_01 (Calangute Beach ATM).',
    syndicate: 'Sub-Cell Margao',
    status: 'UNDER TRIAL'
  },
  {
    caseId: 'CASE_005423',
    title: 'Pre-IPO Allocation WhatsApp Scam',
    date: '02 Jun 2025',
    amount: '₹3,80,000',
    similarity: 95.9,
    state: 'Karnataka / Goa',
    sharedLink: 'Layer 2 Mule ACC_005809 actively linked.',
    syndicate: 'Western Coastal Module',
    status: 'CHARGE SHEET FILED'
  },
  {
    caseId: 'CASE_000496',
    title: 'Digital Arrest Cyber Extortion',
    date: '11 Mar 2025',
    amount: '₹1,20,000',
    similarity: 95.8,
    state: 'Delhi / Goa',
    sharedLink: 'Shared Mekong VPN Gateway IP (103.21.58.4).',
    syndicate: 'Overseas Syndicate Hub',
    status: 'RED CORNER NOTICE ISSUED'
  }
];
