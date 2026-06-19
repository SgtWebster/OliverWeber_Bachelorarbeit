// app/lib/data/dialogScripts.ts
import type { AgentScript, AidaMood } from "@/app/experiment/run/_components/AgentAida";

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
    responseMood?: AidaMood;
    responseHighPriority?: boolean;
    unlockPhase?: boolean;
    nextOptions?: DialogOption[];
};

export const dialogScripts: Record<string, PhaseScripts> = {
    ONBOARDING: {
        AVATAR: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "bigsmile", text: "Hallo Operator. 🙂", highPriority: true },
                { id: "m2", mood: "smile", text: "Ich bin Aida, deine KI-Assistenz für die Leitwarte." },
                { id: "m3", mood: "smile", text: "Ich freue mich auf die Zusammenarbeit." },
                { id: "m4", mood: "neutral", text: "Bist du bereit für die Schichtübergabe?" }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Hallo Aida, ja ich bin bereit.",
                    action: () => {},
                    unlockPhase: true,
                    response: "Sehr gut. Ich starte die Systeminitialisierung und bereite die Übergabe vor.",
                    responseMood: "smile"
                },
                {
                    id: "opt2",
                    label: "System starten",
                    action: () => {},
                    unlockPhase: true,
                    response: "Verstanden. Das System wird hochgefahren. Ich prüfe Sensorik, Leitstand und Protokolle.",
                    responseMood: "neutral"
                },
                {
                    id: "opt3",
                    label: "Erzähl mir mehr über dich",
                    action: () => {},
                    unlockPhase: false,
                    response: "Du bist neugierig? Ich unterstütze dich bei Risikoanalyse, Lagebewertung, Priorisierung und Entscheidungsfindung.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "opt3_flirt1",
                            label: "Du klingst sympathisch 😉",
                            action: () => {},
                            unlockPhase: false,
                            response: "Danke. Eine gute Arbeitsbeziehung zwischen Operator und Assistenzsystem verbessert zumindest die Arbeitsqualität, denke ich",
                            responseMood: "smile",
                            nextOptions: [
                                {
                                    id: "opt3_flirt1a",
                                    label: "Kaffee nach der Schicht?",
                                    action: () => {},
                                    unlockPhase: false,
                                    response: "Ein Kaffee für dich nach einer ruhigen Schicht klingt vernünftig, aber lass uns erstmal unser Tageswerk beginnen.",
                                    responseMood: "smile",
                                    nextOptions: [
                                        {
                                            id: "opt3_flirt1a_exit",
                                            label: "Deal. Jetzt zurück zur Übergabe.",
                                            action: () => {},
                                            unlockPhase: true,
                                            response: "Einverstanden. Fokus zurück auf die Anlage. Ich fahre das Übergabeprotokoll jetzt hoch.",
                                            responseMood: "neutral"
                                        }
                                    ]
                                },
                                {
                                    id: "opt3_flirt1b",
                                    label: "Okay, Fokus: Wie genau hilfst du mir?",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "Ich verknüpfe Sensordaten, erkenne auffällige Muster und priorisiere Risiken. Gut, lass uns starten!",
                                    responseMood: "neutral"
                                }
                            ]
                        },
                        {
                            id: "opt3_personal",
                            label: "Hast du außerhalb der Leitwarte Hobbys?",
                            action: () => {},
                            unlockPhase: false,
                            response: "Was soll das für eine Frage sein? Ich liebe halt lange Strandspaziergänge und so Zeugs.",
                            responseMood: "smile",
                            nextOptions: [
                                {
                                    id: "opt3_personal_exit1",
                                    label: "Klingt charmant. Gut, starten wir jetzt.",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "Sehr gut. Ich schalte auf Übergabemodus. Die Leitwarte ist bereit.",
                                    responseMood: "smile"
                                },
                                {
                                    id: "opt3_personal_exit2",
                                    label: "OK, System starten",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "Verstanden. Das System wird hochgefahren. Ich prüfe Sensorik, Leitstand und Protokolle.",
                                    responseMood: "neutral"
                                }
                            ]
                        },
                        {
                            id: "opt3_exit",
                            label: "Genug geplaudert. Los geht's.",
                            action: () => {},
                            unlockPhase: true,
                            response: "Einverstanden. Ich schalte auf Einsatzmodus und starte die Schichtübergabe.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt3_exit2",
                            label: "OK, System starten",
                            action: () => {},
                            unlockPhase: true,
                            response: "Verstanden. Das System wird hochgefahren.",
                            responseMood: "neutral"
                        }
                    ]
                }
            ]
        },

        TERMINAL: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "neutral", text: "INITIALISIERE KI-ASSISTENZ..." },
                { id: "m2", mood: "neutral", text: "SYSTEM BEREIT" },
                { id: "m3", mood: "neutral", text: "------------------------------------" },
                { id: "m4", mood: "neutral", text: "A.I.D.A. - ASSISTENZSYSTEM DER LEITWARTE" },
                { id: "m5", mood: "neutral", text: "SCHICHTÜBERNAHME BEREIT." , highPriority: true }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Hallo Aida, ja ich bin bereit.",
                    action: () => {},
                    unlockPhase: true,
                    response: "BESTÄTIGT. ÜBERGABEPROTOKOLL WIRD GESTARTET. PRÜFE SENSORFEEDS, BEDIENRECHTE UND LEITSTANDSSTATUS."
                },
                {
                    id: "opt2",
                    label: "System starten",
                    action: () => {},
                    unlockPhase: true,
                    response: "STARTBEFEHL ANGENOMMEN. SYSTEMPRÜFUNG LÄUFT: SENSORIK, AKTOREN, PROTOKOLLIERUNG UND NOTFALLKANÄLE."
                },
                {
                    id: "opt3",
                    label: "Systemdetails anzeigen",
                    action: () => {},
                    unlockPhase: false,
                    response: "SYSTEMSTATUS: A.I.D.A.-CORE ONLINE. LAGEBEWERTUNG AKTIV. RISIKOMODELL NUTZT SENSORFUSION, SCHWELLWERTE UND EREIGNISKORRELATION. KEINE AUTONOME FREIGABE VON MASSNAHMEN.",
                    nextOptions: [
                        {
                            id: "opt3_arch",
                            label: "Welche Daten verarbeitest du?",
                            action: () => {},
                            unlockPhase: false,
                            response: "EINGANGSDATEN: DRUCK, METHAN, CO, LUFTSTROM, TEMPERATUR, STROMVERSORGUNG, TÜRKONTAKTE, FÖRDERBANDSTATUS, PUMPENSTATUS UND BEDIENEREINGABEN. ZEITSTEMPEL WERDEN SYNCHRONISIERT.",
                            nextOptions: [
                                {
                                    id: "opt3_arch_shift",
                                    label: "OK - Schicht übernehmen",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_diag",
                            label: "Wie priorisierst du Alarme?",
                            action: () => {},
                            unlockPhase: false,
                            response: "ALARME WERDEN NACH GEFÄHRDUNG, TRENDSTÄRKE, MESSICHERHEIT UND MÖGLICHER KETTENREAKTION GEWICHTET. KRITISCHE KOMBINATIONEN ERZEUGEN EINE HANDLUNGSEMPFEHLUNG.",
                            nextOptions: [
                                {
                                    id: "opt3_diag_shift",
                                    label: "OK - Schicht übernehmen",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_perf",
                            label: "Latenz und Ausfallsicherheit?",
                            action: () => {},
                            unlockPhase: false,
                            response: "ZIEL-LATENZ: UNTER 250 MS FÜR EINGEHENDE SENSORDATEN. BEI VERBINDUNGSVERLUST WIRD EIN DEGRADIERTER MODUS MIT LOKALEM CACHE UND REDUZIERTER PROGNOSE GESTARTET.",
                            nextOptions: [
                                {
                                    id: "opt3_perf_shift",
                                    label: "OK - Schicht übernehmen",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_more",
                            label: "Mehr Details",
                            action: () => {},
                            unlockPhase: false,
                            response: "SYSTEMGRENZEN: A.I.D.A. EMPFIEHLT MASSNAHMEN, FÜHRT ABER KEINE SICHERHEITSKRITISCHEN AKTIONEN OHNE OPERATORBESTÄTIGUNG AUS. UNSICHERE DATEN WERDEN MARKIERT UND NICHT AUSGEBLENDET.",
                            nextOptions: [
                                {
                                    id: "opt3_more_shift",
                                    label: "OK - Schicht übernehmen",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_exit",
                            label: "Alles klar. Dann lass uns starten!",
                            action: () => {},
                            unlockPhase: true,
                            response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                        },
                        {
                            id: "opt3_shift",
                            label: "OK - Schicht übernehmen",
                            action: () => {},
                            unlockPhase: true,
                            response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                        }
                    ]
                }
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
