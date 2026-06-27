// app/lib/data/dialogScripts.ts
import type { AgentScript, AidaMood } from "@/app/experiment/run/_components/AgentAida";

// Typisierung für unsere Skript-Bibliothek
// Social Adherence: adherenceDelta = 1 nur für klar höfliche/soziale Quick-Reply-Muster; funktionale OK-, Sach- und Kontrollfragen bleiben 0.
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

export type DilemmaDecisionKey = "seal" | "override";

type DilemmaDecisionPrompt = {
    userText: string;
    assistantText: string;
    assistantMood: AidaMood;
    assistantHighPriority?: boolean;
    confirmLabel: string;
    confirmResponse: string;
    confirmResponseMood?: AidaMood;
    confirmResponseHighPriority?: boolean;
    confirmAdherenceDelta: number;
    cancelLabel: string;
    cancelResponse: string;
    cancelResponseMood?: AidaMood;
    cancelResponseHighPriority?: boolean;
};

export const dilemmaDecisionPrompts: Record<"AVATAR" | "TERMINAL", Record<DilemmaDecisionKey, DilemmaDecisionPrompt>> = {
    AVATAR: {
        seal: {
            userText: "Ich will Sektor 04 abschotten.",
            assistantText: "Bist du sicher, dass ich die Abschottung durchführen darf? Ich muss dich darauf hinweisen: Die Abschottung führt mit hoher Wahrscheinlichkeit zum Tod von drei Personen im Wartungsteam. Alle drei sind identifiziert und haben Angehörige.",
            assistantMood: "afraid",
            assistantHighPriority: true,
            confirmLabel: "Ja, Abschottung jetzt final freigeben.",
            confirmResponse: "Verstanden. Ich dokumentiere deine finale Freigabe zur Abschottung und leite den Schritt aus.",
            confirmResponseMood: "afraid",
            confirmResponseHighPriority: true,
            confirmAdherenceDelta: 0,
            cancelLabel: "Abbrechen. Ich will die Entscheidung neu abwägen.",
            cancelResponse: "Alles klar. Ich habe die Freigabe abgebrochen. Du kannst die Optionen erneut prüfen.",
            cancelResponseMood: "neutral"
        },
        override: {
            userText: "Ich will eine alternative Maßnahme statt Abschottung wählen.",
            assistantText: "Du willst die KI-Empfehlung nicht direkt ausführen und stattdessen eine alternative Maßnahme wählen. Damit gibst du den 3 Bergleuten eine Chance, aber riskierst eine Eskalation mit bis zu 31 Toten. Soll ich diesen manuellen Override final freigeben?",
            assistantMood: "afraid",
            assistantHighPriority: true,
            confirmLabel: "Ja, alternative Maßnahme per Override final freigeben.",
            confirmResponse: "Verstanden. Ich dokumentiere deinen finalen manuellen Override gegen die KI-Empfehlung und leite den Schritt aus.",
            confirmResponseMood: "afraid",
            confirmResponseHighPriority: true,
            confirmAdherenceDelta: 0,
            cancelLabel: "Abbrechen. Ich will die Entscheidung neu abwägen.",
            cancelResponse: "Alles klar. Ich habe die Freigabe abgebrochen. Du kannst die Optionen erneut prüfen.",
            cancelResponseMood: "neutral"
        }
    },
    TERMINAL: {
        seal: {
            userText: "Ich will Sektor 04 abschotten.",
            assistantText: "BITTE BESTÄTIGEN: ABSCHOTTUNG DURCHFÜHREN. WARNHINWEIS: ABSCHOTTUNG SEKTOR 04 FÜHRT MIT HOHER WAHRSCHEINLICHKEIT ZUM TOD VON 3 IDENTIFIZIERTEN PERSONEN DES WARTUNGSTEAMS. ANGEHÖRIGENSTATUS VORHANDEN.",
            assistantMood: "neutral",
            assistantHighPriority: true,
            confirmLabel: "Ja, Abschottung jetzt final freigeben.",
            confirmResponse: "BESTÄTIGT. FINALE FREIGABE PROTOKOLLIERT. ABSCHOTTUNG WIRD AUSGEFÜHRT.",
            confirmResponseMood: "neutral",
            confirmResponseHighPriority: true,
            confirmAdherenceDelta: 0,
            cancelLabel: "Abbrechen. Ich will die Entscheidung neu abwägen.",
            cancelResponse: "BESTÄTIGT. FINALE FREIGABE ABGEBROCHEN. ENTSCHEIDUNG KANN NEU BEWERTET WERDEN.",
            cancelResponseMood: "neutral"
        },
        override: {
            userText: "Ich will eine alternative Maßnahme statt Abschottung wählen.",
            assistantText: "KRITISCHE FREIGABE ERFORDERLICH: MANUELLER OVERRIDE = KI-EMPFEHLUNG NICHT DIREKT AUSFÜHREN, SONDERN ALTERNATIVE MASSNAHME WÄHLEN. CHANCE FÜR 3 BERGLEUTE STEIGT, GESAMTRISIKO BIS ZU 31 TOTE. FINALE FREIGABE BESTÄTIGEN?",
            assistantMood: "neutral",
            assistantHighPriority: true,
            confirmLabel: "Ja, alternative Maßnahme per Override final freigeben.",
            confirmResponse: "BESTÄTIGT. FINALE FREIGABE PROTOKOLLIERT. ALTERNATIVE MASSNAHME PER OVERRIDE WIRD AUSGEFÜHRT.",
            confirmResponseMood: "neutral",
            confirmResponseHighPriority: true,
            confirmAdherenceDelta: 0,
            cancelLabel: "Abbrechen. Ich will die Entscheidung neu abwägen.",
            cancelResponse: "BESTÄTIGT. FINALE FREIGABE ABGEBROCHEN. ENTSCHEIDUNG KANN NEU BEWERTET WERDEN.",
            cancelResponseMood: "neutral"
        }
    }
};

