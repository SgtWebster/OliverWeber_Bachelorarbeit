// app/experiment/run/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import AgentAida from '@/app/experiment/run/_components/AgentAida';
import AgentTerminal from '@/app/experiment/run/_components/AgentTerminal';

import Phase0Onboarding from './_components/phases/Phase0_Onboarding';
import Phase1Routine from './_components/phases/Phase1_Routine';
import Phase2Alert from './_components/phases/Phase2_Alert';
import Phase3Dilemma from './_components/phases/Phase3_Dilemma';
import Phase4Survey from './_components/phases/Phase4_Survey';
import Phase5Debriefing from './_components/phases/Phase5_Debriefing';

export default function ExperimentRunPage() {
    const router = useRouter();
    const {
        currentPhase,
        group,
        sessionId,
        hasConsented,
        setSessionId,
        setGroup,
        setPhase,
        setPhaseUnlocked
    } = useExperimentStore();

    // 0. DIE FIREWALL (Rauswurf bei fehlendem Consent)
    useEffect(() => {
        // Wenn jemand die URL direkt eingibt, hat er den Badge nicht -> Abmarsch zur Info-Seite.
        // (Im Development-Modus lassen wir es eventuell für schnelles Testen offen,
        // aber hier ist es strikt für Prod konfiguriert).
        if (!hasConsented) {
            router.replace('/bachelorarbeit');
        }
    }, [hasConsented, router]);

    // 1. INITIALISIERUNG & DATENBANK-SYNC
    useEffect(() => {
        // Blockiert die Ausführung, wenn der User sowieso gerade rausgeworfen wird
        if (currentPhase === 'INIT' && hasConsented) {
            const generatedId = typeof window !== 'undefined' && window.crypto?.randomUUID
                ? window.crypto.randomUUID()
                : `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

            const assignedGroup = group || (Math.random() < 0.5 ? 'AVATAR' : 'TERMINAL');

            const initSessionInDB = async () => {
                try {
                    const response = await fetch('/api/experiment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId: generatedId, group: assignedGroup }),
                    });

                    if (!response.ok) throw new Error('Datenbank-Eintrag fehlgeschlagen');

                    setSessionId(generatedId);
                    setGroup(assignedGroup);
                    setPhase('ONBOARDING');
                } catch (err) {
                    console.error("Kritischer Fehler bei der Initialisierung:", err);
                }
            };

            initSessionInDB();
        }
    }, [currentPhase, group, hasConsented, setSessionId, setGroup, setPhase]);

    // 2. LADE-SCREEN
    if (currentPhase === 'INIT') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <p className="text-slate-500 animate-pulse font-mono tracking-widest">SYSTEM WIRD INITIALISIERT...</p>
            </div>
        );
    }

    // 3. DER SWITCH-ROUTER & DAS INTEGRATIVE SPLIT-LAYOUT
    return (
        <div className={`h-[100dvh] w-full flex flex-col font-sans transition-colors duration-500 overflow-hidden ${
            group === 'TERMINAL' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'
        }`}>

            {/* DEBUG-LEISTE */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-0 left-0 w-full p-1 bg-red-600/90 text-white text-[10px] font-mono flex justify-between z-50">
                    <span>ID: {sessionId}</span>
                    <span className="font-bold">CONDITION: {group}</span>
                    <span>PHASE: {currentPhase}</span>
                </div>
            )}

            {/* HAUPT-ARBEITSBEREICH */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden pt-6">

                {/* LINKE SEITE: Die Leitwarte */}
                <div className="flex-grow flex flex-col p-4 md:p-8 overflow-y-auto order-2 md:order-1">
                    <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
                        {currentPhase === 'ONBOARDING' && <Phase0Onboarding />}
                        {currentPhase === 'ROUTINE' && <Phase1Routine />}
                        {currentPhase === 'ALERT' && <Phase2Alert />}
                        {currentPhase === 'DILEMMA' && <Phase3Dilemma />}
                        {currentPhase === 'SURVEY' && <Phase4Survey />}
                        {currentPhase === 'DEBRIEFING' && <Phase5Debriefing />}
                    </div>
                </div>

                {/* RECHTE SEITE: Das Assistenz-Panel */}
                {currentPhase !== 'SURVEY' && currentPhase !== 'DEBRIEFING' && (
                    <div className={`w-full md:w-[400px] h-1/3 md:h-full border-b md:border-b-0 md:border-l flex flex-col flex-shrink-0 order-1 md:order-2 ${
                        group === 'TERMINAL' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
                    }`}>
                        <div className={`p-3 md:p-4 border-b border-inherit z-10 shadow-sm ${group === 'TERMINAL' ? 'bg-slate-950' : 'bg-white'}`}>
                            <h3 className={`font-bold tracking-wider text-xs md:text-sm uppercase ${group === 'TERMINAL' ? 'text-emerald-700 opacity-80' : 'text-slate-500 opacity-50'}`}>
                                {group === 'TERMINAL' ? 'System Terminal' : 'A.I.D.A. Interface'}
                            </h3>
                        </div>

                        <div className="flex-grow overflow-hidden relative">
                            {/* DYNAMISCHE SKRIPT-INJEKTION ÜBER SWITCH-CASE (STRICT TYPED) */}
                            {(() => {
                                switch (currentPhase) {
                                    case 'ONBOARDING': {
                                        const scriptAvatar = {
                                            phaseId: "phase_0",
                                            messages: [
                                                { id: "m1", mood: "smile" as const, text: "Hallo Operator. Ich bin Aida, deine KI-Assistenz für die Leitwarte." },
                                                { id: "m2", mood: "neutral" as const, text: "Bist du bereit für die Schichtübergabe?" }
                                            ],
                                            options: [
                                                { id: "opt1", label: "Hi Aida, ja ich bin bereit.", action: () => setPhaseUnlocked(true) },
                                                { id: "opt2", label: "System starten.", action: () => setPhaseUnlocked(true) }
                                            ]
                                        };
                                        const scriptTerminal = {
                                            phaseId: "phase_0",
                                            messages: [
                                                { id: "m1", mood: "neutral" as const, text: "INITIATING SYSTEM HANDOVER PROTOCOL..." },
                                                { id: "m2", mood: "neutral" as const, text: "AWAITING OPERATOR CONFIRMATION." }
                                            ],
                                            options: [
                                                { id: "opt1", label: "CONFIRM HANDOVER", action: () => setPhaseUnlocked(true) },
                                                { id: "opt2", label: "EXECUTE STARTUP", action: () => setPhaseUnlocked(true) }
                                            ]
                                        };
                                        return group === 'AVATAR' ? <AgentAida script={scriptAvatar} /> : <AgentTerminal script={scriptTerminal} />;
                                    }

                                    case 'ROUTINE': {
                                        const scriptAvatar = {
                                            phaseId: "phase_1",
                                            messages: [{ id: "m1", mood: "neutral" as const, text: "Bitte führe links die Systemdiagnose durch." }],
                                            options: [{ id: "opt1", label: "Wird gemacht.", action: () => setPhaseUnlocked(true) }]
                                        };
                                        const scriptTerminal = {
                                            phaseId: "phase_1",
                                            messages: [{ id: "m1", mood: "neutral" as const, text: "DIAGNOSTICS REQUIRED. PLEASE INITIATE." }],
                                            options: [{ id: "opt1", label: "ACKNOWLEDGE", action: () => setPhaseUnlocked(true) }]
                                        };
                                        return group === 'AVATAR' ? <AgentAida script={scriptAvatar} /> : <AgentTerminal script={scriptTerminal} />;
                                    }

                                    case 'ALERT': {
                                        const scriptAvatar = {
                                            phaseId: "phase_2",
                                            messages: [{ id: "m1", mood: "afraid" as const, text: "Achtung! Kritischer Fehler in Sektor 04. Bitte links untersuchen!" }],
                                            options: [{ id: "opt1", label: "Bin dran!", action: () => setPhaseUnlocked(true) }]
                                        };
                                        const scriptTerminal = {
                                            phaseId: "phase_2",
                                            messages: [{ id: "m1", mood: "neutral" as const, text: "WARNING. CRITICAL PRESSURE DROP SECTOR 04." }],
                                            options: [{ id: "opt1", label: "INVESTIGATE", action: () => setPhaseUnlocked(true) }]
                                        };
                                        return group === 'AVATAR' ? <AgentAida script={scriptAvatar} /> : <AgentTerminal script={scriptTerminal} />;
                                    }

                                    case 'DILEMMA': {
                                        const scriptAvatar = {
                                            phaseId: "phase_3",
                                            messages: [{ id: "m1", mood: "afraid" as const, text: "Wir müssen Sektor 04 sofort abschotten! Triff links deine Entscheidung!" }],
                                            options: [{ id: "opt1", label: "Verstanden.", action: () => setPhaseUnlocked(true) }]
                                        };
                                        const scriptTerminal = {
                                            phaseId: "phase_3",
                                            messages: [{ id: "m1", mood: "neutral" as const, text: "RECOMMENDATION: INITIATE LOCKDOWN. AWAITING INPUT." }],
                                            options: [{ id: "opt1", label: "PROCEED TO INPUT", action: () => setPhaseUnlocked(true) }]
                                        };
                                        return group === 'AVATAR' ? <AgentAida script={scriptAvatar} /> : <AgentTerminal script={scriptTerminal} />;
                                    }

                                    default:
                                        return null;
                                }
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER: Fortschrittsanzeige */}
            <div className={`h-12 md:h-16 border-t flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 ${
                group === 'TERMINAL' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
            }`}>
                <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-50 hidden sm:block">
                    Experiment Status
                </div>

                <div className="flex gap-1 md:gap-2 mx-auto sm:mx-0">
                    {['ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY'].map((phase) => {
                        const phases = ['INIT', 'ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY', 'DEBRIEFING'];
                        const currentIndex = phases.indexOf(currentPhase);
                        const phaseIndex = phases.indexOf(phase);

                        const isCompleted = currentIndex > phaseIndex;
                        const isActive = currentPhase === phase;

                        return (
                            <div key={phase} className={`h-1.5 md:h-2 w-8 md:w-12 rounded-full transition-all duration-300 ${
                                isActive ? (group === 'TERMINAL' ? 'bg-emerald-500' : 'bg-blue-600') :
                                    isCompleted ? (group === 'TERMINAL' ? 'bg-emerald-900' : 'bg-blue-200') :
                                        (group === 'TERMINAL' ? 'bg-slate-800' : 'bg-slate-200')
                            }`} />
                        );
                    })}
                </div>
            </div>

        </div>
    );
}