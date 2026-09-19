import { Prediction } from '../types/prediction';
import { MOCK_PREDICTION_CASE_007001 } from '../data/mockInvestigation';

export async function fetchPredictionForCase(caseId: string): Promise<Prediction | null> {
  await new Promise((resolve) => setTimeout(resolve, 70));
  if (caseId.toUpperCase() === 'CASE_007001') {
    return { ...MOCK_PREDICTION_CASE_007001 };
  }
  // Generic fallback prediction matching the case ID
  return {
    ...MOCK_PREDICTION_CASE_007001,
    caseId: caseId.toUpperCase(),
    predictedZone: `${caseId.slice(-2)}_Z01`,
  };
}
