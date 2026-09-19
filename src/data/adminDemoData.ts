export interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  meta: string;
}

export interface AdminCaseItem {
  id: string;
  fraudType: string;
  assignedAgency: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reportedAmount: string;
  state: string;
  currentStatus: 'ACTIVE' | 'PENDING REVIEW' | 'ESCALATED' | 'RESOLVED';
  createdTime: string;
  predictionStatus: string;
  predictedZone?: string;
  confidence?: string;
  victimName?: string;
  primaryMule?: string;
}

export interface AdminPersonnelItem {
  userId: string;
  name: string;
  role: string;
  agency: string;
  category: 'LEA' | 'BANK' | 'NODAL' | 'ADMIN';
  accessLevel: string;
  status: 'ACTIVE' | 'IDLE' | 'SUSPENDED';
  lastActive: string;
  activeCasesCount: number;
}

export interface AccessMatrixCell {
  allowed: boolean;
  limited?: boolean;
  notes?: string;
}

export interface MLServiceItem {
  name: string;
  category: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  latency: string;
  accuracyOrThroughput: string;
  architecture: string;
  lastInference: string;
}

export interface AuditEventItem {
  id: string;
  timestamp: string;
  userId: string;
  target: string;
  action: string;
  severity: 'INFO' | 'NOTICE' | 'SECURITY' | 'WARNING';
  ipAddress: string;
  agency: string;
}

export interface SystemServiceItem {
  name: string;
  category: string;
  status: 'ONLINE' | 'READY' | 'DEGRADED';
  latency: string;
  endpoint: string;
  uptime: string;
}

// 1. Horizontal System Snapshot Metrics
export const ADMIN_SYSTEM_METRICS: SystemMetric[] = [
  {
    label: 'ACTIVE CASES',
    value: '127',
    change: '+12 today',
    trend: 'up',
    meta: '34 pending triage',
  },
  {
    label: 'CASES PROCESSED',
    value: '1,284',
    change: '+108 this week',
    trend: 'up',
    meta: '89.4% recovery rate',
  },
  {
    label: 'FLAGGED ACCOUNTS',
    value: '346',
    change: '+29 high-risk',
    trend: 'up',
    meta: 'Layer 1-4 mule trails',
  },
  {
    label: 'ACTIVE USERS',
    value: '42',
    change: '4 agencies live',
    trend: 'neutral',
    meta: 'LEA, Banks, Nodal, Admin',
  },
  {
    label: 'MODEL REQUESTS',
    value: '8,921',
    change: 'Avg 18ms latency',
    trend: 'up',
    meta: '99.4% inference uptime',
  },
  {
    label: 'SYSTEM STATUS',
    value: 'OPERATIONAL',
    change: 'NCRP-SIM Active',
    trend: 'neutral',
    meta: 'Gov-Net 256-bit Encrypted',
  },
];

// 2. Case Control Data & Recent Intake Stream
export const ADMIN_CASE_METRICS = {
  active: 127,
  pendingReview: 34,
  escalated: 12,
  resolved: 1108,
};

