import { Transaction } from '../types/transaction';
import { MOCK_TRANSACTIONS } from '../data/mockInvestigation';

export async function fetchTransactionsForCase(caseId: string): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return MOCK_TRANSACTIONS.filter((tx) => tx.caseId.toLowerCase() === caseId.toLowerCase());
}

export async function fetchTransactionById(transactionId: string): Promise<Transaction | null> {
  await new Promise((resolve) => setTimeout(resolve, 40));
  const found = MOCK_TRANSACTIONS.find((tx) => tx.id.toLowerCase() === transactionId.toLowerCase());
  return found ? { ...found } : null;
}
