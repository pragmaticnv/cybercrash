import { BANK_ACCOUNTS } from '../data/bank/bankAccounts';
import { BANK_TRANSACTIONS } from '../data/bank/bankTransactions';
import { BANK_ALERTS } from '../data/bank/bankAlerts';
import { BANK_HISTORY_EVENTS, BANK_LINKED_CASES } from '../data/bank/bankHistory';
import { getBankNetworkByDepth, BankNetworkData } from '../data/bank/bankNetworks';
import { useActiveCaseStore } from '../store/useActiveCaseStore';
import {
  BankAccount,
  BankTransaction,
  BankAlert,
  BankHistoryEvent,
  BankLinkedCase
} from '../types/bank';

/**
 * Bank Service Layer
 * Dynamically resolves data from useActiveCaseStore (connected to ML FastAPI)
 * with graceful fallback to mock registries.
 */
export const bankService = {
  getAccounts: async (): Promise<BankAccount[]> => {
    const activeState = useActiveCaseStore.getState();
    const dynamicAccounts = activeState.bankAccounts || [];
    const dynamicIds = new Set(dynamicAccounts.map((a) => a.accountId));
    return [...dynamicAccounts, ...BANK_ACCOUNTS.filter((a) => !dynamicIds.has(a.accountId))];
  },

  getAccount: async (accountId: string): Promise<BankAccount | null> => {
    const all = await bankService.getAccounts();
    const acc = all.find((a) => a.accountId.toLowerCase() === accountId.toLowerCase());
    return acc || all[0];
  },

  getTransactions: async (accountId?: string): Promise<BankTransaction[]> => {
    const activeState = useActiveCaseStore.getState();
    const dynamicTx = activeState.bankTransactions || [];
    const allTx = [...dynamicTx, ...BANK_TRANSACTIONS];
    if (!accountId) return allTx;
    return allTx.filter(
      (tx) => tx.sourceAccount.toLowerCase() === accountId.toLowerCase() ||
              tx.destinationAccount.toLowerCase() === accountId.toLowerCase()
    );
  },

  getTransactionById: async (transactionId: string): Promise<BankTransaction | null> => {
    const all = await bankService.getTransactions();
    return all.find((tx) => tx.transactionId === transactionId) || null;
  },

  getAlerts: async (): Promise<BankAlert[]> => {
    const activeState = useActiveCaseStore.getState();
    const dynamicAlerts = activeState.bankAlerts || [];
    const dynamicIds = new Set(dynamicAlerts.map((a) => a.alertId));
    return [...dynamicAlerts, ...BANK_ALERTS.filter((a) => !dynamicIds.has(a.alertId))];
  },

  getAccountHistory: async (accountId: string): Promise<BankHistoryEvent[]> => {
    const activeState = useActiveCaseStore.getState();
    const isMule = activeState.activeCase?.primaryMule === accountId ||
                   (activeState.bankAccounts || []).some((a) => a.accountId === accountId);

    if (isMule && activeState.activeCase) {
      return [
        {
          id: `HIST-${accountId}-1`,
          accountId: accountId,
          date: 'Today, 14:02 IST',
          type: 'Alert',
          description: `Real-time ML Model Flag: Linked to ${activeState.activeCase.id} (${activeState.activeCase.type}). Inflow: ${activeState.activeCase.amount}`,
          outcome: 'Escalated',
          officerId: 'SYSTEM-ML-ENGINE'
        },
        {
          id: `HIST-${accountId}-2`,
          accountId: accountId,
          date: 'Today, 14:05 IST',
          type: 'Transaction review',
          description: `Rapid outbound dispersal triggered ATM extraction prediction in ${activeState.prediction?.predictedZone || 'Hotspot Zone'}`,
          outcome: 'Flagged',
          officerId: 'LEA-CYBER-CELL'
        },
        {
          id: `HIST-${accountId}-3`,
          accountId: accountId,
          date: 'Today, 14:10 IST',
          type: 'Escalation',
          description: `Interstate alert relayed to I4C and LEA Officers for target zone apprehension`,
          outcome: 'Escalated',
          officerId: 'I4C-COMMAND'
        }
      ];
    }
    return BANK_HISTORY_EVENTS[accountId] || BANK_HISTORY_EVENTS['ACC_013041'] || [];
  },

  getLinkedCases: async (accountId: string): Promise<BankLinkedCase[]> => {
    const activeState = useActiveCaseStore.getState();
    const isMule = activeState.activeCase?.primaryMule === accountId ||
                   (activeState.bankAccounts || []).some((a) => a.accountId === accountId);

    if (isMule && activeState.activeCase) {
      return [
        {
          caseId: activeState.activeCase.id,
          fraudType: activeState.activeCase.type,
          reportedAmount: activeState.activeCase.amount,
          complaintState: activeState.activeCase.state,
          incidentDate: activeState.activeCase.incidentTime || '19 Sep 2026',
          leaAgency: activeState.activeCase.assignedTo || 'Cyber Crime Division',
          primaryMule: activeState.activeCase.primaryMule
        }
      ];
    }
    return BANK_LINKED_CASES[accountId] || BANK_LINKED_CASES['ACC_013041'] || [];
  },

  getNetwork: async (accountId: string, depth: number = 1): Promise<BankNetworkData> => {
    return getBankNetworkByDepth(accountId, depth);
  }
};
