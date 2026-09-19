import { BankAccount } from '../../types/bank';

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    accountId: 'ACC_013041',
    bankId: 'BANK05',
    bankName: 'Axis Bank (Commercial Panaji)',
    holderName: 'Naveen Kumar',
    accountType: 'Savings',
    accountAgeDays: 1701,
    accountStatus: 'FLAGGED',
    previousAlertCount: 1,
    stateCode: 'GA',
    branchName: 'Panaji City Commercial Branch',
    ifsc: 'UTIB0000841',

    // Exact Project Metrics
    incomingAmountTotal: 113973,
    incomingTransactionCount: 5,
    uniqueSenders: 5,

    outgoingAmountTotal: 53439,
    outgoingTransactionCount: 8,
    uniqueReceivers: 8,

    fundSplitRatio: 0.468874,
    transferVelocity: 0.141093,
    networkDegree: 13,
    networkRiskScore: 0.285964,

    primaryFlag: 'Rapid Outbound Fan-Out',
    kycStatus: 'High Risk (Discrepant Utility Documentation)',
    openedDate: '18 Aug 2020',
    turnoverSummary: '₹42,80,000 in past 14 days',
    velocityNote: 'Outbound fan-out initiated within 4m 12s of credit arrival',
    linkedCaseId: 'CASE_007001'
  },
  {
    accountId: 'ACC_008564',
    bankId: 'BANK05',
    bankName: 'HDFC Bank (Margao)',
    holderName: 'Suresh Patil',
    accountType: 'Salary',
    accountAgeDays: 890,
    accountStatus: 'FLAGGED',
    previousAlertCount: 4,
    stateCode: 'GA',
    branchName: 'Margao Commercial Sector',
    ifsc: 'HDFC0001092',

    incomingAmountTotal: 98000,
    incomingTransactionCount: 1,
    uniqueSenders: 1,

    outgoingAmountTotal: 88000,
    outgoingTransactionCount: 4,
    uniqueReceivers: 4,

    fundSplitRatio: 0.8979,
    transferVelocity: 0.3841,
    networkDegree: 16,
    networkRiskScore: 0.8124,

    primaryFlag: 'Layer 2 Funneling Hub',
    kycStatus: 'Salary Account Subject to Takeover',
    openedDate: '12 Jan 2023',
    turnoverSummary: '₹89,20,000 aggregated across 34 cyber cases',
    velocityNote: 'Immediate relay to split mules via NEFT & RTGS',
    linkedCaseId: 'CASE_007001'
  },
  {
    accountId: 'ACC_006877',
    bankId: 'BANK05',
    bankName: 'Canara Bank (Mapusa Market)',
    holderName: 'Vikram Salgaonkar',
    accountType: 'Savings',
    accountAgeDays: 80,
    accountStatus: 'FROZEN',
    previousAlertCount: 2,
    stateCode: 'GA',
    branchName: 'Mapusa Market Branch',
    ifsc: 'CNRB0002190',

    incomingAmountTotal: 60000,
    incomingTransactionCount: 1,
    uniqueSenders: 1,

    outgoingAmountTotal: 60000,
    outgoingTransactionCount: 3,
    uniqueReceivers: 1,

    fundSplitRatio: 1.0,
    transferVelocity: 0.92,
    networkDegree: 3,
    networkRiskScore: 0.9412,

    primaryFlag: 'Terminal ATM Cash-Out Node',
    kycStatus: 'Fresh Student Account / Forged Address',
    openedDate: '26 Jun 2025',
    turnoverSummary: '₹14,50,000 withdrawn strictly through ATMs',
    velocityNote: 'Sequential debit card withdrawals at 800m ATM cluster',
    linkedCaseId: 'CASE_007001'
  },
  {
    accountId: 'ACC_008833',
    bankId: 'BANK05',
    bankName: 'Axis Bank (Mapusa)',
    holderName: 'Sunil G.',
    accountType: 'Savings',
    accountAgeDays: 412,
    accountStatus: 'FLAGGED',
    previousAlertCount: 1,
    stateCode: 'GA',
    branchName: 'Mapusa North Branch',
    ifsc: 'UTIB0001422',

    incomingAmountTotal: 12751,
    incomingTransactionCount: 1,
    uniqueSenders: 1,

    outgoingAmountTotal: 12000,
    outgoingTransactionCount: 1,
    uniqueReceivers: 1,

    fundSplitRatio: 0.94,
    transferVelocity: 0.22,
    networkDegree: 4,
    networkRiskScore: 0.512,

    primaryFlag: 'Layer 2 Micro Splitter',
    kycStatus: 'Standard Verified',
    openedDate: '03 Aug 2024',
    turnoverSummary: '₹3,40,000 turnover',
    velocityNote: 'Wallet & UPI pass-through within 15 minutes',
    linkedCaseId: 'CASE_007001'
  },
  {
    accountId: 'ACC_001097',
    bankId: 'BANK05',
    bankName: 'ICICI Bank (Ponda)',
    holderName: 'Deepak Sawant',
    accountType: 'Savings',
    accountAgeDays: 620,
    accountStatus: 'FLAGGED',
    previousAlertCount: 0,
    stateCode: 'GA',
    branchName: 'Ponda Bypass Branch',
    ifsc: 'ICIC0000912',

    incomingAmountTotal: 18070,
    incomingTransactionCount: 1,
    uniqueSenders: 1,

    outgoingAmountTotal: 17500,
    outgoingTransactionCount: 2,
    uniqueReceivers: 2,

    fundSplitRatio: 0.96,
    transferVelocity: 0.44,
    networkDegree: 5,
    networkRiskScore: 0.628,

    primaryFlag: 'Fast Relay IMPS Funnel',
    kycStatus: 'Standard Verified',
    openedDate: '10 Jan 2024',
    turnoverSummary: '₹6,10,000 turnover',
    velocityNote: 'Instant relay via mobile banking',
    linkedCaseId: 'CASE_007001'
  }
];
