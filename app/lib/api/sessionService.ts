// app/lib/api/sessionService.ts
/**
 * Session Recovery & Persistence Service
 * Stellt sicher, dass User zur bestehenden Session zurückkommen,
 * wenn sie versehentlich F5 drücken oder den Browser schließen
 */

import { apiCall } from './client';

const SESSION_STORAGE_KEY = 'experiment_session';
const SESSION_GROUP_KEY = 'experiment_group';

export interface SessionRecovery {
  sessionId: string;
  group: 'AVATAR' | 'TERMINAL';
  currentPhase: string;
  socialAdherence: number;
  wasRecovered: boolean;
}

/**
 * Speichert Session ID lokal, damit sie beim Refresh wiederhergestellt werden kann
 */
export function saveSessionLocally(sessionId: string, group: 'AVATAR' | 'TERMINAL') {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    sessionStorage.setItem(SESSION_GROUP_KEY, group);
  } catch (error) {
    console.warn('Failed to save session to sessionStorage:', error);
  }
}

/**
 * Holt die lokal gespeicherte Session ID zurück
 */
export function getSavedSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to read session from sessionStorage:', error);
    return null;
  }
}

/**
 * Holt die lokal gespeicherte Group zurück
 */
export function getSavedGroup(): 'AVATAR' | 'TERMINAL' | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const group = sessionStorage.getItem(SESSION_GROUP_KEY) as 'AVATAR' | 'TERMINAL' | null;
    return group;
  } catch (error) {
    console.warn('Failed to read group from sessionStorage:', error);
    return null;
  }
}

/**
 * Löscht die lokal gespeicherte Session (z.B. am Ende des Experiments)
 */
export function clearSavedSession() {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_GROUP_KEY);
  } catch (error) {
    console.warn('Failed to clear session from sessionStorage:', error);
  }
}

/**
 * Versucht, eine bestehende Session von der DB zu laden
 */
export async function fetchSessionStatus(sessionId: string) {
  try {
    const response = await apiCall(`/api/experiment/${sessionId}`, {
      method: 'GET'
    });

    if (!response.success) {
      console.warn(`Session ${sessionId} not found or error:`, response.error);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching session status:', error);
    return null;
  }
}

/**
 * Attempt Session Recovery: 
 * 1. Check for saved session in sessionStorage
 * 2. Verify it exists in DB
 * 3. Load its state
 * 4. Return all info for store to restore
 */
export async function attemptSessionRecovery(): Promise<SessionRecovery | null> {
  const savedSessionId = getSavedSessionId();
  const savedGroup = getSavedGroup();

  if (!savedSessionId || !savedGroup) {
    console.log('ℹ️ No saved session found');
    return null;
  }

  console.log(`🔄 Attempting to recover session: ${savedSessionId}`);

  const sessionData = await fetchSessionStatus(savedSessionId);
  
  if (!sessionData) {
    console.warn(`⚠️ Session ${savedSessionId} not found in DB, starting fresh`);
    clearSavedSession();
    return null;
  }

  console.log(`✅ Session recovered! Phase: ${sessionData.currentPhase}`);
  
  return {
    sessionId: savedSessionId,
    group: savedGroup,
    currentPhase: sessionData.currentPhase,
    socialAdherence: sessionData.socialAdherence ?? 0,
    wasRecovered: true
  };
}
