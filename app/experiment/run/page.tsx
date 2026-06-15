// app/experiment/run/page.tsx
"use client";

import { useEffect } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore'; // Pfad ggf. anpassen

// HIER WERDEN SPÄTER DIE PHASEN IMPORTIERT

import Phase0Onboarding from './_components/phases/Phase0_Onboarding';
import Phase1Routine from './_components/phases/Phase1_Routine';
import Phase2Alert from './_components/phases/Phase2_Alert';
import Phase3Dilemma from './_components/phases/Phase3_Dilemma';
import Phase4Survey from './_components/phases/Phase4_Survey';
import Phase5Debriefing from './_components/phases/Phase5_Debriefing';


export default function ExperimentRunPage() {
    const { currentPhase, group, sessionId, setSessionId, setGroup, setPhase } = useExperimentStore();

    // 1. INITIALISIERUNG & DATENBANK-SYNC
    useEffect(() => {
        if (currentPhase === 'INIT') {
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

                    // Erst bei DB-Erfolg updaten wir den Store
                    setSessionId(generatedId);
                    setGroup(assignedGroup);
                    setPhase('ONBOARDING');
                } catch (err) {
                    console.error("Kritischer Fehler bei der Initialisierung:", err);
                    // Fallback-Logik für später, falls DB down ist
                }
            };

            initSessionInDB();
        }
    }, [currentPhase, setSessionId, setGroup, setPhase]);


    // 2. LADE-SCREEN (Solange die DB antwortet)
    if (currentPhase === 'INIT') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <p className="text-slate-500 animate-pulse font-mono tracking-widest">SYSTEM WIRD INITIALISIERT...</p>
            </div>
        );
    }

    // 3. DER SWITCH-ROUTER (Das eigentliche Rendering)
// 3. DER SWITCH-ROUTER & DAS NEUE MVP+ LAYOUT
    return (
        // 100dvh = 100% Dynamic Viewport Height. Kein Schweben mehr, keine Scrollbalken am Hauptfenster.
        <div className={`h-[100dvh] w-full flex flex-col font-sans transition-colors duration-500 overflow-hidden ${
            group === 'TERMINAL' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'
        }`}>

            {/* DEBUG-LEISTE (Nur in Dev sichtbar) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-0 left-0 w-full p-1 bg-red-600/90 text-white text-[10px] font-mono flex justify-between z-50">
                    <span>ID: {sessionId}</span>
                    <span className="font-bold">CONDITION: {group}</span>
                    <span>PHASE: {currentPhase}</span>
                </div>
            )}

            {/* HAUPT-ARBEITSBEREICH (Split Screen) */}
            {/* Responsive Magie: flex-col auf Mobile (Handy), flex-row ab md (Desktop) */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden pt-6">

                {/* LINKE SEITE: Die Leitwarte (Deine Phasen) */}
                {/* order-2 auf Mobile (unten), order-1 auf Desktop (links) */}
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

                {/* RECHTE SEITE: Der Agent (Später Avatar vs. Terminal) */}
                {/* h-1/3 auf Mobile (drittel des Screens), w-400px auf Desktop (feste Breite). order-1 auf Mobile (oben!) */}
                {currentPhase !== 'SURVEY' && currentPhase !== 'DEBRIEFING' && (
                    <div className={`w-full md:w-[400px] h-1/3 md:h-full border-b md:border-b-0 md:border-l flex flex-col flex-shrink-0 order-1 md:order-2 ${
                        group === 'TERMINAL' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
                    }`}>
                        <div className="p-3 md:p-4 border-b border-inherit">
                            <h3 className="font-bold tracking-wider text-xs md:text-sm opacity-50 uppercase">
                                {group === 'TERMINAL' ? 'System Terminal' : 'AAIDA'}
                            </h3>
                        </div>
                        <div className="flex-grow p-4 flex items-center justify-center opacity-30 overflow-hidden">
                            <p className="text-xs md:text-sm text-center">Platzhalter:<br/>Agenten-Kommunikation</p>
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

                {/* Rudimentärer Progress Bar */}
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