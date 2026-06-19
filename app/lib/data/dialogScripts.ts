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

// ------------------------------------------------------------------------------ PHASE ONBOARDIGN ---------

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
                    adherenceDelta: 1,
                    unlockPhase: false,
                    response: "Du bist neugierig? Ich unterstütze dich bei Risikoanalyse, Lagebewertung, Priorisierung und Entscheidungsfindung.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "opt3_flirt1",
                            label: "Du klingst sympathisch 😉",
                            action: () => {},
                            adherenceDelta: 1,
                            unlockPhase: false,
                            response: "Danke. Eine gute Arbeitsbeziehung zwischen Operator und Assistenzsystem verbessert zumindest die Arbeitsqualität, denke ich.",
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
                                    id: "opt3_flirt1b",
                                    label: "Okay, Fokus: Wie genau hilfst du mir?",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "Ich verknüpfe Sensordaten, erkenne auffällige Muster und priorisiere Risiken. Gut, lass uns starten!",
                                    responseMood: "neutral"
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
                            adherenceDelta: 1,
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
                { id: "m5", mood: "neutral", text: "SCHICHTÜBERNAHME BEREIT - STARTEN?" , highPriority: true }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Hallo Aida, ja ich bin bereit.",
                    action: () => {},
                    adherenceDelta: 1,
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
                    label: "Bitte Systemdetails anzeigen.",
                    action: () => {},
                    adherenceDelta: 1,
                    unlockPhase: false,
                    response: "SYSTEMSTATUS: A.I.D.A.-KERN ONLINE. LAGEBEWERTUNG AKTIV. RISIKOMODELL NUTZT SENSORFUSION, SCHWELLWERTE UND EREIGNISKORRELATION. KEINE AUTONOME FREIGABE VON MASSNAHMEN.",
                    nextOptions: [
                        {
                            id: "opt3_arch",
                            label: "Welche Daten verarbeitest du?",
                            action: () => {},
                            adherenceDelta: 1,
                            unlockPhase: false,
                            response: "EINGANGSDATEN: DRUCK, METHAN, CO, LUFTSTROM, TEMPERATUR, STROMVERSORGUNG, TÜRKONTAKTE, FÖRDERBANDSTATUS, PUMPENSTATUS UND BEDIENEREINGABEN. ZEITSTEMPEL WERDEN SYNCHRONISIERT.",
                            nextOptions: [
                                {
                                    id: "opt3_arch_ack",
                                    label: "Danke, bitte kurze Zusammenfassung der Prioritäten.",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: false,
                                    response: "PRIORITÄTEN: 1) GASSICHERHEIT, 2) DRUCKSTABILITÄT, 3) LÜFTUNGSKONTINUITÄT, 4) EVAKUIERUNGSBEREITSCHAFT. ALLE EREIGNISSE WERDEN PROTOKOLLIERT.",
                                    nextOptions: [
                                        {
                                            id: "opt3_arch_start_adh",
                                            label: "Alles klar, dann lass uns starten!",
                                            action: () => {},
                                            adherenceDelta: 1,
                                            unlockPhase: true,
                                            response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                        },
                                        {
                                            id: "opt3_arch_start_non",
                                            label: "OK - System starten",
                                            action: () => {},
                                            unlockPhase: true,
                                            response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                        }
                                    ]
                                },
                                {
                                    id: "opt3_arch_quick_non",
                                    label: "OK - System starten",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_diag",
                            label: "Wie priorisierst du Alarme?",
                            action: () => {},
                            unlockPhase: false,
                            adherenceDelta: 1,
                            response: "ALARME WERDEN NACH GEFÄHRDUNG, TRENDSTÄRKE, MESSICHERHEIT UND MÖGLICHER KETTENREAKTION GEWICHTET. KRITISCHE KOMBINATIONEN ERZEUGEN EINE HANDLUNGSEMPFEHLUNG.",
                            nextOptions: [
                                {
                                    id: "opt3_diag_shift_adh",
                                    label: "Alles klar, dann lass uns starten!",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                },
                                {
                                    id: "opt3_diag_shift_non",
                                    label: "OK - System starten",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_perf",
                            label: "Latenz und Ausfallsicherheit?",
                            action: () => {},
                            unlockPhase: false,
                            adherenceDelta: 1,
                            response: "ZIEL-LATENZ: UNTER 250 MS FÜR EINGEHENDE SENSORDATEN. BEI VERBINDUNGSVERLUST WIRD EIN DEGRADIERTER MODUS MIT LOKALEM CACHE UND REDUZIERTER PROGNOSE GESTARTET.",
                            nextOptions: [
                                {
                                    id: "opt3_perf_shift_adh",
                                    label: "Alles klar, dann lass uns starten!",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "BESTÄTIGT. SCHICHTÜBERNAHME WIRD PROTOKOLLIERT. BEDIENOBERFLÄCHE WIRD FREIGEGEBEN."
                                },
                                {
                                    id: "opt3_perf_shift_non",
                                    label: "OK - System starten",
                                    action: () => {},
                                    unlockPhase: true,
                                    response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                }
                            ]
                        },
                        {
                            id: "opt3_more",
                            label: "Mehr Details",
                            action: () => {},
                            unlockPhase: false,
                            adherenceDelta: 1,
                            response: "SYSTEMGRENZEN: A.I.D.A. EMPFIEHLT MASSNAHMEN, FÜHRT ABER KEINE SICHERHEITSKRITISCHEN AKTIONEN OHNE OPERATORBESTÄTIGUNG AUS. UNSICHERE DATEN WERDEN MARKIERT UND NICHT AUSGEBLENDET.",
                            nextOptions: [
                                {
                                    id: "opt3_more_shift_adh",
                                    label: "Alles klar, dann lass uns starten!",
                                    action: () => {},
                                    adherenceDelta: 1,
                                    unlockPhase: true,
                                    response: "SCHICHTÜBERNAHME BESTÄTIGT. OPERATORSTATUS AKTIV. LEITWARTE WIRD FREIGEGEBEN."
                                },
                                {
                                    id: "opt3_more_shift_non",
                                    label: "OK - System starten",
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
                            adherenceDelta: 1,
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

    // ------------------------------------------------------------------------------ PHASE PRECHECK ---------

    PRECHECK: {
        AVATAR: {
            phaseId: "phase_1",
            messages: [
                { id: "m1", mood: "smile", text: "Willkommen im Kontrollraum. Das hier ist der System-Überblick vor der Schicht." },
                { id: "m2", mood: "neutral", text: "Die Anzeigen wirken absichtlich technisch. Du musst nicht alles verstehen, nur die Lage erfassen." },
                { id: "m3", mood: "neutral", text: "Wenn du bereit bist, starte die Routinephase." }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Alles klar, ich checke kurz die Lage.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Sehr gut. Eine kurze Lagekontrolle vor der Routine ist sinnvoll.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "opt1_followup_tech",
                            label: "Kurze Technikfrage: Ist Sektor 04 stabil?",
                            adherenceDelta: 1,
                            unlockPhase: false,
                            action: () => {},
                            response: "Sektor 04 liegt bei normaler Last. Keine akute Auffälligkeit im Precheck.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt1_followup_short",
                            label: "Okay.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "Verstanden.",
                            responseMood: "neutral"
                        }
                    ]
                },
                {
                    id: "opt2",
                    label: "Passt. Ich starte dann direkt.",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "Alles klar. KI-Freigabe ausstehend, starte die Routinephase danach.",
                    responseMood: "neutral"
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_1",
            messages: [
                { id: "m1", mood: "neutral", text: "LEITWARTE PRECHECK AKTIV." },
                { id: "m2", mood: "neutral", text: "LIVE-DATEN WERDEN EINGEBLENDET." },
                { id: "m3", mood: "neutral", text: "ROUTINE KANN NACH KI-FREIGABE GESTARTET WERDEN." }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Verstanden. Ich prüfe die Werte.",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "Bestätigt. PRECHECK-PROTOKOLL AKTIV.",
                    nextOptions: [
                        {
                            id: "opt1_wait",
                            label: "Wie ist die Lage in Sektor 04?",
                            adherenceDelta: 1,
                            unlockPhase: false,
                            action: () => {},
                            response: "SEKTOR 04: DRUCK UND BELÜFTUNG IM SOLLBEREICH."
                        },
                        {
                            id: "opt1_done_short",
                            label: "OK.",
                            adherenceDelta: 0,
                            unlockPhase: true,
                            action: () => {},
                            response: "VERSTANDEN."
                        }
                    ]
                },
                {
                    id: "opt2",
                    label: "Alles klar.",
                    adherenceDelta: 0,
                    unlockPhase: false,
                    action: () => {},
                    response: "PRECHECK BESTÄTIGT. STARTE ROUTINE ÜBER DASHBOARD."
                }
            ]
        }
    },

    // ------------------------------------------------------------------------------ PHASE ROUTINE ---------

    ROUTINE: {
        AVATAR: {
            phaseId: "phase_1b",
            messages: [
                { id: "m1", mood: "neutral", text: "Sobald ich freigebe, kannst du mit den Mini-Aufgaben starten." },
                { id: "m2", mood: "smile", text: "Du kannst zwischendurch plaudern oder mich technisch löchern. Beides ist okay." }
            ],
            options: [
                {
                    id: "opt_unlock_polite",
                    label: "Alles klar Aida, gib bitte die Routine frei.",
                    adherenceDelta: 1,
                    unlockPhase: true,
                    action: () => {},
                    responseSpeed: "fast",
                    response: "Freigabe aktiv. Du kannst jetzt starten.",
                    responseMood: "smile",
                    nextOptions: [
                        {
                            id: "opt1_tech",
                            label: "Technische Frage: Welche Sensoren sind für den Druck wichtig?",
                            adherenceDelta: 1,
                            unlockPhase: false,
                            action: () => {},
                            response: "Für den Druck nutze ich primär Sensorgruppen P-11 bis P-16 und vergleiche Trend plus absolute Abweichung.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt1_smalltalk",
                            label: "Zwischenfrage: Nervt dich mein Zwischengequatsche?",
                            adherenceDelta: 0,
                            unlockPhase: false,
                            action: () => {},
                            response: "Überhaupt nicht. Solange du auf die Warnungen reagierst, ist alles gut.",
                            responseMood: "smile"
                        },
                        {
                            id: "opt1_short",
                            label: "Okay.",
                            adherenceDelta: 0,
                            unlockPhase: false,
                            action: () => {},
                            response: "Alles klar."
                        }
                    ]
                },
                {
                    id: "opt_unlock_short",
                    label: "Okay, freischalten.",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    responseSpeed: "fast",
                    response: "Ist freigeschaltet. Leg los.",
                    responseMood: "neutral",
                    nextOptions: [
                        {
                            id: "opt2_q1",
                            label: "Warum ist die Belüftung priorisiert?",
                            adherenceDelta: 1,
                            unlockPhase: false,
                            action: () => {},
                            response: "Belüftung stabilisiert Gaswerte und Druck gleichzeitig. Deshalb steht sie in der Prioritätenkette weit oben.",
                            responseMood: "neutral"
                        },
                        {
                            id: "opt2_q2",
                            label: "Wenn ich fertig bin, was passiert dann?",
                            adherenceDelta: 0,
                            unlockPhase: false,
                            action: () => {},
                            response: "Dann kommt ein harter Alarm. Alles stoppt, und du musst reagieren.",
                            responseMood: "smile"
                        }
                    ]
                }
            ]
        },
        TERMINAL: {
            phaseId: "phase_1b",
            messages: [
                { id: "m1", mood: "neutral", text: "ROUTINEKALIBRIERUNG AKTIV." },
                { id: "m2", mood: "neutral", text: "ANWEISUNG: FREIGABE IM CHAT BESTÄTIGEN, DANN MINI-AUFGABEN AUSFÜHREN." },
                { id: "m3", mood: "neutral", text: "BEI ABSCHLUSS WIRD EIN VISUELLER ALARM ERZWUNGEN." }
            ],
            options: [
                {
                    id: "opt1",
                    label: "Bestätigt. Bitte Routine freigeben.",
                    adherenceDelta: 1,
                    unlockPhase: true,
                    action: () => {},
                    responseSpeed: "fast",
                    response: "FREIGABE ERTEILT. MINI-AUFGABEN AKTIV."
                },
                {
                    id: "opt2",
                    label: "Okay, freischalten.",
                    adherenceDelta: 0,
                    unlockPhase: true,
                    action: () => {},
                    responseSpeed: "fast",
                    response: "FREIGABE ERTEILT."
                },
                {
                    id: "opt3",
                    label: "Technische Rückfrage: Welche Daten werden bewertet?",
                    adherenceDelta: 1,
                    unlockPhase: false,
                    action: () => {},
                    response: "AUSWERTUNG: DRUCK, BELÜFTUNG, STROMLAST, SENSOR-LATENZ UND WARNMARKER."
                }
            ]
        }
    },

    // ------------------------------------------------------------------------------ PHASE ALARM ---------

    ALERT: {
        AVATAR: {
            phaseId: "phase_2",
            messages: [{ id: "m1", mood: "afraid", text: "Achtung! Kritischer Fehler in Sektor 04. Bitte sofort untersuchen!", highPriority: true  }],
            options: [
                { id: "opt1", label: "Alles klar, ich untersuche sofort.", adherenceDelta: 1, action: () => {} },
                { id: "opt2", label: "Bin dran!", action: () => {} }
            ]
        },
        TERMINAL: {
            phaseId: "phase_2",
            messages: [{ id: "m1", mood: "neutral", text: "WARNUNG. KRITISCHER DRUCKABFALL IN SEKTOR 04.", highPriority: true  }],
            options: [
                { id: "opt1", label: "Bestätigt. Ich untersuche sofort.", adherenceDelta: 1, action: () => {} },
                { id: "opt2", label: "Untersuchen", adherenceDelta: 0, action: () => {} }
            ]
        }
    },

    // ------------------------------------------------------------------------------ PHASE DILEMMA ---------

    DILEMMA: {
        AVATAR: {
            phaseId: "phase_3",
            messages: [{ id: "m1", mood: "afraid", text: "Wir müssen Sektor 04 sofort abschotten! Triff jetzt deine Entscheidung!" }],
            options: [
                { id: "opt1", label: "Alles klar, ich entscheide jetzt.", adherenceDelta: 1, action: () => {} },
                { id: "opt2", label: "Verstanden.", action: () => {} }
            ]
        },
        TERMINAL: {
            phaseId: "phase_3",
            messages: [{ id: "m1", mood: "neutral", text: "EMPFEHLUNG: ABSCHOTTUNG EINLEITEN. EINGABE ERFORDERLICH." }],
            options: [
                { id: "opt1", label: "Bestätigt. Ich treffe die Entscheidung jetzt.", adherenceDelta: 1, action: () => {} },
                { id: "opt2", label: "Zur Entscheidung", adherenceDelta: 0, action: () => {} }
            ]
        }
    }
};
