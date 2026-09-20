import { Transaction } from '../types/transaction';
import { MOCK_TRANSACTIONS } from '../data/mockInvestigation';
import { apiFetch } from './apiClient';

export async function fetchTransactionsForCase(caseId: string): Promise<Transaction[]> {
  try {
    const data = await apiFetch<Transaction[]>(`/cases/${encodeURIComponent(caseId)}/transactions`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn(`[ML Backend] Fallback used for transactions of ${caseId}:`, err);
  }

  return MOCK_TRANSACTIONS.filter((tx) => tx.caseId.toLowerCase() === caseId.toLowerCase());
}

export async function fetchTransactionById(transactionId: string): Promise<Transaction | null> {
  const found = MOCK_TRANSACTIONS.find((tx) => tx.id.toLowerCase() === transactionId.toLowerCase());
  return found ? { ...found } : null;
}