export const RECENT_CASE_STREAM: AdminCaseItem[] = [
  {
    id: 'CASE_007001',
    fraudType: 'Investment Scam',
    assignedAgency: 'LEA ASSIGNED',
    priority: 'HIGH',
    reportedAmount: '₹1,00,250',
    state: 'Goa (GA)',
    currentStatus: 'ACTIVE',
    createdTime: '12 Sep 2025, 21:14 IST',
    predictionStatus: 'PREDICTED · 97.9% CONF',
    predictedZone: 'GA_Z05',
    confidence: '97.9%',
    victimName: 'R. K. Sharma',
    primaryMule: 'ACC_013041',
  },
  {
    id: 'CASE_006982',
    fraudType: 'Phishing & SMS Spoof',
    assignedAgency: 'BANK REVIEW',
    priority: 'MEDIUM',
    reportedAmount: '₹68,400',
    state: 'Karnataka (KA)',
    currentStatus: 'PENDING REVIEW',
    createdTime: '12 Sep 2025, 19:40 IST',
    predictionStatus: 'ANALYZING GRAPH',
    predictedZone: 'KA_Z03',
    confidence: '84.2%',
    victimName: 'Priya Sundaram',
    primaryMule: 'ACC_088492',
  },
  {
    id: 'CASE_006941',
    fraudType: 'Account Takeover',
    assignedAgency: 'LEA ASSIGNED',
    priority: 'CRITICAL',
    reportedAmount: '₹3,42,000',
    state: 'Maharashtra (MH)',
    currentStatus: 'ESCALATED',
    createdTime: '12 Sep 2025, 18:12 IST',
    predictionStatus: 'HOT ZONE FLAGGED',
    predictedZone: 'MH_Z12',
    confidence: '92.6%',
    victimName: 'Sanjay Deshmukh',
    primaryMule: 'ACC_029412',
  },
  {
    id: 'CASE_006899',
    fraudType: 'Telegram Job Task Scam',
    assignedAgency: 'NODAL COORDINATION',
    priority: 'HIGH',
    reportedAmount: '₹1,85,000',
    state: 'Delhi (DL)',
    currentStatus: 'ACTIVE',
    createdTime: '12 Sep 2025, 16:55 IST',
    predictionStatus: 'PREDICTED · 88.7% CONF',
    predictedZone: 'DL_Z02',
    confidence: '88.7%',
    victimName: 'Aman Verma',
    primaryMule: 'ACC_099144',
  },
  {
    id: 'CASE_006820',
    fraudType: 'SIM Swap / OTP Bypass',
    assignedAgency: 'BANK REVIEW',
    priority: 'LOW',
    reportedAmount: '₹22,500',
    state: 'Gujarat (GJ)',
    currentStatus: 'RESOLVED',
    createdTime: '12 Sep 2025, 14:02 IST',
    predictionStatus: 'CLOSED · FUNDS FROZEN',
    predictedZone: 'GJ_Z08',
    confidence: '96.1%',
    victimName: 'Kirit Patel',
    primaryMule: 'ACC_047291',
  },
];

// 3. User / Role Control Data
export const PERSONNEL_COUNTS = {
  leaOfficers: 18,
  bankUsers: 12,
  nodalOfficers: 8,
  administrators: 4,
};

