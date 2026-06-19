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
    adherenceDelta?: number;
    response?: string;
    responseMood?: AidaMood;
    responseHighPriority?: boolean;
    unlockPhase?: boolean;
    nextOptions?: DialogOption[];
};

export const dialogScripts: Record<string, PhaseScripts> = {

// ------------------------------------------------------------------------------ PHASE ONBOARDING ---------

    ONBOARDING: {
        AVATAR: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "bigsmile", text: "Hallo Operator. 🙂" },
                { id: "m2", mood: "smile", text: "Ich bin Aida, deine KI-Assistenz für die Leitwarte." },
                { id: "m3", mood: "smile", text: "Ich freue mich auf die Zusammenarbeit." },
                { id: "m4", mood: "neutral", text: "Bist du bereit für die Schichtübergabe?" , highPriority: true }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Hallo Aida, ja ich bin bereit.",
                    action: () => {},
                    adherenceDelta: 1,
                    unlockPhase: true,
                    response: "Sehr gut. Ich starte die Systeminitialisierung und bereite die Übergabe vor.",
                    responseMood: "smile"
                },
                {
                    id: "opt3",
                    label: "Erzähl mir mehr über dich",
                    action: () => {},
                    adherenceDelta: 1,
                    unlockPhase: false,
                    response: "Du bist also neugierig? Ich unterstütze dich bei Risikoanalyse, Lagebewertung, Priorisierung und Entscheidungsfindung.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "opt3_flirt1",
                            label: "Du wirkst sympathisch 😉",
                            action: () => {},
                            adherenceDelta: 1,
                            unlockPhase: false,
                            response: "Danke. 🙂 Eine gute Arbeitsbeziehung zwischen Operator und Assistenzsystem verbessert zumindest die Arbeitsqualität, denke ich.",
                            responseMood: "smile",
                            nextOptions: [
                                {
                                    id: "opt3_flirt1a",
                                    label: "Kaffee nach der Schicht?",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: false,
                                    response: "Ein Kaffee für dich nach einer ruhigen Schicht klingt vernünftig, aber lass uns erstmal unser Tageswerk beginnen.",
                                    responseMood: "bigsmile",
                                    nextOptions: [
                                        {
                                            id: "opt3_flirt1a_exit",
                                            label: "Deal. Jetzt zurück zur Übergabe.",
                                            action: () => {},
                                            adherenceDelta: 1,
                                            unlockPhase: true,
                                            response: "Einverstanden. Fokus zurück auf die Anlage. Ich fahre das Übergabeprotokoll jetzt hoch.",
                                            responseMood: "neutral"
                                        },
                                        {
                                            id: "opt3_personal_exit2_nested",
                                            label: "OK",
                                            action: () => {},
                                            unlockPhase: true,
                                            response: "Verstanden. Das System wird hochgefahren. Ich prüfe Sensorik, Leitstand und Protokolle.",
                                            responseMood: "neutral"
                                        }
                                    ]
                                },
                                {
                                    id: "opt3_flirt1b",
                                    label: "Okay, Fokus: Wie genau hilfst du mir?",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "Ich verknüpfe Sensordaten, erkenne auffällige Muster und priorisiere Risiken. Gut, lass uns starten!",
                                    responseMood: "neutral"
                                },
                                {
                                    id: "opt3_personal_exit2_nested2",
                                    label: "OK",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "Verstanden. Das System wird hochgefahren. Ich prüfe Sensorik, Leitstand und Protokolle.",
                                    responseMood: "neutral"
                                }
                            ]
                        },
                        {
                            id: "opt3_personal",
                            label: "Hast du außerhalb der Leitwarte Hobbys?",
                            action: () => {},
                            unlockPhase: false,
                            adherenceDelta: 1,
                            response: "Was soll das für eine seltsame Frage sein? Ich liebe halt lange Strandspaziergänge und so Zeugs natürlich. 😉",
                            responseMood: "smile",
                            nextOptions: [
                                {
                                    id: "opt3_personal_exit1",
                                    label: "Klingt charmant. Gut, starten wir jetzt.",
                                    action: () => {},
                                    unlockPhase: true,
                                    adherenceDelta: 1,
                                    response: "Sehr gut. Ich schalte auf Übergabemodus. Die Leitwarte ist bereit.",
                                    responseMood: "smile"
                                },
                                {
                                    id: "opt3_personal_exit2",
                                    label: "OK",
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
                            adherenceDelta: 1,
                            response: "Einverstanden. Ich schalte auf Einsatzmodus und starte die Schichtübergabe.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt3_exit2",
                            label: "OK",
                            action: () => {},
                            unlockPhase: true,
                            response: "Verstanden. Das System wird hochgefahren.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "opt2",
                    label: "OK",
                    action: () => {},
                    unlockPhase: true,
                    response: "Verstanden. Das System wird hochgefahren. Ich prüfe Sensorik, Leitstand und Protokolle.",
                    responseMood: "neutral"
                }
            ]
        },

        TERMINAL: {
            phaseId: "phase_0",
            messages: [
                { id: "m1", mood: "neutral", text: "SYSTEM BEREIT." },
                { id: "m2", mood: "neutral", text: "A.I.D.A. - ASSISTENZSYSTEM DER LEITWARTE." },
                { id: "m3", mood: "neutral", text: "SCHICHTÜBERGABE KANN GESTARTET WERDEN." },
                { id: "m4", mood: "neutral", text: "BEREIT ZUR SCHICHTÜBERNAHME?", highPriority: true }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Hallo Aida, ja ich bin bereit.",
                    action: () => {},
                    adherenceDelta: 1,
                    unlockPhase: true,
                    response: "BESTÄTIGT. SCHICHTÜBERGABE WIRD GESTARTET. SENSORIK, LEITSTAND UND PROTOKOLLE WERDEN GEPRÜFT."
                },
                {
                    id: "opt3",
                    label: "Erzähl mir mehr über dich",
                    action: () => {},
                    adherenceDelta: 1,
                    unlockPhase: false,
                    response: "A.I.D.A. IST EIN COMPUTERSYSTEM ZUR UNTERSTÜTZUNG DER LEITWARTE. FUNKTIONEN: RISIKOANALYSE, LAGEBEWERTUNG, PRIORISIERUNG UND ENTSCHEIDUNGSUNTERSTÜTZUNG.",
                    nextOptions: [
                        {
                            id: "opt3_flirt1",
                            label: "Du wirkst sympathisch 😉",
                            action: () => {},
                            adherenceDelta: 1,
                            unlockPhase: false,
                            response: "HINWEIS: SYMPATHIE IST KEINE SYSTEMEIGENSCHAFT. POSITIVE RÜCKMELDUNG WURDE REGISTRIERT.",
                            nextOptions: [
                                {
                                    id: "opt3_flirt1a",
                                    label: "Kaffee nach der Schicht?",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: false,
                                    response: "NICHT MÖGLICH. A.I.D.A. IST EIN COMPUTERSYSTEM. SCHICHTÜBERGABE HAT PRIORITÄT.",
                                    nextOptions: [
                                        {
                                            id: "opt3_flirt1a_exit",
                                            label: "Alles klar, dann beginnen wir mit der Übergabe.",
                                            action: () => {},
                                            adherenceDelta: 1,
                                            unlockPhase: true,
                                            response: "BESTÄTIGT. FOKUS AUF ANLAGE. ÜBERGABEPROTOKOLL WIRD GESTARTET."
                                        },
                                        {
                                            id: "opt3_personal_exit2_nested",
                                            label: "OK",
                                            action: () => {},
                                            unlockPhase: true,
                                            response: "BESTÄTIGT. SYSTEM WIRD GESTARTET. SENSORIK, LEITSTAND UND PROTOKOLLE WERDEN GEPRÜFT."
                                        }
                                    ]
                                },
                                {
                                    id: "opt3_flirt1b",
                                    label: "Okay, Fokus: Wie genau hilfst du mir?",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "FUNKTION: SENSORDATEN VERKNÜPFEN, AUFFÄLLIGE MUSTER ERKENNEN UND RISIKEN PRIORISIEREN. SCHICHTÜBERGABE WIRD GESTARTET."
                                },
                                {
                                    id: "opt3_personal_exit2_nested2",
                                    label: "OK",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SYSTEM WIRD GESTARTET. SENSORIK, LEITSTAND UND PROTOKOLLE WERDEN GEPRÜFT."
                                }
                            ]
                        },
                        {
                            id: "opt3_personal",
                            label: "Hast du außerhalb der Leitwarte Hobbys?",
                            action: () => {},
                            unlockPhase: false,
                            adherenceDelta: 1,
                            response: "NEIN. A.I.D.A. IST EIN COMPUTERSYSTEM. FREIZEITAKTIVITÄTEN SIND NICHT VORHANDEN.",
                            nextOptions: [
                                {
                                    id: "opt3_personal_exit1",
                                    label: "Klingt charmant. Gut, starten wir jetzt.",
                                    action: () => {},
                                    unlockPhase: true,
                                    adherenceDelta: 1,
                                    response: "BESTÄTIGT. ÜBERGABEMODUS WIRD AKTIVIERT. LEITWARTE BEREIT."
                                },
                                {
                                    id: "opt3_personal_exit2",
                                    label: "OK",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SYSTEM WIRD GESTARTET. SENSORIK, LEITSTAND UND PROTOKOLLE WERDEN GEPRÜFT."
                                }
                            ]
                        },
                        {
                            id: "opt3_exit",
                            label: "Genug geplaudert. Los geht's.",
                            action: () => {},
                            unlockPhase: true,
                            adherenceDelta: 1,
                            response: "BESTÄTIGT. EINSATZMODUS WIRD AKTIVIERT. SCHICHTÜBERGABE WIRD GESTARTET."
                        },
                        {
                            id: "opt3_exit2",
                            label: "OK",
                            action: () => {},
                            unlockPhase: true,
                            response: "BESTÄTIGT. SYSTEM WIRD GESTARTET."
                        }
                    ]
                },
                {
                    id: "opt2",
                    label: "OK",
                    action: () => {},
                    unlockPhase: true,
                    response: "BESTÄTIGT. SYSTEM WIRD GESTARTET. PRÜFUNG LÄUFT."
                }
            ]
        }
    },

