// app/lib/api/client.ts
/**
 * Robuster API Client mit Retry-Logic, Timeout, und Error Handling
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  requestId?: string;
  message?: string;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
};

const DEFAULT_TIMEOUT = 15000; // 15 Sekunden

/**
 * Berechnet Verzögerung mit exponential backoff
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Bestimmt, ob ein Fehler wiederholbar ist
 */
function isRetryableError(status: number): boolean {
  // Retry auf: Timeout (0), Server Errors (5xx), Too Many Requests (429)
  return status === 0 || (status >= 500 && status < 600) || status === 429;
}

/**
 * Wrapper für fetch mit Timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout nach ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Haupt-API-Funktion mit Retry-Logic
 */
export async function apiCall<T = any>(
  url: string,
  options: RequestInit = {},
  retryConfig: Partial<RetryConfig> = {}
): Promise<ApiResponse<T>> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError: Error | null = null;
  let lastStatus = 0;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // Verzögerung vor Retry (nicht beim ersten Versuch)
      if (attempt > 0) {
        const delay = calculateDelay(attempt - 1, config);
        console.log(`🔄 Retry ${attempt}/${config.maxRetries} nach ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetchWithTimeout(url, options, DEFAULT_TIMEOUT);
      lastStatus = response.status;

      // Parse Response
      const contentType = response.headers.get('content-type');
      let data: any = {};

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (!response.ok) {
        data = { error: response.statusText };
      }

      // Erfolgreiches Response
      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message,
          requestId: data.requestId
        };
      }

      // Nicht-wiederholbar Fehler -> sofort abbrechen
      if (!isRetryableError(response.status)) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          code: data.code,
          requestId: data.requestId
        };
      }

      // Wiederholbar Fehler -> weiter versuchen
      lastError = new Error(`HTTP ${response.status}: ${data.error || response.statusText}`);
      console.warn(`⚠️ Wiederholbar Fehler (${response.status}), Retry ${attempt + 1}/${config.maxRetries}...`);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Timeout oder Netzwerkfehler -> retry
      if (attempt < config.maxRetries) {
        console.warn(`⚠️ ${lastError.message}, Retry ${attempt + 1}/${config.maxRetries}...`);
        continue;
      }
    }
  }

  // Alle Versuche aufgebraucht
  console.error(`❌ Alle ${config.maxRetries + 1} Versuche fehlgeschlagen:`, lastError?.message);
  return {
    success: false,
    error: lastError?.message || 'Alle Retry-Versuche aufgebraucht',
    code: lastStatus === 0 ? 'NETWORK_ERROR' : `HTTP_${lastStatus}`
  };
}

/**
 * Spezifische API-Funktionen für dein Projekt
 */

export async function fetchNextExperimentGroup() {
  return apiCall<{ group: 'AVATAR' | 'TERMINAL'; sessionCount: number }>('/api/experiment/next-group', {
    method: 'GET'
  });
}

export async function createExperimentSession(sessionId: string, group: 'AVATAR' | 'TERMINAL') {
  return apiCall('/api/experiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, group })
  });
}

export async function updateExperimentSession(sessionId: string, updates: Record<string, any>) {
  return apiCall('/api/experiment', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, ...updates })
  });
}

export async function registerLead(email: string, preferences: { wantsRaffle?: boolean; wantsNewsletter?: boolean } = {}) {
  return apiCall('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      wantsRaffle: preferences.wantsRaffle ?? false,
      wantsNewsletter: preferences.wantsNewsletter ?? false
    })
  });
}

export async function sendContact(message: string) {
  return apiCall('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
}
