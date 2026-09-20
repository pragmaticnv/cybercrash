import { create } from 'zustand';
import { Case } from '../types/case';
import { Prediction } from '../types/prediction';
import { BankAccount, BankAlert, BankTransaction } from '../types/bank';
import { I4CIntelligenceAlert } from '../types/i4c';
import { apiFetch } from '../api/apiClient';

// Built-in initial state for LIVE_DEMO_001 so frontend immediately renders without delay
const INITIAL_DEMO_CASE: Case = {
  id: 'LIVE_DEMO_001',
  type: 'Investment Scam',
  state: 'Goa',
  stateCode: 'GA',
  amount: '₹1,50,000',
  amountRaw: 150000,
  status: 'ACTIVE INVESTIGATION',
  priority: 'CRITICAL',
  primaryMule: 'ACC_013041',
  incidentTime: '19 Sep 2026, 18:15:00',
  complaintTime: '19 Sep 2026, 18:30',
  predictedZone: 'GA_Z05',
  riskScore: 0.979,
  riskPercent: '97.9%',
  timeWindow: '18:00 – 21:00',
  assignedTo: 'LEA — Goa Cyber Cell',
  networkAccounts: 4,
  transactionsTraced: 3,
  maxDepth: 3,
  downstreamAmount: '₹1,12,500',
  lastUpdated: 'Live ML Stream',
  victim: {
    name: 'Complainant Reference (Panaji)',
    account: 'ACC_VICTIM_DEMO1',
    bank: 'State Bank of India',
    branch: 'Panaji Main Branch',
    amount: '₹1,50,000',
    utr: 'UTR892100481239',
    contact: '+91 98230 48123',
    location: 'Panaji, Goa'
  },
  complaintLocation: {
    city: 'Panaji',
    state: 'Goa',
    lat: 15.4909,
    lng: 73.8278
  }
};

const INITIAL_PREDICTION: Prediction = {
  caseId: 'LIVE_DEMO_001',
  predictedZone: 'GA_Z05',
  confidenceScore: 0.979,
  confidencePercent: '97.9%',
  timeWindow: '18:00 – 21:00',
  clusterName: 'ATM CLUSTER · NORTH GOA EXTRACTION ZONE',
  centerCoordinates: {
    lat: 15.5925,
    lng: 73.8135
  },
  radiusMeters: 2500,
  atms: [
    {
      id: 'ATM_GA_Z05_01',
      name: 'SBI ATM — Calangute Promenade',
      lat: 15.5432,
      lng: 73.7554,
      bank: 'State Bank of India',
      risk: 'Critical',
      status: 'Primary Target Withdrawal Point',
      window: '18:00 – 21:00',
      cctv: 'Real-Time Intercept Ready'
    },
    {
      id: 'ATM_GA_Z05_02',
      name: 'HDFC Bank ATM — Panaji Market Hub',
      lat: 15.4989,
      lng: 73.8278,
      bank: 'HDFC Bank',
      risk: 'High',
      status: 'Secondary Layer Withdrawal',
      window: '18:00 – 21:00',
      cctv: 'Real-Time Intercept Ready'
    },
    {
      id: 'ATM_GA_Z05_03',
      name: 'Axis Bank ATM — Mapusa Bus Stand',
      lat: 15.5925,
      lng: 73.8135,
      bank: 'Axis Bank',
      risk: 'High',
      status: 'Surveillance Point',
      window: '18:00 – 21:00',
      cctv: 'Real-Time Intercept Ready'
    }
  ],
  candidateZones: [
    { zone: 'GA_Z05', state: 'GA', score: 97.9, status: 'TARGET', highlight: true },
    { zone: 'GA_Z02', state: 'GA', score: 84.5, status: 'CANDIDATE' },
    { zone: 'MH_Z12', state: 'MH', score: 76.2, status: 'CANDIDATE' },
    { zone: 'KA_Z08', state: 'KA', score: 68.4, status: 'CANDIDATE' },
    { zone: 'GA_Z01', state: 'GA', score: 61.3, status: 'CANDIDATE' }
  ],
  withdrawalWindows: [
    { window: '18:00 – 21:00', score: 92, priority: 'HIGH', label: 'Primary Extraction Window' },
    { window: '15:00 – 18:00', score: 64, priority: 'MEDIUM', label: 'Secondary Influx Window' },
    { window: '21:00 – 24:00', score: 38, priority: 'LOW', label: 'Late Night Dispersal' }
  ],
  evidence: [
    { factor: 'Target Mule Proximity', level: 'HIGH', score: 96, description: 'ACC_013041 primary syndicate node in Goa corridor', metric: 'Score 0.979' },
    { factor: 'High-Density Cash-Out Points', level: 'HIGH', score: 91, description: 'Dense cluster of 12 commercial ATMs within 2.5km radius', metric: 'Density Index 0.88' },
    { factor: 'Transaction Rapidity Vector', level: 'HIGH', score: 88, description: 'Inter-account layering initiated within 20 minutes', metric: 'Split ratio 0.85' }
  ],
  modelMetadata: {
    modelName: 'Spatial-Temporal XGBoost v2 (location_xgboost_v2.pkl)',
    version: '2.0.0',
    inferenceLatencyMs: 14,
    featuresEvaluated: 17,
    trainingCutoff: 'September 2025'
  }
};