export const DEMO_PERSONNEL_ROSTER: AdminPersonnelItem[] = [
  {
    userId: 'lea_demo',
    name: 'Insp. Vikram Rathore',
    role: 'LEA INVESTIGATOR',
    agency: 'Law Enforcement Agency (Goa Cyber Cell)',
    category: 'LEA',
    accessLevel: 'CASE INVESTIGATION · TIER 2',
    status: 'ACTIVE',
    lastActive: 'TODAY 14:21',
    activeCasesCount: 6,
  },
  {
    userId: 'bank_demo',
    name: 'Sneha Kulkarni',
    role: 'BANK OFFICER',
    agency: 'State Bank of India — Nodal Risk Team',
    category: 'BANK',
    accessLevel: 'TRANSACTION INTELLIGENCE · TIER 2',
    status: 'ACTIVE',
    lastActive: 'TODAY 14:27',
    activeCasesCount: 14,
  },
  {
    userId: 'nodal_demo',
    name: 'Rajesh Nair',
    role: 'NODAL OFFICER',
    agency: 'I4C / CFCFRMS Central Coordination',
    category: 'NODAL',
    accessLevel: 'CROSS-AGENCY COORDINATION · TIER 1',
    status: 'ACTIVE',
    lastActive: 'TODAY 14:14',
    activeCasesCount: 22,
  },
  {
    userId: 'admin_demo',
    name: 'Cybercrash Command Admin',
    role: 'ADMINISTRATOR',
    agency: 'CYBERCRASH Core Operations',
    category: 'ADMIN',
    accessLevel: 'FULL PLATFORM ADMINISTRATION · ROOT',
    status: 'ACTIVE',
    lastActive: 'JUST NOW',
    activeCasesCount: 0,
  },
  {
    userId: 'lea_mumbai_04',
    name: 'Sub-Insp. Amit Salve',
    role: 'LEA INVESTIGATOR',
    agency: 'Mumbai Police Cyber Crime Cell',
    category: 'LEA',
    accessLevel: 'CASE INVESTIGATION · TIER 2',
    status: 'ACTIVE',
    lastActive: 'TODAY 13:48',
    activeCasesCount: 8,
  },
  {
    userId: 'bank_hdfc_risk',
    name: 'Varun Grover',
    role: 'BANK OFFICER',
    agency: 'HDFC Fraud Monitoring Unit',
    category: 'BANK',
    accessLevel: 'TRANSACTION INTELLIGENCE · TIER 2',
    status: 'IDLE',
    lastActive: 'TODAY 11:15',
    activeCasesCount: 5,
  },
  {
    userId: 'nodal_south_02',
    name: 'Kavitha Raman',
    role: 'NODAL OFFICER',
    agency: 'State Cyber Cell Karnataka',
    category: 'NODAL',
    accessLevel: 'CROSS-AGENCY COORDINATION · TIER 1',
    status: 'ACTIVE',
    lastActive: 'TODAY 12:30',
    activeCasesCount: 11,
  },
];

// 4. Data Access Matrix
export const ACCESS_MATRIX_ROLES = [
  { id: 'lea', label: 'LEA INVESTIGATOR', description: 'Investigates field cases, executes freezes, tracks cash-outs' },
  { id: 'bank', label: 'BANK OFFICER', description: 'Reviews mule accounts, traces ledger entries, executes lien' },
  { id: 'nodal', label: 'NODAL OFFICER', description: 'Coordinates inter-state cases, NCRP ticket routing' },
  { id: 'admin', label: 'ADMINISTRATOR', description: 'System health, operator management, audit enforcement' },
];

export const ACCESS_MATRIX_COLUMNS = [
  'CASE DATA',
  'TRANSACTION DATA',
  'ACCOUNT DATA',
  'NETWORK DATA',
  'ML RESULTS',
  'MAP / LOCATION DATA',
  'AUDIT LOGS',
  'USER MANAGEMENT',
];

// Permission indicators: 'ALLOWED' | 'LIMITED' | 'RESTRICTED'
export const ACCESS_MATRIX_DATA: Record<string, Record<string, 'ALLOWED' | 'LIMITED' | 'RESTRICTED'>> = {
  'LEA INVESTIGATOR': {
    'CASE DATA': 'ALLOWED',
    'TRANSACTION DATA': 'ALLOWED',
    'ACCOUNT DATA': 'LIMITED',
    'NETWORK DATA': 'ALLOWED',
    'ML RESULTS': 'ALLOWED',
    'MAP / LOCATION DATA': 'ALLOWED',
    'AUDIT LOGS': 'LIMITED',
    'USER MANAGEMENT': 'RESTRICTED',
  },
  'BANK OFFICER': {
    'CASE DATA': 'LIMITED',
    'TRANSACTION DATA': 'ALLOWED',
    'ACCOUNT DATA': 'ALLOWED',
    'NETWORK DATA': 'LIMITED',
    'ML RESULTS': 'LIMITED',
    'MAP / LOCATION DATA': 'RESTRICTED',
    'AUDIT LOGS': 'LIMITED',
    'USER MANAGEMENT': 'RESTRICTED',
  },
  'NODAL OFFICER': {
    'CASE DATA': 'ALLOWED',
    'TRANSACTION DATA': 'ALLOWED',
    'ACCOUNT DATA': 'ALLOWED',
    'NETWORK DATA': 'ALLOWED',
    'ML RESULTS': 'ALLOWED',
    'MAP / LOCATION DATA': 'ALLOWED',
    'AUDIT LOGS': 'ALLOWED',
    'USER MANAGEMENT': 'LIMITED',
  },
  'ADMINISTRATOR': {
    'CASE DATA': 'ALLOWED',
    'TRANSACTION DATA': 'ALLOWED',
    'ACCOUNT DATA': 'ALLOWED',
    'NETWORK DATA': 'ALLOWED',
    'ML RESULTS': 'ALLOWED',
    'MAP / LOCATION DATA': 'ALLOWED',
    'AUDIT LOGS': 'ALLOWED',
    'USER MANAGEMENT': 'ALLOWED',
  },
};

