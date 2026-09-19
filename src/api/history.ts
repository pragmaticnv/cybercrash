import { HistoricalCase } from '../types/case';
import { MOCK_HISTORICAL_CASES } from '../data/mockInvestigation';

export async function fetchHistoricalCases(accountId?: string): Promise<HistoricalCase[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (!accountId) {
    return [...MOCK_HISTORICAL_CASES];
  }
  const filtered = MOCK_HISTORICAL_CASES.filter(
    (hc) => hc.accountInvolved?.toLowerCase() === accountId.toLowerCase()
  );
  return filtered.length > 0 ? filtered : [...MOCK_HISTORICAL_CASES];
}
