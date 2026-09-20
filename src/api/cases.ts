import { Case } from '../types/case';
import { MOCK_CASES } from '../data/mockCases';
import { apiFetch } from './apiClient';

export function isDemoCaseId(caseId?: string): boolean {
  if (!caseId) return false;
  const upper = caseId.toUpperCase().trim();
  return upper.startsWith('LIVE_DEMO') || upper.startsWith('DEMO_') || ['1', '2', '3'].includes(upper);
}

export async function fetchCases(options?: { limit?: number; q?: string; state?: string }): Promise<Case[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.q) params.set('q', options.q);
    if (options?.state) params.set('state', options.state);

    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiFetch<Case[]>(`/cases${query}`);
    if (Array.isArray(data) && data.length > 0) {
      return data.filter((c) => !isDemoCaseId(c.id));
    }
  } catch (err) {
    console.warn('[ML Backend] Fallback used for cases list:', err);
  }

  // Resilient fallback (operational cases only, excluding demo/training cases)
  return MOCK_CASES.filter((c) => !isDemoCaseId(c.id));
}

export async function fetchCaseById(caseId: string): Promise<Case | null> {
  try {
    const data = await apiFetch<Case>(`/cases/${encodeURIComponent(caseId)}`);
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    console.warn(`[ML Backend] Fallback used for case ${caseId}:`, err);
  }

  const found = MOCK_CASES.find((c) => c.id.toLowerCase() === caseId.toLowerCase());
  return found ? { ...found } : null;
}