// 5. ML Service Status
export const ML_SERVICES: MLServiceItem[] = [
  {
    name: 'ACCOUNT RISK MODEL',
    category: 'Mule Classification',
    status: 'ONLINE',
    latency: '14 ms',
    accuracyOrThroughput: '98.2% ROC-AUC',
    architecture: 'Gradient Boosted Trees (XGBoost Ensemble)',
    lastInference: '1.2s ago',
  },
  {
    name: 'CASE FEATURE ENGINE',
    category: 'Feature Pipeline',
    status: 'ONLINE',
    latency: '8 ms',
    accuracyOrThroughput: '1,420 features/sec',
    architecture: 'Temporal & Velocity Feature Vectorizer',
    lastInference: '0.8s ago',
  },
  {
    name: 'NETWORK ANALYSIS',
    category: 'Graph Intelligence',
    status: 'ONLINE',
    latency: '24 ms',
    accuracyOrThroughput: 'Depth 4 Hop Traversal',
    architecture: 'Directed Mule Flow Graph Miner',
    lastInference: '2.1s ago',
  },
  {
    name: 'PREDICTION ENGINE',
    category: 'Cash-out Geolocation',
    status: 'ONLINE',
    latency: '32 ms',
    accuracyOrThroughput: 'Top-1 ATM Zone 97.9%',
    architecture: 'Spatio-Temporal Spatial Kernel Model',
    lastInference: '2.4s ago',
  },
  {
    name: 'EXPLANATION ENGINE',
    category: 'Forensic Attribution',
    status: 'ONLINE',
    latency: '19 ms',
    accuracyOrThroughput: 'Real-time SHAP Weights',
    architecture: 'TreeSHAP Forensic Attribution Engine',
    lastInference: '3.1s ago',
  },
];

// 6. Data Pipeline Stages
export const DATA_PIPELINE_STAGES = [
  { id: 'feed', name: 'CASE FEED', rate: '24 events/m', status: 'STREAMING', icon: 'Radio' },
  { id: 'tx', name: 'TRANSACTION DATA', rate: '180 tx/s', status: 'INGESTING', icon: 'Layers' },
  { id: 'features', name: 'FEATURE ENGINE', rate: '48 ms sync', status: 'COMPUTING', icon: 'Cpu' },
  { id: 'ml', name: 'ML MODEL', rate: '14 ms inf', status: 'EVALUATING', icon: 'BrainCircuit' },
  { id: 'risk', name: 'RISK / INTELLIGENCE', rate: '97.9% score', status: 'GENERATING', icon: 'ShieldAlert' },
  { id: 'agency', name: 'AUTHORIZED AGENCY', rate: 'Instant dispatch', status: 'DISPATCHED', icon: 'Building2' },
];

