import { Account } from '../types/account';
import { MOCK_ACCOUNTS } from '../data/mockInvestigation';
import { apiFetch } from './apiClient';

export async function fetchAccountById(accountId: string): Promise<Account | null> {
  try {
    const data = await apiFetch<Account>(`/accounts/${encodeURIComponent(accountId)}`);
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    console.warn(`[ML Backend] Fallback used for account ${accountId}:`, err);
  }

  const acc = MOCK_ACCOUNTS[accountId] || null;
  return acc ? { ...acc } : null;
}

export async function fetchAllAccountsForCase(caseId: string): Promise<Account[]> {
  return Object.values(MOCK_ACCOUNTS);
}
