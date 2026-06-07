// lib/store/experimentStore.ts
import { create } from 'zustand';

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

    // Actions, um den State von überall aus zu verändern
    setSessionId: (id: string) => void;
    setPhase: (phase: ExperimentPhase) => void;
    setGroup: (group: ExperimentGroup) => void;
}

// 4. Erstellung des eigentlichen Stores
export const useExperimentStore = create<ExperimentState>((set) => ({
    // Initiale Werte beim Start der App
    sessionId: null,
    currentPhase: 'INIT',
    group: null,

    // Funktionen zum Updaten der Werte
    setSessionId: (id) => set({ sessionId: id }),
    setPhase: (phase) => set({ currentPhase: phase }),
    setGroup: (group) => set({ group }),
}));