// 7. Security Audit Trail
export const INITIAL_AUDIT_EVENTS: AuditEventItem[] = [
  {
    id: 'AUD_90812',
    timestamp: '14:32:04',
    userId: 'lea_demo',
    target: 'CASE_007001',
    action: 'CASE VIEWED',
    severity: 'INFO',
    ipAddress: '10.14.88.21 (Gov-VPN)',
    agency: 'Goa Cyber Crime Cell',
  },
  {
    id: 'AUD_90811',
    timestamp: '14:27:18',
    userId: 'bank_demo',
    target: 'ACC_013041',
    action: 'ACCOUNT DATA REQUESTED',
    severity: 'NOTICE',
    ipAddress: '10.22.104.5 (SBI-Secure)',
    agency: 'State Bank of India',
  },
  {
    id: 'AUD_90810',
    timestamp: '14:21:09',
    userId: 'admin_demo',
    target: 'PORTAL_AUTH',
    action: 'USER LOGIN SUCCESS',
    severity: 'SECURITY',
    ipAddress: '172.16.4.1 (Admin Console)',
    agency: 'CYBERCRASH HQ',
  },
  {
    id: 'AUD_90809',
    timestamp: '14:14:52',
    userId: 'nodal_demo',
    target: 'CASE_006982',
    action: 'STATUS UPDATED (PENDING REVIEW)',
    severity: 'INFO',
    ipAddress: '10.18.201.77 (I4C-Gateway)',
    agency: 'I4C Central Coordination',
  },
  {
    id: 'AUD_90808',
    timestamp: '14:02:11',
    userId: 'lea_mumbai_04',
    target: 'CASE_006941',
    action: 'ESCALATION FLAGGED',
    severity: 'WARNING',
    ipAddress: '10.14.92.14 (MUM-VPN)',
    agency: 'Mumbai Cyber Cell',
  },
  {
    id: 'AUD_90807',
    timestamp: '13:55:40',
    userId: 'ml_system',
    target: 'GA_Z05',
    action: 'CASH-OUT ZONE PREDICTED (97.9%)',
    severity: 'INFO',
    ipAddress: 'INTERNAL_DAEMON',
    agency: 'Predictive Inference Engine',
  },
  {
    id: 'AUD_90806',
    timestamp: '13:41:19',
    userId: 'bank_hdfc_risk',
    target: 'ACC_029412',
    action: 'LIEN PLACED ON PRIMARY MULE',
    severity: 'SECURITY',
    ipAddress: '10.33.12.8 (HDFC-Nodal)',
    agency: 'HDFC Bank Risk',
  },
];

// 8. System Health Diagnostic Services
export const SYSTEM_SERVICES: SystemServiceItem[] = [
  {
    name: 'DATABASE',
    category: 'PostgreSQL Forensic Store',
    status: 'ONLINE',
    latency: '4 ms',
    endpoint: 'db.cybercrash.internal:5432',
    uptime: '99.99%',
  },
  {
    name: 'CASE FEED',
    category: 'NCRP / CFCFRMS Ingestion',
    status: 'ONLINE',
    latency: '12 ms',
    endpoint: 'ncrp-stream.gov.in:9092',
    uptime: '99.96%',
  },
  {
    name: 'TRANSACTION GRAPH',
    category: 'Graph Traversal Engine',
    status: 'ONLINE',
    latency: '18 ms',
    endpoint: 'graph.cybercrash.internal:7687',
    uptime: '99.94%',
  },
  {
    name: 'ML SERVICE',
    category: 'Intelligence & Geolocation',
    status: 'ONLINE',
    latency: '14 ms',
    endpoint: 'ml-cluster.cybercrash.internal:8000',
    uptime: '99.97%',
  },
  {
    name: 'MAP SERVICE',
    category: 'Tactical GIS & Tile Pipeline',
    status: 'READY',
    latency: '8 ms',
    endpoint: 'gis.cybercrash.internal:8080',
    uptime: '100%',
  },
  {
    name: 'AUTHENTICATION',
    category: 'Gov-Net 256-bit Security',
    status: 'ONLINE',
    latency: '6 ms',
    endpoint: 'auth.cybercrash.internal:443',
    uptime: '100%',
  },
];
