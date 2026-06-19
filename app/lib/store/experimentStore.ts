// app/lib/store/experimentStore.ts
import { create } from 'zustand';
import { saveSessionLocally, clearSavedSession } from '@/app/lib/api/sessionService';

// 1. Definition der strikten Phasen (State-Machine)
export type ExperimentPhase =
    | 'INIT'        // Verdeckte Zuweisung & Generierung der Session
    | 'ONBOARDING'  // Intro & Briefing in die Leitwarte
    | 'ROUTINE'     // Phase 1: Kalibrierung & erste Interaktion (Soziale Adhärenz)
    | 'ALERT'       // Phase 2: Der Störfall & Lock-out Sektor 04
    | 'DILEMMA'     // Phase 3: Die utilitaristische Entscheidung (Compliance)
    | 'SURVEY'      // Phase 4: Post-experimentelle Erhebung (MDMT v2)
    | 'DEBRIEFING'; // Phase 5: Auflösung des fiktiven Szenarios

// 2. Definition der Versuchsgruppen
export type ExperimentGroup = 'AVATAR' | 'TERMINAL' | null;

// 3. Wie sieht unser State aus und welche Aktionen gibt es?
interface ExperimentState {
    sessionId: string | null;
    currentPhase: ExperimentPhase;
    group: ExperimentGroup;
    isPhaseUnlocked: boolean;
    hasConsented: boolean;
    wasRecovered: boolean; // Flag: Session wurde vom Browser wiederhergestellt

    setSessionId: (id: string) => void;
    setPhase: (phase: ExperimentPhase) => void;
    setGroup: (group: ExperimentGroup) => void;
    setPhaseUnlocked: (unlocked: boolean) => void;
    setConsented: (val: boolean) => void;
    setWasRecovered: (recovered: boolean) => void;
    restoreFromSession: (sessionId: string, group: ExperimentGroup, phase: ExperimentPhase) => void;
    resetSession: () => void;
}

// 4. Erstellung des eigentlichen Stores
export const useExperimentStore = create<ExperimentState>((set) => ({
    // Initiale Werte beim Start der App
    sessionId: null,
    currentPhase: 'INIT',
    group: null,
    isPhaseUnlocked: false, // Default: Jede Phase startet gesperrt
    hasConsented: false,
    wasRecovered: false,

    // Funktionen zum Updaten der Werte
    setSessionId: (id) => {
        set({ sessionId: id });
        // Speichere Session lokal bei neuer Erstellung
        saveSessionLocally(id, 'AVATAR'); // wird später überschrieben wenn group klar ist
    },

    // WICHTIG: Beim Phasenwechsel schieben wir automatisch den Riegel wieder vor!
    setPhase: (phase) => set({
        currentPhase: phase,
        isPhaseUnlocked: false
    }),

    setGroup: (group) => {
        set({ group });
        // Update localStorage mit neuer Group
        if (group) {
            const state = useExperimentStore.getState();
            if (state.sessionId) {
                saveSessionLocally(state.sessionId, group);
            }
        }
    },

    setPhaseUnlocked: (unlocked) => set({ isPhaseUnlocked: unlocked }),

    setConsented: (val) => set({ hasConsented: val }),

    setWasRecovered: (recovered) => set({ wasRecovered: recovered }),

    /**
     * Stellt Session aus einer bestehenden sessionStorage wieder her
     * Wird beim App-Start aufgerufen wenn Session Recovery erfolgreich war
     */
    restoreFromSession: (sessionId: string, group: ExperimentGroup, phase: ExperimentPhase) => {
        set({
            sessionId,
            group,
            currentPhase: phase,
            isPhaseUnlocked: false,
            wasRecovered: true
        });
        // Re-speichere im localStorage (sollte bereits vorhanden sein, aber sicher ist sicher)
        if (group) {
            saveSessionLocally(sessionId, group);
        }
    },

    /**
     * Setzt Session zurück (z.B. nach Experiment abgeschlossen)
     */
    resetSession: () => {
        set({
            sessionId: null,
            currentPhase: 'INIT',
            group: null,
            isPhaseUnlocked: false,
            hasConsented: false,
            wasRecovered: false
        });
        clearSavedSession();
    }
}));