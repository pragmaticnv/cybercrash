// Central API Client for connecting CYBERCRASH Frontend with SIH-ML FastAPI Backend

const API_BASE = '/api';
const DIRECT_BACKEND_URL = 'http://127.0.0.1:8000/api';

export interface BackendStatus {
  connected: boolean;
  service?: string;
  model?: string;
  version?: string;
  datasetCases?: number;
  uptimeSeconds?: number;
}

/**
 * Fetch wrapper with timeout and automatic URL fallback
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Try proxy route first (/api/...), fallback to direct port 8000 if running in non-proxy environments
  const urlsToTry = [
    `${API_BASE}${cleanEndpoint}`,
    `${DIRECT_BACKEND_URL}${cleanEndpoint}`
  ];

  let lastError: any = null;

  for (const url of urlsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
      // Continue to next URL attempt
    }
  }

  throw lastError || new Error(`Failed to fetch from ${endpoint}`);
}

/**
 * Check backend connectivity & ML engine health
 */
export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const data = await apiFetch<any>('/health');
    return {
      connected: data?.status === 'ok',
      service: data?.service,
      model: data?.model,
      version: data?.version,
      datasetCases: data?.dataset_cases,
      uptimeSeconds: data?.uptime_seconds
    };
  } catch (err) {
    return {
      connected: false
    };
  }
}