const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    accountId: 'ACC_013041',
    bankId: 'BANK05',
    bankName: 'Axis Bank',
    holderName: 'Target Primary Mule (ACC_013041)',
    accountType: 'Savings',
    accountAgeDays: 42,
    accountStatus: 'FLAGGED',
    previousAlertCount: 2,
    stateCode: 'GA',
    branchName: 'Panaji City Branch, Goa',
    ifsc: 'UTIB0000841',
    incomingAmountTotal: 150000,
    incomingTransactionCount: 1,
    uniqueSenders: 1,
    outgoingAmountTotal: 80000,
    outgoingTransactionCount: 1,
    uniqueReceivers: 1,
    fundSplitRatio: 0.85,
    transferVelocity: 0.141,
    networkDegree: 3,
    networkRiskScore: 0.979,
    primaryFlag: 'Target Primary Extraction Mule',
    kycStatus: 'High Risk (Discrepant Documentation)',
    openedDate: '12 Jan 2024',
    turnoverSummary: '₹1,50,000 inflow flagged by ML',
    velocityNote: 'Immediate debit outbound transfer in 4 minutes',
    linkedCaseId: 'LIVE_DEMO_001'
  },
  {
    accountId: 'ACC_010028',
    bankId: 'BANK02',
    bankName: 'HDFC Bank',
    holderName: 'Layer Mule Operative (ACC_010028)',
    accountType: 'Current',
    accountAgeDays: 68,
    accountStatus: 'FLAGGED',
    previousAlertCount: 1,
    stateCode: 'GA',
    branchName: 'North Goa Transit Clearing',
    ifsc: 'HDFC0000129',
    incomingAmountTotal: 80000,
    incomingTransactionCount: 1,
    uniqueSenders: 1,
    outgoingAmountTotal: 50000,
    outgoingTransactionCount: 1,
    uniqueReceivers: 1,
    fundSplitRatio: 0.62,
    transferVelocity: 0.098,
    networkDegree: 2,
    networkRiskScore: 0.912,
    primaryFlag: 'Hop 1 Layer Mule Operative',
    kycStatus: 'Forged Rent Agreement',
    openedDate: '04 Mar 2024',
    turnoverSummary: '₹80,000 layering hop',
    velocityNote: 'Dispersal to ATM extraction node',
    linkedCaseId: 'LIVE_DEMO_001'
  },
  {
    accountId: 'ACC_012795',
    bankId: 'BANK01',
    bankName: 'State Bank of India',
    holderName: 'Extraction Node (ACC_012795)',
    accountType: 'Savings',
    accountAgeDays: 95,
    accountStatus: 'FLAGGED',
    previousAlertCount: 1,
    stateCode: 'GA',
    branchName: 'Calangute Commercial Branch',
    ifsc: 'SBIN0000892',
    incomingAmountTotal: 50000,
    incomingTransactionCount: 1,
    uniqueSenders: 1,
    outgoingAmountTotal: 30000,
    outgoingTransactionCount: 1,
    uniqueReceivers: 1,
    fundSplitRatio: 0.6,
    transferVelocity: 0.08,
    networkDegree: 2,
    networkRiskScore: 0.845,
    primaryFlag: 'ATM Extraction Staging Node',
    kycStatus: 'Suspicious Non-Resident',
    openedDate: '19 May 2023',
    turnoverSummary: '₹50,000 staged extraction',
    velocityNote: 'ATM cluster proximity correlation',
    linkedCaseId: 'LIVE_DEMO_001'
  }
];

