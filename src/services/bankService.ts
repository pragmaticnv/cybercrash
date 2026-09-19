import { BANK_ACCOUNTS } from '../data/bank/bankAccounts';
import { BANK_TRANSACTIONS } from '../data/bank/bankTransactions';
import { BANK_ALERTS } from '../data/bank/bankAlerts';
import { BANK_HISTORY_EVENTS, BANK_LINKED_CASES } from '../data/bank/bankHistory';
import { getBankNetworkByDepth, BankNetworkData } from '../data/bank/bankNetworks';
import {
  BankAccount,
  BankTransaction,
  BankAlert,
  BankHistoryEvent,
  BankLinkedCase
} from '../types/bank';

/**
 * Bank Service Layer
 * Isolates UI from mock data, structured for future FastAPI backend endpoints:
 * GET /bank/accounts
 * GET /bank/accounts/{id}
 * GET /bank/accounts/{id}/transactions
 * GET /bank/accounts/{id}/network
 * GET /bank/accounts/{id}/history
 * GET /bank/alerts
 */
export const bankService = {
  getAccounts: async (): Promise<BankAccount[]> => {
    return BANK_ACCOUNTS;
  },

  getAccount: async (accountId: string): Promise<BankAccount | null> => {
    const acc = BANK_ACCOUNTS.find((a) => a.accountId === accountId);
    return acc || BANK_ACCOUNTS[0]; // fallback to primary target
  },

  getTransactions: async (accountId?: string): Promise<BankTransaction[]> => {
    if (!accountId) return BANK_TRANSACTIONS;
    return BANK_TRANSACTIONS.filter(
      (tx) => tx.sourceAccount === accountId || tx.destinationAccount === accountId
    );
  },

  getTransactionById: async (transactionId: string): Promise<BankTransaction | null> => {
    return BANK_TRANSACTIONS.find((tx) => tx.transactionId === transactionId) || null;
  },

  getAlerts: async (): Promise<BankAlert[]> => {
    return BANK_ALERTS;
  },

  getAccountHistory: async (accountId: string): Promise<BankHistoryEvent[]> => {
    return BANK_HISTORY_EVENTS[accountId] || BANK_HISTORY_EVENTS['ACC_013041'] || [];
  },

  getLinkedCases: async (accountId: string): Promise<BankLinkedCase[]> => {
    return BANK_LINKED_CASES[accountId] || BANK_LINKED_CASES['ACC_013041'] || [];
  },

  getNetwork: async (accountId: string, depth: number = 1): Promise<BankNetworkData> => {
    return getBankNetworkByDepth(accountId, depth);
  }
};
