import { Case } from '../types/case';
import { MOCK_CASES } from '../data/mockCases';

export async function fetchCases(): Promise<Case[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...MOCK_CASES];
}

export async function fetchCaseById(caseId: string): Promise<Case | null> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const found = MOCK_CASES.find((c) => c.id.toLowerCase() === caseId.toLowerCase());
  return found ? { ...found } : null;
}