const INITIAL_ALERTS: BankAlert[] = [
  {
    alertId: 'ALT_LIVE_01',
    severity: 'CRITICAL',
    accountId: 'ACC_013041',
    accountHolder: 'Target Primary Mule (ACC_013041)',
    bankId: 'BANK05',
    timestamp: 'Just now',
    amount: 150000,
    reason: 'Urgent: Primary Mule Recipient for Case LIVE_DEMO_001 (Victim in Goa)',
    signals: [
      'Rapid outbound movement following ₹1,50,000 inflow',
      'Target mule node in North Goa extraction corridor',
      'High model extraction confidence 97.9%'
    ],
    status: 'OPEN',
    networkRiskScore: 0.979,
    outboundCount: 1,
    uniqueReceivers: 1,
    paymentChannels: ['IMPS', 'UPI']
  },
  {
    alertId: 'ALT_LIVE_02',
    severity: 'CRITICAL',
    accountId: 'ACC_010028',
    accountHolder: 'Layer Mule Operative (ACC_010028)',
    bankId: 'BANK02',
    timestamp: '15m ago',
    amount: 80000,
    reason: 'Hop 1 Downstream Layering Split to ACC_010028',
    signals: [
      'Immediate secondary transfer from primary mule',
      'Lien marking recommended'
    ],
    status: 'OPEN',
    networkRiskScore: 0.912,
    outboundCount: 1,
    uniqueReceivers: 1,
    paymentChannels: ['UPI', 'NEFT']
  },
  {
    alertId: 'ALT_LIVE_ATM',
    severity: 'HIGH',
    accountId: 'ACC_012795',
    accountHolder: 'Extraction Node (ACC_012795)',
    bankId: 'BANK01',
    timestamp: 'Active window',
    amount: 50000,
    reason: 'ATM Corridor Staged Cash-Out Proximity Alert (Zone GA_Z05)',
    signals: [
      'Field interception team dispatched for GA_Z05 ATMs'
    ],
    status: 'OPEN',
    networkRiskScore: 0.845,
    outboundCount: 1,
    uniqueReceivers: 1,
    paymentChannels: ['ATM', 'UPI']
  }
];

const INITIAL_TRANSACTIONS: BankTransaction[] = [
  {
    transactionId: 'TX_DEMO_001',
    timestamp: '2026-09-19 18:15:00',
    sourceAccount: 'ACC_013041',
    sourceBank: 'Axis Bank',
    destinationAccount: 'ACC_010028',
    destinationBank: 'HDFC Bank',
    amount: 80000,
    channel: 'IMPS',
    transactionDirection: 'DEBIT',
    caseId: 'LIVE_DEMO_001',
    status: 'FLAGGED',
    riskLabel: 'CRITICAL_SPLIT',
    isSuspicious: true
  },
  {
    transactionId: 'TX_DEMO_002',
    timestamp: '2026-09-19 18:35:00',
    sourceAccount: 'ACC_010028',
    sourceBank: 'HDFC Bank',
    destinationAccount: 'ACC_012795',
    destinationBank: 'State Bank of India',
    amount: 50000,
    channel: 'UPI',
    transactionDirection: 'DEBIT',
    caseId: 'LIVE_DEMO_001',
    status: 'FLAGGED',
    riskLabel: 'LAYER_TRANSFER',
    isSuspicious: true
  },
  {
    transactionId: 'TX_DEMO_003',
    timestamp: '2026-09-19 18:50:00',
    sourceAccount: 'ACC_012795',
    sourceBank: 'State Bank of India',
    destinationAccount: 'ACC_006625',
    destinationBank: 'ICICI Bank',
    amount: 30000,
    channel: 'ATM',
    transactionDirection: 'DEBIT',
    caseId: 'LIVE_DEMO_001',
    status: 'FLAGGED',
    riskLabel: 'ATM_EXTRACTION',
    isSuspicious: true
  }
];

