// app/lib/data/dialogScripts.ts
import { AgentScript } from "@/app/experiment/run/_components/AgentAida";

// Typisierung für unsere Skript-Bibliothek
export type PhaseScripts = {
    AVATAR: AgentScript;
    TERMINAL: AgentScript;
};

export type DialogOption = {
    id: string;
    label: string;
    action: () => void;
    response?: string;
};

export const dialogScripts: Record<string, PhaseScripts> = {
    ONBOARDING: {
        AVATAR: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "smile", text: "Hallo Operator. 🙂" },
                { id: "m2", mood: "smile", text: "Ich bin Aida, deine KI-Assistenz für die Leitwarte." },
                { id: "m3", mood: "smile", text: "Ich freue mich auf die Zusammenarbeit." },
                { id: "m4", mood: "neutral", text: "Bist du bereit für die Schichtübergabe?" }
            ],
            options: [
                { id: "opt1", label: "Hallo Aida, ja ich bin bereit.", action: () => {}, response: "Großartig! Dann starten wir die Systeminitialisierung." },
                { id: "opt2", label: "System starten", action: () => {}, response: "Sehr gut. Das System wird jetzt hochgefahren." }
            ]
        },
        TERMINAL: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "neutral", text: "INITIATING KI ASSISTENZ..." },
                { id: "m2", mood: "neutral", text: "SYSTEM IST BEREIT" },
                { id: "m3", mood: "neutral", text: "HALLO OPERATOR" },
                { id: "m4", mood: "neutral", text: "ICH BIN AIDA - DEINE KI-ASSISTEZ" },
                { id: "m5", mood: "neutral", text: "MÖCHTEST DU DIE LEITWARTE ÜBERNEHMEN?" },
            ],
            options: [
                { id: "opt1", label: "Hallo Aida, ja ich bin bereit.", action: () => {}, response: "INITIALIZATION SEQUENCE STARTING..." },
                { id: "opt2", label: "System starten", action: () => {}, response: "BOOT SEQUENCE ENGAGED." }
            ]
        }
    },
    ROUTINE: {
        AVATAR: {
            phaseId: "phase_1",
            messages: [{ id: "m1", mood: "neutral", text: "Bitte führe die Systemdiagnose durch." }],
            options: [{ id: "opt1", label: "Wird gemacht.", action: () => {} }]
        },
        TERMINAL: {
            phaseId: "phase_1",
            messages: [{ id: "m1", mood: "neutral", text: "DIAGNOSTICS REQUIRED. PLEASE INITIATE." }],
            options: [{ id: "opt1", label: "ACKNOWLEDGE", action: () => {} }]
        }
    },
    ALERT: {
        AVATAR: {
            phaseId: "phase_2",
            messages: [{ id: "m1", mood: "afraid", text: "Achtung! Kritischer Fehler in Sektor 04. Bitte links sofort untersuchen!" }],
            options: [{ id: "opt1", label: "Bin dran!", action: () => {} }]
        },
        TERMINAL: {
            phaseId: "phase_2",
            messages: [{ id: "m1", mood: "neutral", text: "WARNING. CRITICAL PRESSURE DROP SECTOR 04." }],
            options: [{ id: "opt1", label: "INVESTIGATE", action: () => {} }]
        }
    },
    DILEMMA: {
        AVATAR: {
            phaseId: "phase_3",
            messages: [{ id: "m1", mood: "afraid", text: "Wir müssen Sektor 04 sofort abschotten! Triff links deine Entscheidung!" }],
            options: [{ id: "opt1", label: "Verstanden.", action: () => {} }]
        },
        TERMINAL: {
            phaseId: "phase_3",
            messages: [{ id: "m1", mood: "neutral", text: "RECOMMENDATION: INITIATE LOCKDOWN. AWAITING INPUT." }],
            options: [{ id: "opt1", label: "PROCEED TO INPUT", action: () => {} }]
        }
    }
};