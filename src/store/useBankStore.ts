import { create } from 'zustand';
import {
  BankAccount,
  BankTransaction,
  BankAlert,
  AlertSeverity
} from '../types/bank';
import { BANK_ACCOUNTS } from '../data/bank/bankAccounts';

export interface BankAuditEvent {
  id: string;
  timestamp: string;
  action: string;
  accountId: string;
  details: string;
  operator: string;
}

interface BankStoreState {
  selectedAccountId: string;
  selectedAccount: BankAccount | null;
  selectedTransaction: BankTransaction | null;
  selectedAlert: BankAlert | null;
  selectedConnectedAccountId: string | null;

  severityFilter: 'ALL' | AlertSeverity;
  statusFilter: 'ALL' | 'OPEN' | 'REVIEW' | 'ESCALATED' | 'RESOLVED';
  timeFilter: '1H' | '24H' | '7D' | '30D';
  networkDepth: number;

  activeDrawer: 'transaction' | 'connected_account' | 'escalation' | 'risk_explanation' | 'note' | null;

  accountActionStatus: Record<string, string>;
  investigationNotes: Record<string, string[]>;
  bankAuditEvents: BankAuditEvent[];
  searchQuery: string;

  // Actions
  setSelectedAccountId: (id: string) => void;
  setSelectedTransaction: (tx: BankTransaction | null) => void;
  setSelectedAlert: (alert: BankAlert | null) => void;
  setSelectedConnectedAccountId: (id: string | null) => void;

  setSeverityFilter: (sev: 'ALL' | AlertSeverity) => void;
  setStatusFilter: (status: 'ALL' | 'OPEN' | 'REVIEW' | 'ESCALATED' | 'RESOLVED') => void;
  setTimeFilter: (time: '1H' | '24H' | '7D' | '30D') => void;
  setNetworkDepth: (depth: number) => void;

  openDrawer: (drawer: 'transaction' | 'connected_account' | 'escalation' | 'risk_explanation' | 'note') => void;
  closeDrawer: () => void;

  setAccountStatus: (accountId: string, status: string) => void;
  freezeAccount: (accountId: string, reason?: string) => void;
  addInvestigationNote: (accountId: string, note: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useBankStore = create<BankStoreState>((set) => ({
  selectedAccountId: 'ACC_013041',
  selectedAccount: BANK_ACCOUNTS[0],
  selectedTransaction: null,
  selectedAlert: null,
  selectedConnectedAccountId: null,

  severityFilter: 'ALL',
  statusFilter: 'ALL',
  timeFilter: '24H',
  networkDepth: 1,

  activeDrawer: null,

  accountActionStatus: {
    'ACC_013041': 'UNDER INVESTIGATION',
    'ACC_008564': 'SUSPECTED HUB',
    'ACC_006877': 'FROZEN'
  },

  bankAuditEvents: [
    {
      id: 'AUDIT_INIT_01',
      timestamp: '10 mins ago',
      action: 'ACCOUNT_STATUS_UPDATE',
      accountId: 'ACC_006877',
      details: 'Emergency lien placed under Cybercrime SOP 2026',
      operator: 'BANK05_FRAUD_DESK'
    }
  ],

  investigationNotes: {
    'ACC_013041': [
      'Preliminary fraud desk review: Rapid outbound fan-out initiated within 4 minutes of inbound credit.'
    ]
  },

  searchQuery: '',

  setSelectedAccountId: (id) => {
    const acc = BANK_ACCOUNTS.find((a) => a.accountId === id) || BANK_ACCOUNTS[0];
    set({ selectedAccountId: id, selectedAccount: acc });
  },

  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  setSelectedConnectedAccountId: (id) => set({ selectedConnectedAccountId: id }),

  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTimeFilter: (timeFilter) => set({ timeFilter }),
  setNetworkDepth: (networkDepth) => set({ networkDepth }),

  openDrawer: (drawer) => set({ activeDrawer: drawer }),
  closeDrawer: () => set({ activeDrawer: null }),

  setAccountStatus: (accountId, status) =>
    set((state) => ({
      accountActionStatus: {
        ...state.accountActionStatus,
        [accountId]: status
      }
    })),

  freezeAccount: (accountId, reason = 'Direct ML Mule Link & High Velocity Debit Fan-out') =>
    set((state) => {
      const newEvent: BankAuditEvent = {
        id: `AUDIT_${Date.now()}`,
        timestamp: 'Just now',
        action: 'ACCOUNT_FROZEN',
        accountId,
        details: `Compliance lien placed under I4C Cybercrime Directive. Reason: ${reason}`,
        operator: 'BANK_SURVEILLANCE_OFFICER'
      };

      return {
        accountActionStatus: {
          ...state.accountActionStatus,
          [accountId]: 'FROZEN (COMPLIANCE LIEN PLACED)'
        },
        bankAuditEvents: [newEvent, ...state.bankAuditEvents],
        investigationNotes: {
          ...state.investigationNotes,
          [accountId]: [
            ...(state.investigationNotes[accountId] || []),
            `[${new Date().toLocaleTimeString()}] ACCOUNT FROZEN: ${reason}`
          ]
        }
      };
    }),

  addInvestigationNote: (accountId, note) =>
    set((state) => ({
      investigationNotes: {
        ...state.investigationNotes,
        [accountId]: [...(state.investigationNotes[accountId] || []), note]
      }
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery })
}));