const INITIAL_I4C_ALERT: I4CIntelligenceAlert = {
  id: 'INT_ALERT_LIVE_DEMO_001',
  timestamp: 'Just now',
  title: 'High-Velocity Investment Scam Interstate Vector (GA -> GA_Z05)',
  description: 'ML model detected high-velocity cash-out preparation with 97.9% confidence in North Goa Extraction Zone.',
  category: 'PREDICTION UPDATE',
  severity: 'CRITICAL',
  targetType: 'hotspot',
  targetId: 'GA_Z05',
  confidence: 97.9,
  stateCode: 'GA'
};

export interface ActiveCaseState {
  activeCase: Case;
  prediction: Prediction;
  hotspots: any[];
  network: any;
  similarCases: any[];
  bankAccounts: BankAccount[];
  bankAlerts: BankAlert[];
  bankTransactions: BankTransaction[];
  i4cAlert: I4CIntelligenceAlert | null;
  selectedDemoKey: string;
  demoCases: Record<string, any>;
  isLoading: boolean;
  isLiveModel: boolean;

  // Actions
  setActiveCaseFromMLResult: (casePayload: any, mlResult: any) => void;
  selectDemoCase: (demoId: string) => Promise<void>;
  syncFromBackend: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// Check localStorage for persisted state
function getStoredState(): Partial<ActiveCaseState> | null {
  try {
    const raw = localStorage.getItem('cybercrash_active_case');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read stored active case:', e);
  }
  return null;
}

function saveState(state: Partial<ActiveCaseState>) {
  try {
    localStorage.setItem('cybercrash_active_case', JSON.stringify({
      activeCase: state.activeCase,
      prediction: state.prediction,
      hotspots: state.hotspots,
      network: state.network,
      similarCases: state.similarCases,
      bankAccounts: state.bankAccounts,
      bankAlerts: state.bankAlerts,
      bankTransactions: state.bankTransactions,
      i4cAlert: state.i4cAlert,
      selectedDemoKey: state.selectedDemoKey
    }));
  } catch (e) {
    console.warn('Could not persist active case:', e);
  }
}

const stored = getStoredState();

export const useActiveCaseStore = create<ActiveCaseState>((set, get) => ({
  activeCase: stored?.activeCase || INITIAL_DEMO_CASE,
  prediction: stored?.prediction || INITIAL_PREDICTION,
  hotspots: stored?.hotspots || [],
  network: stored?.network || null,
  similarCases: stored?.similarCases || [],
  bankAccounts: stored?.bankAccounts || INITIAL_ACCOUNTS,
  bankAlerts: stored?.bankAlerts || INITIAL_ALERTS,
  bankTransactions: stored?.bankTransactions || INITIAL_TRANSACTIONS,
  i4cAlert: stored?.i4cAlert || INITIAL_I4C_ALERT,
  selectedDemoKey: stored?.selectedDemoKey || 'LIVE_DEMO_001',
  demoCases: {},
  isLoading: false,
  isLiveModel: true,

  setLoading: (isLoading) => set({ isLoading }),

  setActiveCaseFromMLResult: (casePayload: any, mlResult: any) => {
    const activeCaseServer = mlResult?.active_case;
    const hotspots = mlResult?.hotspots || [];
    const topH = hotspots[0] || {};
    const cid = String(casePayload.case_id || 'DEMO_CASE').toUpperCase();
    const amt = Number(casePayload.reported_amount) || 100000;
    const state = String(casePayload.complaint_state || 'GA').toUpperCase();
    const primary = String(casePayload.primary_account || 'ACC_013041');
    const topScore = Number(topH.risk_score || 0.95);
    const topZone = topH.zone_id || `${state}_Z05`;

    const lat = Number(topH.latitude || topH.zone_coordinates?.latitude || 15.5925);
    const lng = Number(topH.longitude || topH.zone_coordinates?.longitude || 73.8135);

    const newCase: Case = activeCaseServer?.case || {
      id: cid,
      type: casePayload.fraud_type || 'Cyber Fraud',
      state: state === 'GA' ? 'Goa' : (state === 'PB' ? 'Punjab' : (state === 'TN' ? 'Tamil Nadu' : state)),
      stateCode: state,
      amount: `₹${amt.toLocaleString()}`,
      amountRaw: amt,
      status: 'ACTIVE INVESTIGATION',
      priority: amt >= 100000 ? 'CRITICAL' : 'HIGH',
      primaryMule: primary,
      incidentTime: new Date().toLocaleString(),
      complaintTime: new Date().toLocaleString(),
      predictedZone: topZone,
      riskScore: topScore,
      riskPercent: `${(topScore * 100).toFixed(1)}%`,
      timeWindow: topH.historical_time_windows?.[0]?.time_window || '18:00 – 21:00',
      assignedTo: `LEA — ${state} Cyber Cell`,
      networkAccounts: (casePayload.transactions?.length || 2) + 1,
      transactionsTraced: casePayload.transactions?.length || 2,
      maxDepth: 3,
      downstreamAmount: `₹${Math.round(amt * 0.75).toLocaleString()}`,
      lastUpdated: 'Live Sync',
      victim: {
        name: `Complainant Reference (${state})`,
        account: `ACC_VICTIM_${cid.slice(-4)}`,
        bank: 'State Clearing Gateway',
        branch: `${state} Main Clearing Hub`,
        amount: `₹${amt.toLocaleString()}`,
        utr: `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        contact: '+91 98230 XXXXX',
        location: `${state}, India`
      },
      complaintLocation: {
        city: state === 'GA' ? 'Panaji' : (state === 'PB' ? 'Chandigarh' : (state === 'TN' ? 'Chennai' : 'Metro')),
        state: state,
        lat: lat,
        lng: lng
      }
    };

    const newPrediction: Prediction = activeCaseServer?.prediction || {
      caseId: cid,
      predictedZone: topZone,
      confidenceScore: topScore,
      confidencePercent: `${(topScore * 100).toFixed(1)}%`,
      timeWindow: topH.historical_time_windows?.[0]?.time_window || '18:00 – 21:00',
      clusterName: `ATM CLUSTER · ${(topH.zone_name || topZone).toUpperCase()}`,
      centerCoordinates: { lat, lng },
      radiusMeters: 2500,
      atms: (topH.nearest_atms || topH.atm_candidates || []).map((a: any, i: number) => ({
        id: a.atm_id || `ATM_${topZone}_${i + 1}`,
        name: `${a.bank || 'SBI'} ATM — ${a.atm_name || 'Commercial Terminal'}`,
        lat: Number(a.latitude || lat + (i === 0 ? 0 : 0.003)),
        lng: Number(a.longitude || lng + (i === 0 ? 0 : -0.003)),
        bank: a.bank || 'State Bank of India',
        risk: i === 0 ? ('Critical' as const) : ('High' as const),
        status: i === 0 ? 'Primary Target Extraction Point' : 'Active Intercept Alert',
        window: '18:00 – 21:00',
        cctv: 'Real-Time Intercept Ready'
      })),
      candidateZones: hotspots.map((h: any, i: number) => ({
        zone: h.zone_id,
        state: h.state_code || state,
        score: Math.round(Number(h.risk_score || 0) * 100),
        status: i === 0 ? 'TARGET' : 'CANDIDATE',
        highlight: i === 0
      })),
      withdrawalWindows: [
        { window: '18:00 – 21:00', score: 92, priority: 'HIGH', label: 'Primary Extraction Window' },
        { window: '15:00 – 18:00', score: 65, priority: 'MEDIUM', label: 'Secondary Window' }
      ],
      evidence: [
        { factor: 'Mule Syndicate Pathway', level: 'HIGH', score: 95, description: `High confidence routing to ${topZone}`, metric: `Score ${(topScore * 100).toFixed(1)}%` },
        { factor: 'ATM Cluster Concentration', level: 'HIGH', score: 90, description: 'Dense cluster of withdrawal nodes', metric: 'Density 0.88' }
      ],
      modelMetadata: {
        modelName: 'Spatial-Temporal XGBoost v2 (location_xgboost_v2.pkl)',
        version: '2.0.0',
        inferenceLatencyMs: 14,
        featuresEvaluated: 17,
        trainingCutoff: 'September 2025'
      }
    };

    const newAccounts: BankAccount[] = activeCaseServer?.accounts || [
      {
        accountId: primary,
        accountNumber: `•••• ${primary.slice(-4) || '9012'}`,
        accountHolder: `Target Mule (${primary})`,
        holderName: `Target Mule (${primary})`,
        bankId: 'BANK05',
        bankName: 'Axis Bank',
        ifsc: 'UTIB0000841',
        branch: `${state} Clearing Branch`,
        branchName: `${state} Clearing Branch`,
        accountType: 'Savings',
        accountStatus: 'FLAGGED',
        status: 'FLAGGED',
        riskLevel: 'CRITICAL',
        riskScore: topScore,
        networkRiskScore: topScore,
        muleScore: Math.min(99, Math.round(topScore * 100)),
        balance: `₹${Math.round(amt * 0.25).toLocaleString()}`,
        balanceRaw: Math.round(amt * 0.25),
        turnover: `₹${amt.toLocaleString()}`,
        turnoverSummary: `₹${amt.toLocaleString()} in last 72 hours`,
        incomingAmount: `₹${amt.toLocaleString()}`,
        incomingAmountTotal: amt,
        incomingTransactionCount: 1,
        uniqueSenders: 1,
        outgoingAmount: `₹${Math.round(amt * 0.75).toLocaleString()}`,
        outgoingAmountTotal: Math.round(amt * 0.75),
        outgoingTransactionCount: (casePayload.transactions || []).length || 1,
        uniqueReceivers: (casePayload.transactions || []).length || 1,
        fundSplitRatio: 0.85,
        transferVelocity: 0.141,
        networkDegree: (casePayload.transactions || []).length + 1,
        accountAgeDays: 45,
        previousAlertCount: 1,
        linkedCasesCount: 1,
        primaryFlag: 'HIGH RISK PRIMARY MULE',
        kycStatus: 'Forged Identity Flag',
        openedDate: '18 Aug 2025',
        velocityNote: 'Rapid outbound transfer within 12m',
        lastActive: 'Just now',
        stateCode: String(casePayload.complaint_state || 'GA').toUpperCase(),
        layer: 1
      }
    ];

    const newAlerts: BankAlert[] = activeCaseServer?.alerts || [
      {
        alertId: `ALT_${cid}_01`,
        accountId: primary,
        accountNumber: `•••• ${primary.slice(-4) || '9012'}`,
        accountHolder: `Target Mule (${primary})`,
        bankId: 'BANK05',
        amount: amt,
        amountRaw: amt,
        severity: 'CRITICAL',
        riskLevel: 'CRITICAL',
        riskScore: topScore,
        networkRiskScore: topScore,
        trigger: `Urgent: Primary Mule Recipient for Case ${cid} (Victim in ${state})`,
        reason: `Urgent: Primary Mule Recipient for Case ${cid} (Victim in ${state})`,
        signals: [
          `Rapid outbound movement following ₹${amt.toLocaleString()} inflow`,
          `Target mule node in ${state} extraction corridor`,
          `High model extraction confidence ${(topScore * 100).toFixed(1)}%`
        ],
        timestamp: 'Just now',
        channel: 'IMPS / UPI',
        status: 'OPEN',
        recommendedAction: 'FREEZE ACCOUNT NOW',
        outboundCount: (casePayload.transactions || []).length || 1,
        uniqueReceivers: (casePayload.transactions || []).length || 1,
        paymentChannels: ['IMPS', 'UPI']
      }
    ];

    const newTransactions: BankTransaction[] = (casePayload.transactions || []).map((tx: any, i: number) => ({
      transactionId: `TX_${cid}_${i + 1}`,
      id: `TX_${cid}_${i + 1}`,
      sourceAccount: tx.source_account || primary,
      sourceBank: 'Axis Bank',
      destinationAccount: tx.destination_account || `ACC_LAYER_${i + 1}`,
      destinationBank: 'State Bank of India',
      amount: Number(tx.amount || 50000),
      amountRaw: Number(tx.amount || 50000),
      timestamp: String(tx.timestamp || '2026-09-19 18:00:00').replace('T', ' ').slice(0, 19),
      channel: 'IMPS',
      riskLevel: Number(tx.amount || 0) >= 50000 ? 'CRITICAL' : 'HIGH',
      caseId: cid,
      status: 'FLAGGED',
      hop: i + 1,
      transactionDirection: 'DEBIT',
      alertSeverity: Number(tx.amount || 0) >= 50000 ? 'CRITICAL' : 'HIGH',
      isSuspicious: true
    }));

    const newI4CAlert: I4CIntelligenceAlert = activeCaseServer?.i4cAlert || {
      id: `INT_ALERT_${cid}`,
      alertId: `INT_ALERT_${cid}`,
      timestamp: 'Just now',
      title: `Interstate ${casePayload.fraud_type || 'Fraud'} Syndicate Vector (${state} -> ${topZone})`,
      description: `ML model predicted target cash-out zone ${topZone} with ${(topScore * 100).toFixed(1)}% confidence.`,
      category: 'PREDICTION UPDATE',
      severity: 'CRITICAL',
      actionRequired: `Interstate Interception Order (${state} Cyber Cell)`,
      targetType: 'hotspot',
      targetId: topZone,
      caseId: cid,
      amount: `₹${amt.toLocaleString()}`,
      primaryMule: primary
    };

    const nextState = {
      activeCase: newCase,
      prediction: newPrediction,
      hotspots: hotspots,
      network: mlResult?.network || null,
      similarCases: mlResult?.historical_similarity?.similar_cases || [],
      bankAccounts: newAccounts,
      bankAlerts: newAlerts,
      bankTransactions: newTransactions,
      i4cAlert: newI4CAlert,
      selectedDemoKey: cid,
      isLoading: false,
      isLiveModel: true
    };

    set(nextState);
    saveState(nextState);
  },

  selectDemoCase: async (demoId: string) => {
    set({ isLoading: true, selectedDemoKey: demoId });
    try {
      const res = await apiFetch<any>(`/active-case/select/${encodeURIComponent(demoId)}`, {
        method: 'POST'
      });

      if (res?.case && res?.prediction) {
        const nextState = {
          activeCase: res.case,
          prediction: res.prediction,
          hotspots: res.hotspots || [],
          network: res.network || null,
          similarCases: res.similar_cases || [],
          bankAccounts: res.accounts || [],
          bankAlerts: res.alerts || [],
          bankTransactions: res.transactions || [],
          i4cAlert: res.i4cAlert || null,
          selectedDemoKey: demoId,
          isLoading: false,
          isLiveModel: true
        };
        set(nextState);
        saveState(nextState);
        return;
      }
    } catch (err) {
      console.warn(`Could not activate demo case ${demoId} directly from backend, falling back:`, err);
    }

    try {
      const demoData = await apiFetch<any>(`/demo-cases/${encodeURIComponent(demoId)}`);
      if (demoData?.case_id) {
        const result = await apiFetch<any>('/new-case', {
          method: 'POST',
          body: JSON.stringify(demoData)
        });
        get().setActiveCaseFromMLResult(demoData, result);
        return;
      }
    } catch (err2) {
      console.error(`Failed to activate demo case ${demoId}:`, err2);
    }

    set({ isLoading: false });
  },

  syncFromBackend: async () => {
    try {
      const res = await apiFetch<any>('/active-case');
      if (res?.case && res?.prediction) {
        const nextState = {
          activeCase: res.case,
          prediction: res.prediction,
          hotspots: res.hotspots || [],
          network: res.network || null,
          similarCases: res.similar_cases || [],
          bankAccounts: res.accounts || [],
          bankAlerts: res.alerts || [],
          bankTransactions: res.transactions || [],
          i4cAlert: res.i4cAlert || null,
          selectedDemoKey: res.case.id,
          isLoading: false,
          isLiveModel: true
        };
        set(nextState);
        saveState(nextState);
      }
    } catch (e) {
      console.warn('Backend /active-case sync skipped.');
    }
  }
}));
