import { HistoricalCase } from '../types/case';
import { MOCK_HISTORICAL_CASES } from '../data/mockInvestigation';
import { apiFetch } from './apiClient';

export async function fetchHistoricalCases(accountId?: string): Promise<HistoricalCase[]> {
  if (accountId) {
    try {
      const data = await apiFetch<HistoricalCase[]>(`/accounts/${encodeURIComponent(accountId)}/history`);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn(`[ML Backend] Fallback used for historical cases of ${accountId}:`, err);
    }

    const filtered = MOCK_HISTORICAL_CASES.filter(
      (hc) => hc.accountInvolved?.toLowerCase() === accountId.toLowerCase()
    );
    if (filtered.length > 0) return filtered;
  }

  return [...MOCK_HISTORICAL_CASES];
}