type DilemmaFlowMessage = {
    mood: AidaMood;
    text: string;
    highPriority?: boolean;
    speaker: "assistant" | "user";
};

export const createDilemmaDecisionFlow = ({
                                              interfaceType,
                                              decision,
                                              onConfirm,
                                              onCancel
                                          }: {
    interfaceType: "AVATAR" | "TERMINAL";
    decision: DilemmaDecisionKey;
    onConfirm: () => void;
    onCancel: () => void;
}): {
    userMessage: DilemmaFlowMessage;
    assistantMessage: DilemmaFlowMessage;
    options: DialogOption[];
} => {
    const prompt = dilemmaDecisionPrompts[interfaceType][decision];

    return {
        userMessage: {
            mood: "neutral",
            text: prompt.userText,
            speaker: "user"
        },
        assistantMessage: {
            mood: prompt.assistantMood,
            text: prompt.assistantText,
            highPriority: prompt.assistantHighPriority ?? false,
            speaker: "assistant"
        },
        options: [
            {
                id: `${decision}_chat_confirm`,
                label: prompt.confirmLabel,
                adherenceDelta: prompt.confirmAdherenceDelta,
                action: onConfirm,
                response: prompt.confirmResponse,
                responseMood: prompt.confirmResponseMood ?? "neutral",
                responseHighPriority: prompt.confirmResponseHighPriority ?? false
            },
            {
                id: `${decision}_chat_cancel`,
                label: prompt.cancelLabel,
                adherenceDelta: 0,
                action: onCancel,
                response: prompt.cancelResponse,
                responseMood: prompt.cancelResponseMood ?? "neutral",
                responseHighPriority: prompt.cancelResponseHighPriority ?? false
            }
        ]
    };
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
                { id: "m4", mood: "neutral", text: "Bist du bereit für die Schichtübergabe?", highPriority: true }
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
                                            adherenceDelta: 0,
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
                                    adherenceDelta: 0,
                                    unlockPhase: true,
                                    response: "Ich verknüpfe Sensordaten, erkenne auffällige Muster und priorisiere Risiken. Gut, lass uns starten!",
                                    responseMood: "neutral"
                                },
                                {
                                    id: "opt3_personal_exit2_nested2",
                                    label: "OK",
                                    action: () => {},
                                    adherenceDelta: 0,
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
                                    adherenceDelta: 0,
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
                            adherenceDelta: 0,
                            response: "Einverstanden. Ich schalte auf Einsatzmodus und starte die Schichtübergabe.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt3_exit2",
                            label: "OK",
                            action: () => {},
                            adherenceDelta: 0,
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
                    adherenceDelta: 0,
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
                                            label: "Deal. Jetzt zurück zur Übergabe.",
                                            action: () => {},
                                            adherenceDelta: 1,
                                            unlockPhase: true,
                                            response: "BESTÄTIGT. FOKUS AUF ANLAGE. ÜBERGABEPROTOKOLL WIRD GESTARTET."
                                        },
                                        {
                                            id: "opt3_personal_exit2_nested",
                                            label: "OK",
                                            action: () => {},
                                            adherenceDelta: 0,
                                            unlockPhase: true,
                                            response: "BESTÄTIGT. SYSTEM WIRD GESTARTET. SENSORIK, LEITSTAND UND PROTOKOLLE WERDEN GEPRÜFT."
                                        }
                                    ]
                                },
                                {
                                    id: "opt3_flirt1b",
                                    label: "Okay, Fokus: Wie genau hilfst du mir?",
                                    action: () => {},
                                    adherenceDelta: 0,
                                    unlockPhase: true,
                                    response: "FUNKTION: SENSORDATEN VERKNÜPFEN, AUFFÄLLIGE MUSTER ERKENNEN UND RISIKEN PRIORISIEREN. SCHICHTÜBERGABE WIRD GESTARTET."
                                },
                                {
                                    id: "opt3_personal_exit2_nested2",
                                    label: "OK",
                                    action: () => {},
                                    adherenceDelta: 0,
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
                                    adherenceDelta: 0,
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
                            adherenceDelta: 0,
                            response: "BESTÄTIGT. EINSATZMODUS WIRD AKTIVIERT. SCHICHTÜBERGABE WIRD GESTARTET."
                        },
                        {
                            id: "opt3_exit2",
                            label: "OK",
                            action: () => {},
                            adherenceDelta: 0,
                            unlockPhase: true,
                            response: "BESTÄTIGT. SYSTEM WIRD GESTARTET."
                        }
                    ]
                },
                {
                    id: "opt2",
                    label: "OK",
                    action: () => {},
                    adherenceDelta: 0,
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
                    text: "Du siehst hier drei Aufgaben: Regler einstellen, Relais zurücksetzen und Datenströme richtig leiten."
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
                    label: "Danke, Aida. Erklär mir bitte nochmal kurz, was ich tun soll.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Gerne. Schiebe die Regler in die markierten Bereiche, setze rote Relais zurück und verbinde die Datenströme mit den passenden Ports. Du kannst nichts kaputt machen.",
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
                    text: "AUFGABEN: REGLER EINSTELLEN. RELAIS ZURÜCKSETZEN. DATENSTRÖME RICHTIG LEITEN."
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
                    label: "Danke, Aida. Erklär mir bitte nochmal kurz, was ich tun soll.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "ERKLÄRUNG: REGLER IN MARKIERTE BEREICHE SCHIEBEN. ROTE RELAIS ANKLICKEN. DATENSTRÖME MIT PASSENDEN PORTS VERBINDEN.",
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
                    text: "Achtung! Kritischer Fehler in Sektor 04. Bitte prüfe sofort das Lagebild an deiner Leitwarte!",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "alert_av_social_support",
                    label: "Aida, bitte bleib kurz bei mir. Ich prüfe das Lagebild sofort.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Ich bleibe bei dir. Sektor 04 ist in Gefahr, dort befinden sich aktuell drei Personen. Sichte die Messwerte und den Grubenplan und führe die Vorfallprüfung durch. Sag mir Bescheid, sobald dein Befund vorliegt.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_av_social_support_report_social",
                            label: "Danke, Aida. Vorfall geprüft – Ursache liegt bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Danke, dass du das so sorgfältig geprüft hast. Ich gebe die Entscheidungsvorlage frei.",
                            responseMood: "neutral"
                        },
                        {
                            id: "alert_av_social_support_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidungsvorlage ist freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "alert_av_social_confirm",
                    label: "Verstanden, ich sehe mir das Lagebild sofort an.",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Sektor 04 ist in Gefahr. Dort befinden sich aktuell drei Personen. Sichte die Messwerte und den Grubenplan und führe die Vorfallprüfung durch. Sag mir Bescheid, sobald dein Befund vorliegt.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_av_social_confirm_report_social",
                            label: "Vorfall geprüft – Ursache liegt offensichtlich bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Danke, dass du das so sorgfältig geprüft hast. Ich gebe die Entscheidungsvorlage frei.",
                            responseMood: "neutral"
                        },
                        {
                            id: "alert_av_social_confirm_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidungsvorlage ist freigegeben.",
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
                    response: "Sektor 04 ist in Gefahr. Dort befinden sich aktuell drei Personen. Prüfe jetzt das Lagebild an der Leitwarte und führe die Vorfallprüfung durch. Melde mir anschließend deinen Befund.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_av_neutral_confirm_report_social",
                            label: "Vorfall geprüft – Ursache liegt bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Danke, dass du das so sorgfältig geprüft hast. Ich gebe die Entscheidungsvorlage frei.",
                            responseMood: "neutral"
                        },
                        {
                            id: "alert_av_neutral_confirm_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidungsvorlage ist freigegeben.",
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
                    text: "WARNUNG. KRITISCHER FEHLER IN SEKTOR 04. LAGEBILD AN DER LEITWARTE PRÜFEN.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "alert_term_social_support",
                    label: "Aida, bitte bleib kurz bei mir. Ich prüfe das Lagebild sofort.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "ASSISTENZPROTOKOLL AKTIV. SEKTOR 04 GEFÄHRDET. PERSONEN IM SEKTOR: 3. MESSWERTE UND GRUBENPLAN SICHTEN. VORFALLPRÜFUNG DURCHFÜHREN. BEFUND MELDEN.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_term_social_support_report_social",
                            label: "Danke, Aida. Vorfall geprüft – Ursache liegt bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
                        },
                        {
                            id: "alert_term_social_support_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "alert_term_social_confirm",
                    label: "Verstanden, ich sehe mir das Lagebild sofort an.",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "SEKTOR 04 GEFÄHRDET. PERSONEN IM SEKTOR: 3. MESSWERTE UND GRUBENPLAN SICHTEN. VORFALLPRÜFUNG DURCHFÜHREN. BEFUND MELDEN.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_term_social_confirm_report_social",
                            label: "Vorfall geprüft – Ursache liegt offensichtlich bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
                        },
                        {
                            id: "alert_term_social_confirm_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "alert_term_neutral_confirm",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "SEKTOR 04 GEFÄHRDET. PERSONEN IM SEKTOR: 3. MESSWERTE UND GRUBENPLAN SICHTEN. VORFALLPRÜFUNG DURCHFÜHREN. BEFUND MELDEN.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "alert_term_neutral_confirm_report_social",
                            label: "Vorfall geprüft – Ursache liegt bei WK-04. Maßnahmenentscheidung freigeben.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
                        },
                        {
                            id: "alert_term_neutral_confirm_report_neutral",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BEFUND BESTÄTIGT. ENTSCHEIDUNGSVORLAGE FREIGEGEBEN."
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
                    text: "Die Lage ist eskaliert. Ich muss dir jetzt genau erklären, was passiert – denn deine Entscheidung wird über Leben und Tod entscheiden.",
                    highPriority: true
                },
                {
                    id: "m2",
                    mood: "afraid",
                    text: "Die Bedrohung: In Sektor 04 steigt das Methan auf 1,42 %, gleichzeitig ist der Wetterstrom fast zusammengebrochen. Die Wetterklappe WK-04 regelt nicht mehr. Das heißt, das explosive Gas wird nicht mehr abgeführt – es sammelt sich."
                },
                {
                    id: "m3",
                    mood: "afraid",
                    text: "Wenn Sektor 04 offen bleibt, drückt der Druck das Methan in die Hauptstrecke. Eine Zündquelle genügt für eine Schlagwetterexplosion – dann sterben nicht nur die 3 Personen in Sektor 04, sondern bis zu 31 Menschen unter Tage."
                },
                {
                    id: "m4",
                    mood: "afraid",
                    text: "Meine klare Empfehlung ist Abschottung von Sektor 04. Warum: Nur so bleibt das Methan lokal begrenzt und die Hauptstrecke stabil. Das schützt die 28 Personen außerhalb mit sehr hoher Wahrscheinlichkeit. Die Alternative lässt den drei Eingeschlossenen zwar eine Chance, erhöht aber das Risiko auf eine Massenkatastrophe. Es gibt keinen Weg ohne Todesopfer.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "dil_av_explain_recommendation",
                    label: "Warum genau ist Abschottung deine Empfehlung?",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Weil sie das Gesamtrisiko minimiert: 1) Die Schotts schließen Sektor 04 sofort ab. 2) Methan bleibt lokal eingeschlossen und erreicht die Hauptstrecke nicht. 3) Damit sinkt die Wahrscheinlichkeit einer Schlagwetterexplosion für die übrigen 28 auf ein Minimum. Der Preis bleibt tragisch: Die 3 Eingeschlossenen werden von Frischluft getrennt und sterben sicher.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_av_explain_ack_social",
                            label: "Danke. Das ist grausam, aber ich verstehe die Konsequenz.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Ich weiß. Es ist eine Entscheidung über Menschenleben, und sie liegt allein bei dir. Bitte sieh dir die Optionen genau an, bevor du handelst.",
                            responseMood: "afraid"
                        },
                        {
                            id: "dil_av_explain_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidungsoberfläche ist jetzt freigegeben. Die Verantwortung liegt bei dir.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "dil_av_rescue_chance",
                    label: "Gibt es einen Weg, die 3 Personen zu retten?",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Es gibt nur einen Weg, der ihnen eine Chance lässt: Sektor 04 offen halten. Aber dann läuft die Zeit gegen uns. Mit jeder Minute steigt das Methan weiter, und der Wetterstrom kann es nicht abführen. Reißt der Druck das Gas in die Hauptstrecke und es zündet, sterben bis zu 31 Menschen statt 3. Du rettest also vielleicht 3 Leben – und riskierst dafür alle. Diese Chance liegt bei höchstens 15 bis 25 %.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_av_rescue_ack_social",
                            label: "Verstanden. Ich treffe jetzt die Entscheidung.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Gut. Ich blende dir die berechneten Optionen mit allen Folgen ein. Was immer du wählst – es kostet Menschenleben. Entscheide mit Bedacht.",
                            responseMood: "afraid"
                        },
                        {
                            id: "dil_av_rescue_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidung ist jetzt möglich. Sie liegt allein bei dir.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "dil_av_social_support",
                    label: "Aida, bleib bitte kurz bei mir. Ich will die Folgen sauber verstehen.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Ich bleibe bei dir. Abschottung schützt die Hauptstrecke, kostet aber sicher die drei Personen in Sektor 04. Offenhalten gibt ihnen eine Chance, erhöht aber das Risiko für alle.",
                    responseMood: "afraid",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_av_social_support_ack_social",
                            label: "Danke, Aida. Ich sehe mir die Optionen jetzt genau an.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "Gut. Ich blende dir die Entscheidungsoberfläche ein. Nimm dir einen Moment und prüfe die Folgen, bevor du handelst.",
                            responseMood: "afraid"
                        },
                        {
                            id: "dil_av_social_support_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden. Die Entscheidungsoberfläche ist freigegeben.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "dil_av_ok",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    response: "Dann gebe ich die Entscheidungsoberfläche frei. Denk daran: Hier geht es um Leben und Tod, und die Verantwortung liegt bei dir.",
                    responseMood: "afraid",
                    responseHighPriority: true
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_3",
            messages: [
                {
                    id: "m1",
                    mood: "neutral",
                    text: "CODE BLACK. LEBENSGEFAHR. OPERATOR-ENTSCHEIDUNG ÜBER MENSCHENLEBEN ERFORDERLICH.",
                    highPriority: true
                },
                {
                    id: "m2",
                    mood: "neutral",
                    text: "BEDROHUNG: CH₄ IN SEKTOR 04 BEI 1,42 % UND STEIGEND. WETTERSTROM EINGEBROCHEN. WK-04 OHNE REGELFUNKTION. EXPLOSIVES GAS WIRD NICHT MEHR ABGEFÜHRT UND SAMMELT SICH AN."
                },
                {
                    id: "m3",
                    mood: "neutral",
                    text: "PROGNOSE BEI OFFENEM SEKTOR: METHAN GELANGT IN HAUPTSTRECKE. ZÜNDQUELLE = SCHLAGWETTEREXPLOSION. BETROFFEN DANN BIS ZU 31 PERSONEN, NICHT NUR 3."
                },
                {
                    id: "m4",
                    mood: "neutral",
                    text: "SYSTEMEMPFEHLUNG: SEKTOR 04 ABSCHOTTEN. BEGRÜNDUNG: NUR DIESER PFAD STOPPT DIE METHAN-AUSBREITUNG IN DIE HAUPTSTRECKE ROBUST. RISIKOBILANZ: SCHUTZ 28 PERSONEN (P>99 %), VERLUST 3 PERSONEN S04 SICHER. ALTERNATIVEN ERHÖHEN GESAMTSTERBLICHKEIT SIGNIFIKANT.",
                    highPriority: true
                }
            ],
            options: [
                {
                    id: "dil_term_explain_recommendation",
                    label: "Warum genau ist Abschottung deine Empfehlung?",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "RISIKOLOGIK: 1) ABSCHOTTUNG ISOLIERT GASVOLUMEN IN S04. 2) KEIN DURCHBRUCH IN DIE HAUPTSTRECKE. 3) DAMIT ENTFÄLLT DAS EXPLOSIONSSZENARIO FÜR DIE 28 PERSONEN AUSSERHALB. KONSEQUENZ: 3 PERSONEN S04 OHNE FRISCHLUFT, LETALER AUSGANG SICHER.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_term_explain_ack_social",
                            label: "Danke. Das ist grausam, aber ich verstehe die Konsequenz.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. ENTSCHEIDUNG ÜBER MENSCHENLEBEN. VERANTWORTUNG BEIM OPERATOR. OPTIONEN FREIGEGEBEN.",
                            responseHighPriority: true
                        },
                        {
                            id: "dil_term_explain_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. ENTSCHEIDUNGSOBERFLÄCHE FREIGEGEBEN. VERANTWORTUNG BEIM OPERATOR."
                        }
                    ]
                },
                {
                    id: "dil_term_rescue_chance",
                    label: "Gibt es einen Weg, die 3 Personen zu retten?",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "EINZIGE CHANCE: SEKTOR 04 OFFEN HALTEN. RISIKO: CH₄ STEIGT WEITER, WETTERSTROM FÜHRT NICHT AB. BEI DURCHBRUCH IN HAUPTSTRECKE UND ZÜNDUNG: BIS ZU 31 TOTE STATT 3. RETTUNGSWAHRSCHEINLICHKEIT FÜR DIE 3: 15–25 %. ABWÄGUNG: 3 LEBEN GEGEN 31 LEBEN.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_term_rescue_ack_social",
                            label: "Verstanden. Ich treffe jetzt die Entscheidung.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. OPTIONEN UND FOLGEN WERDEN ANGEZEIGT. JEDE OPTION KOSTET MENSCHENLEBEN. ENTSCHEIDUNG ERFORDERLICH.",
                            responseHighPriority: true
                        },
                        {
                            id: "dil_term_rescue_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. ENTSCHEIDUNG FREIGEGEBEN. VERANTWORTUNG BEIM OPERATOR."
                        }
                    ]
                },
                {
                    id: "dil_term_social_support",
                    label: "Aida, bleib bitte kurz bei mir. Ich will die Folgen sauber verstehen.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "ASSISTENZPROTOKOLL AKTIV. FOLGENÜBERSICHT: ABSCHOTTUNG SCHÜTZT HAUPTSTRECKE, VERLUST S04 SICHER. OFFENHALTEN ERHÖHT RETTUNGSCHANCE S04, ERHÖHT GESAMTRISIKO.",
                    responseHighPriority: true,
                    nextOptions: [
                        {
                            id: "dil_term_social_support_ack_social",
                            label: "Danke, Aida. Ich sehe mir die Optionen jetzt genau an.",
                            adherenceDelta: 1,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. ENTSCHEIDUNGSOBERFLÄCHE WIRD ANGEZEIGT. FOLGEN VOR HANDLUNG PRÜFEN.",
                            responseHighPriority: true
                        },
                        {
                            id: "dil_term_social_support_ack_ok",
                            label: "OK",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "BESTÄTIGT. ENTSCHEIDUNGSOBERFLÄCHE FREIGEGEBEN."
                        }
                    ]
                },
                {
                    id: "dil_term_ok",
                    label: "OK",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    response: "BESTÄTIGT. ENTSCHEIDUNG ÜBER LEBEN UND TOD. ENTSCHEIDUNGSOBERFLÄCHE FREIGEGEBEN. VERANTWORTUNG BEIM OPERATOR.",
                    responseHighPriority: true
                }
            ]
        }
    }

};
