import { Account } from '../types/account';
import { MOCK_ACCOUNTS } from '../data/mockInvestigation';

export async function fetchAccountById(accountId: string): Promise<Account | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const acc = MOCK_ACCOUNTS[accountId] || null;
  return acc ? { ...acc } : null;
}

export async function fetchAllAccountsForCase(caseId: string): Promise<Account[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return Object.values(MOCK_ACCOUNTS);
}