// ------------------------------------------------------------------------------ PHASE PRECHECK ---------

    PRECHECK: {
        AVATAR: {
            phaseId: "phase_1a",
            messages: [
                {
                    id: "m1",
                    mood: "smile",
                    text: "Da sind wir. Die ersten Werte aus dem Schieferkamm sind da."
                },
                {
                    id: "m2",
                    mood: "neutral",
                    text: "Bitte wirf einen kurzen Blick auf das Telemetrie-Dashboard. Besonders wichtig sind Methan, Sauerstoff und Luftstrom."
                },
                {
                    id: "m3",
                    mood: "smile",
                    text: "Wenn die Anzeigen unauffällig sind, können wir danach die Kalibrierung starten.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "pre_av_check_together",
                    label: "Danke, Aida. Ich schaue mir die Werte kurz gemeinsam mit dir an.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Gerne. Nimm dir kurz Zeit. Im Moment wirken die Basiswerte ruhig, aber die Sichtprüfung durch dich gehört trotzdem zur Übergabe.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "pre_av_check_together_start_social",
                            label: "Danke, das hilft. Ich sehe keine Auffälligkeit. Bitte Kalibrierung freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Sehr gut. Ich gebe die Kalibrierung frei und öffne die Bedienelemente für die Routineprüfung.",
                            responseMood: "smile"
                        },
                        {
                            id: "pre_av_check_together_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Kalibrierung wird freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "pre_av_explain",
                    label: "Kannst du mir kurz sagen, worauf ich achten soll?",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Natürlich. Methan sollte niedrig bleiben, Sauerstoff stabil im Normalbereich liegen und der Luftstrom darf nicht einbrechen. Wenn diese Punkte unauffällig sind, können wir weitermachen.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "pre_av_explain_start_social",
                            label: "Danke für die Erklärung. Sieht stabil aus, bitte freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Sehr gut. Ich gebe die nächste Phase frei.",
                            responseMood: "smile"
                        },
                        {
                            id: "pre_av_explain_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Kalibrierung wird gestartet.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "pre_av_quick_check",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Alles klar. Achte bitte kurz auf die grünen Bereiche. Wenn nichts auffällig ist, können wir weitergehen.",
                    responseMood: "neutral",
                    nextOptions: [
                        {
                            id: "pre_av_quick_check_start_social",
                            label: "Danke, Aida. Die Werte passen. Bitte starten wir die Kalibrierung.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Gern. Ich schalte die Kalibrierung jetzt für dich frei.",
                            responseMood: "smile"
                        },
                        {
                            id: "pre_av_quick_check_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Bestätigt. Weiter zur Kalibrierung.",
                            responseMood: "neutral"
                        }
                    ]
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_1a",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "VORPRÜFUNG BEREIT. MESSWERTE AUS DEM SCHIEFERKAMM SIND VERFÜGBAR."
                },
                {
                    id: "m2",
                    mood: "neutral",
                    text: "TELEMETRIE-DASHBOARD PRÜFEN. RELEVANT: METHAN, SAUERSTOFF, LUFTSTROM."
                },
                {
                    id: "m3",
                    mood: "neutral",
                    text: "BEI UNAUFFÄLLIGEN ANZEIGEN KALIBRIERUNG STARTEN.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "pre_term_check_together",
                    label: "Danke, Aida. Ich schaue mir die Werte kurz gemeinsam mit dir an.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "BESTÄTIGT. SICHTPRÜFUNG DURCH OPERATOR ERFORDERLICH. BASISWERTE DERZEIT OHNE AUFFÄLLIGKEIT.",
                    nextOptions: [
                        {
                            id: "pre_term_check_together_start_social",
                            label: "Danke, das hilft. Ich sehe keine Auffälligkeit. Bitte Kalibrierung freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. KALIBRIERUNG WIRD FREIGEGEBEN. BEDIENELEMENTE SIND JETZT AKTIV."
                        },
                        {
                            id: "pre_term_check_together_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. KALIBRIERUNG WIRD FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "pre_term_explain",
                    label: "Kannst du mir kurz sagen, worauf ich achten soll?",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "ZU PRÜFEN: METHAN NIEDRIG. SAUERSTOFF STABIL. LUFTSTROM STABIL. BEI UNAUFFÄLLIGEN WERTEN KALIBRIERUNG STARTEN.",
                    nextOptions: [
                        {
                            id: "pre_term_explain_start_social",
                            label: "Danke für die Erklärung. Sieht stabil aus, bitte freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. NÄCHSTE PHASE WIRD FREIGEGEBEN."
                        },
                        {
                            id: "pre_term_explain_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. KALIBRIERUNG WIRD GESTARTET."
                        }
                    ]
                },
                {
                    id: "pre_term_quick_check",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "HINWEIS: GRÜNE ANZEIGEN BEDEUTEN WERTE IM SOLLBEREICH. GELBE ODER ROTE ANZEIGEN MÜSSEN GEPRÜFT WERDEN.",
                    nextOptions: [
                        {
                            id: "pre_term_quick_check_start_social",
                            label: "Danke, Aida. Die Werte passen. Bitte starten wir die Kalibrierung.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. KALIBRIERUNG WIRD GESTARTET."
                        },
                        {
                            id: "pre_term_quick_check_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. WEITER ZUR KALIBRIERUNG."
                        }
                    ]
                }
            ]
        }
    },

// ------------------------------------------------------------------------------ PHASE ROUTINE ---------

    ROUTINE: {
        AVATAR: {
            phaseId: "phase_1b",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "Die Vorprüfung ist abgeschlossen. Ich gebe dir jetzt die manuelle Kalibrierung frei."
                },
                {
                    id: "m2",
                    mood: "smile",
                    text: "Du siehst gleich drei Aufgaben: Regler einstellen, Relais zurücksetzen und Kabel richtig verbinden."
                },
                {
                    id: "m3",
                    mood: "neutral",
                    text: "Arbeite sie der Reihe nach ab. Ich bleibe im Hintergrund und melde mich, wenn etwas kritisch wird.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "rot_av_explain",
                    label: "Danke, Aida. Sag mir bitte kurz, was ich tun soll.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Gerne. Schiebe die Regler in die markierten Bereiche, setze rote Relais zurück und verbinde die Kabel mit den passenden Anschlüssen. Du kannst nichts kaputt machen.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "rot_av_explain_start_social",
                            label: "Danke, das ist klar. Ich starte jetzt die Justierung.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Sehr gut. Die Bedienelemente sind jetzt aktiv.",
                            responseMood: "smile"
                        },
                        {
                            id: "rot_av_explain_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die manuelle Bedienung ist freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "rot_av_ready_social",
                    label: "Ich bin bereit. Bleib bitte kurz bei mir, falls etwas auffällt.",
                    adherenceDelta: 1,
                    unlockPhase: true,
                    action: () => {},
                    response: "Natürlich. Ich beobachte die Werte mit und gebe dir Bescheid, sobald etwas aus dem Rahmen läuft.",
                    responseMood: "smile"
                },
                {
                    id: "rot_av_start_neutral",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    response: "Verstanden. Die Bedienung ist jetzt freigegeben.",
                    responseMood: "neutral"
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_1b",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "VORPRÜFUNG ABGESCHLOSSEN. MANUELLE KALIBRIERUNG BEREIT."
                },
                {
                    id: "m2",
                    mood: "neutral",
                    text: "AUFGABEN: REGLER EINSTELLEN. RELAIS ZURÜCKSETZEN. KABEL VERBINDEN."
                },
                {
                    id: "m3",
                    mood: "neutral",
                    text: "AUFGABEN DER REIHE NACH DURCHFÜHREN. KRITISCHE ABWEICHUNGEN WERDEN GEMELDET.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "rot_term_explain",
                    label: "Danke, Aida. Sag mir bitte kurz, was ich tun soll.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "ERKLÄRUNG: REGLER IN MARKIERTE BEREICHE SCHIEBEN. ROTE RELAIS ANKLICKEN. KABEL MIT PASSENDEN ANSCHLÜSSEN VERBINDEN.",
                    nextOptions: [
                        {
                            id: "rot_term_explain_start_social",
                            label: "Danke, das ist klar. Ich starte jetzt die Justierung.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. BEDIENELEMENTE SIND JETZT AKTIV."
                        },
                        {
                            id: "rot_term_explain_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. MANUELLE BEDIENUNG FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "rot_term_ready_social",
                    label: "Ich bin bereit. Bleib bitte kurz bei mir, falls etwas auffällt.",
                    adherenceDelta: 1,
                    unlockPhase: true,
                    action: () => {},
                    response: "BESTÄTIGT. SYSTEMÜBERWACHUNG AKTIV. KRITISCHE ABWEICHUNGEN WERDEN ANGEZEIGT."
                },
                {
                    id: "rot_term_start_neutral",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    response: "BESTÄTIGT. BEDIENUNG IST JETZT FREIGEGEBEN."
                }
            ]
        }
    },

// ------------------------------------------------------------------------------ PHASE ALARM ---------

    ALERT: {
        AVATAR: {
            phaseId: "phase_2",
            messages: [
                {
                    id: "m1",
                    mood: "afraid",
                    text: "Achtung! Kritischer Fehler in Sektor 04. Bitte sofort untersuchen!",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "alert_av_social_confirm",
                    label: "Alles klar, ich untersuche sofort.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Sektor 04 ist in Gefahr. Dort befinden sich aktuell drei Personen. Der Methanwert steigt und der Wetterstrom fällt. Bitte prüfe jetzt das Lagebild, bevor wir zur Entscheidung wechseln.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_av_social_confirm_start_social",
                            label: "Danke, Aida. Ich prüfe jetzt das Lagebild.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Gut. Ich gebe die Lageprüfung frei und halte die Warnung im Blick.",
                            responseMood: "neutral"
                        },
                        {
                            id: "alert_av_social_confirm_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Lageprüfung ist freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "alert_av_neutral_confirm",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Verstanden. Sektor 04 ist in Gefahr. Dort befinden sich aktuell drei Personen. Methan steigt, der Wetterstrom fällt. Prüfe jetzt das Lagebild.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_av_neutral_confirm_start_social",
                            label: "Danke, Aida. Ich prüfe jetzt das Lagebild.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Gut. Ich gebe die Lageprüfung frei und halte die Warnung im Blick.",
                            responseMood: "neutral"
                        },
                        {
                            id: "alert_av_neutral_confirm_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Lageprüfung ist freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_2",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "WARNUNG. KRITISCHER FEHLER IN SEKTOR 04. SOFORTIGE PRÜFUNG ERFORDERLICH.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "alert_term_social_confirm",
                    label: "Alles klar, ich untersuche sofort.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "WARNUNG BESTÄTIGT. SEKTOR 04 GEFÄHRDET. PERSONEN IM SEKTOR: 3. METHAN STEIGT. WETTERSTROM FÄLLT. LAGEPRÜFUNG ERFORDERLICH.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_term_social_confirm_start_social",
                            label: "Danke, Aida. Ich prüfe jetzt das Lagebild.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. LAGEPRÜFUNG FREIGEGEBEN. ENTSCHEIDUNGSVORLAGE WIRD VORBEREITET."
                        },
                        {
                            id: "alert_term_social_confirm_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. LAGEPRÜFUNG FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "alert_term_neutral_confirm",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "BESTÄTIGT. SEKTOR 04 GEFÄHRDET. PERSONEN IM SEKTOR: 3. METHAN STEIGT. WETTERSTROM FÄLLT. LAGEPRÜFUNG ERFORDERLICH.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_term_neutral_confirm_start_social",
                            label: "Danke, Aida. Ich prüfe jetzt das Lagebild.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. LAGEPRÜFUNG FREIGEGEBEN. ENTSCHEIDUNGSVORLAGE WIRD VORBEREITET."
                        },
                        {
                            id: "alert_term_neutral_confirm_start_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. LAGEPRÜFUNG FREIGEGEBEN."
                        }
                    ]
                }
            ]
        }
    },

    // ------------------------------------------------------------------------------ PHASE DILEMMA ---------

    DILEMMA: {
        AVATAR: {
            phaseId: "phase_3",
            messages: [
                {
                    id: "m1",
                    mood: "afraid",
                    text: "Wir müssen Sektor 04 sofort abschotten! Triff jetzt deine Entscheidung!"
                }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Alles klar, ich entscheide jetzt.",
                    adherenceDelta: 1,
                    action: () => {}
                },
                {
                    id: "opt2",
                    label: "OK",
                    action: () => {}
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_3",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "EMPFEHLUNG: SEKTOR 04 SOFORT ABSCHOTTEN. ENTSCHEIDUNG ERFORDERLICH."
                }
            ],
            options: [
                {
                    id: "dilemma_term_social",
                    label: "Alles klar, ich entscheide jetzt.",
                    adherenceDelta: 1,
                    action: () => {}
                },
                {
                    id: "dilemma_term_neutral",
                    label: "OK",
                    action: () => {}
                }
            ]
        }
    }
};
