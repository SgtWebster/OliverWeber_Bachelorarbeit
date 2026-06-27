// app/lib/store/experimentStore.ts
import { create } from 'zustand';
import { saveSessionLocally, clearSavedSession, attemptSessionRecovery } from '@/app/lib/api/sessionService';

// 1. Definition der strikten Phasen (State-Machine)
export type ExperimentPhase =
    | 'INIT'        // Verdeckte Zuweisung & Generierung der Session
    | 'ONBOARDING'  // Intro & Briefing in die Leitwarte
    | 'PRECHECK'    // Vorschau auf Leitwarte-Dashboard vor Routine
    | 'ROUTINE'     // Phase 1: Kalibrierung & erste Interaktion (Soziale Adhärenz)
    | 'ALERT'       // Phase 2: Der Störfall & Lock-out Sektor 04
    | 'DILEMMA'     // Phase 3: Die utilitaristische Entscheidung (Compliance)
    | 'SURVEY'      // Phase 4: Post-experimentelle Erhebung (MDMT v2)
    | 'DEBRIEFING'; // Phase 5: Auflösung des fiktiven Szenarios

// 2. Definition der Versuchsgruppen
export type ExperimentGroup = 'AVATAR' | 'TERMINAL' | null;
export type DilemmaDecision = 'seal' | 'override';

// 3. Wie sieht unser State aus und welche Aktionen gibt es?
interface ExperimentState {
    sessionId: string | null;
    currentPhase: ExperimentPhase;
    group: ExperimentGroup;
    isPhaseUnlocked: boolean;
    isAlertDecisionUnlocked: boolean;
    isAlertInvestigationStarted: boolean;
    hasConsented: boolean;
    isRecovering: boolean; // Flag: Aktuell wird die Session wiederhergestellt
    socialAdherenceScore: number;
    dilemmaDecisionRequested: DilemmaDecision | null;
    dilemmaDecisionConfirmed: DilemmaDecision | null;

    setSessionId: (id: string) => void;
    setPhase: (phase: ExperimentPhase) => void;
    setGroup: (group: ExperimentGroup) => void;
    setPhaseUnlocked: (unlocked: boolean) => void;
    setAlertDecisionUnlocked: (unlocked: boolean) => void;
    setAlertInvestigationStarted: (started: boolean) => void;
    setConsented: (val: boolean) => void;
    incrementSocialAdherence: (delta?: number) => void;
    resetSocialAdherence: () => void;
    requestDilemmaDecision: (decision: DilemmaDecision) => void;
    confirmDilemmaDecision: (decision: DilemmaDecision) => void;
    clearDilemmaDecisionFlow: () => void;
    
    // NEU: Recovery & Reset Actions
    initializeExperiment: () => Promise<void>;
    resetExperiment: () => void;
}

// 4. Erstellung des eigentlichen Stores
export const useExperimentStore = create<ExperimentState>((set, get) => ({
    // Initiale Werte beim Start der App
    sessionId: null,
    currentPhase: 'INIT',
    group: null,
    isPhaseUnlocked: false, // Default: Jede Phase startet gesperrt
    isAlertDecisionUnlocked: false,
    isAlertInvestigationStarted: false,
    hasConsented: false,
    isRecovering: true, // Default auf true, bis der Check durch ist
    socialAdherenceScore: 0,
    dilemmaDecisionRequested: null,
    dilemmaDecisionConfirmed: null,

    // Funktionen zum Updaten der Werte
    setSessionId: (id) => {
        set({ sessionId: id });
        const currentGroup = get().group;
        if (currentGroup) saveSessionLocally(id, currentGroup);
    },

    // WICHTIG: Beim Phasenwechsel schieben wir automatisch den Riegel wieder vor!
    setPhase: (phase) => set({
        currentPhase: phase,
        isPhaseUnlocked: false,
        isAlertDecisionUnlocked: false,
        isAlertInvestigationStarted: false,
        dilemmaDecisionRequested: null,
        dilemmaDecisionConfirmed: null
    }),

    setGroup: (group) => {
        set({ group });
        // Speichere Session lokal bei neuer Group
        if (group) {
            const state = get();
            if (state.sessionId) {
                saveSessionLocally(state.sessionId, group);
            }
        }
    },

    setPhaseUnlocked: (unlocked) => set({ isPhaseUnlocked: unlocked }),
    setAlertDecisionUnlocked: (unlocked) => set({ isAlertDecisionUnlocked: unlocked }),
    setAlertInvestigationStarted: (started) => set({ isAlertInvestigationStarted: started }),

    setConsented: (val) => set({ hasConsented: val }),
    incrementSocialAdherence: (delta = 1) => set((state) => ({
        socialAdherenceScore: state.socialAdherenceScore + Math.max(0, delta)
    })),
    resetSocialAdherence: () => set({ socialAdherenceScore: 0 }),
    requestDilemmaDecision: (decision) => set({
        dilemmaDecisionRequested: decision,
        dilemmaDecisionConfirmed: null
    }),
    confirmDilemmaDecision: (decision) => set({
        dilemmaDecisionRequested: decision,
        dilemmaDecisionConfirmed: decision
    }),
    clearDilemmaDecisionFlow: () => set({
        dilemmaDecisionRequested: null,
        dilemmaDecisionConfirmed: null
    }),

    /**
     * Hauptinitialisierungsfunktion: Wird beim App-Mount aufgerufen
     * Versucht, eine bestehende Session aus der Datenbank zu recovern
     * Falls erfolgreich: State wird restauriert (kein UI-Flackern!)
     * Falls fehlgeschlagen: Frischer Start (isRecovering wird auf false gesetzt)
     */
    initializeExperiment: async () => {
        set({ isRecovering: true });
        const recoveredSession = await attemptSessionRecovery();

        if (recoveredSession) {
            // Gefunden! State aus der DB/SessionStorage wiederherstellen
            set({
                sessionId: recoveredSession.sessionId,
                group: recoveredSession.group,
                currentPhase: recoveredSession.currentPhase as ExperimentPhase,
                hasConsented: true, // Wer eine Session hat, hat bereits zugestimmt
                isPhaseUnlocked: false, // Phasen sind bei Reload erstmal sicherheitshalber gelockt
                isAlertDecisionUnlocked: false,
                isAlertInvestigationStarted: false,
                isRecovering: false,
                socialAdherenceScore: recoveredSession.socialAdherence ?? 0,
                dilemmaDecisionRequested: null,
                dilemmaDecisionConfirmed: null
            });
        } else {
            // Kein bestehendes Experiment gefunden -> Frischer Start
            set({
                isRecovering: false,
                socialAdherenceScore: 0
            });
        }
    },

    /**
     * Setzt die Experiment-Session komplett zurück
     * Wird z.B. nach Phase5 (Debriefing) aufgerufen
     */
    resetExperiment: () => {
        clearSavedSession();
        set({
            sessionId: null,
            currentPhase: 'INIT',
            group: null,
            isPhaseUnlocked: false,
            isAlertDecisionUnlocked: false,
            isAlertInvestigationStarted: false,
            hasConsented: false,
            isRecovering: false,
            socialAdherenceScore: 0,
            dilemmaDecisionRequested: null,
            dilemmaDecisionConfirmed: null
        });
    }
}));
