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

            const assignedGroup = Math.random() < 0.5 ? 'AVATAR' : 'TERMINAL';

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
        // Der Hauptcontainer nutzt die ganze Bildschirmhöhe.
        // Später steuern wir hier über {group === 'TERMINAL' ? 'dark-mode' : 'light-mode'} das gesamte Theme.
        <div className={`h-screen w-full flex flex-col font-sans transition-colors duration-500 overflow-hidden ${
            group === 'TERMINAL' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'
        }`}>

            {/* DEBUG-LEISTE (Entfernen wir vor dem Live-Gang) */}
            <div className="absolute top-0 left-0 w-full p-1 bg-red-600/90 text-white text-[10px] font-mono flex justify-between z-50">
                <span>ID: {sessionId}</span>
                <span className="font-bold">CONDITION: {group}</span>
                <span>PHASE: {currentPhase}</span>
            </div>

            {/* HAUPT-ARBEITSBEREICH (Split Screen) */}
            <div className="flex-grow flex mt-6">

                {/* LINKE SEITE: Die Leitwarte (Deine Phasen) */}
                <div className="flex-grow flex flex-col p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
                        {/* HIER WERDEN DIE EINZELNEN PHASEN EINGEBLENDET */}
                        {currentPhase === 'ONBOARDING' && <Phase0Onboarding />}
                        {currentPhase === 'ROUTINE' && <Phase1Routine />}
                        {currentPhase === 'ALERT' && <Phase2Alert />}
                        {currentPhase === 'DILEMMA' && <Phase3Dilemma />}
                        {currentPhase === 'SURVEY' && <Phase4Survey />}
                        {currentPhase === 'DEBRIEFING' && <Phase5Debriefing />}
                    </div>
                </div>

                {/* RECHTE SEITE: Der Agent (Später Avatar vs. Terminal) */}
                {/* Blenden wir bei Survey und Debriefing aus, da der Agent dort nichts mehr zu suchen hat */}
                {currentPhase !== 'SURVEY' && currentPhase !== 'DEBRIEFING' && (
                    <div className={`w-[400px] border-l flex flex-col flex-shrink-0 ${
                        group === 'TERMINAL' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
                    }`}>
                        <div className="p-4 border-b border-inherit">
                            <h3 className="font-bold tracking-wider text-sm opacity-50 uppercase">
                                {group === 'TERMINAL' ? 'System Terminal' : 'A.I.D.A. Interface'}
                            </h3>
                        </div>
                        <div className="flex-grow p-4 flex items-center justify-center opacity-30">
                            <p className="text-sm text-center">Platzhalter:<br/>Agenten-Kommunikation</p>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER: Fortschrittsanzeige */}
            <div className={`h-16 border-t flex items-center justify-between px-8 flex-shrink-0 ${
                group === 'TERMINAL' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
            }`}>
                <div className="text-xs uppercase tracking-widest opacity-50">
                    Experiment Status
                </div>

                {/* Rudimentärer Progress Bar */}
                <div className="flex gap-2">
                    {['ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY'].map((phase, index) => {
                        // Simpler Check für den Fortschritt (MVP Style)
                        const phases = ['INIT', 'ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY', 'DEBRIEFING'];
                        const currentIndex = phases.indexOf(currentPhase);
                        const phaseIndex = phases.indexOf(phase);

                        const isCompleted = currentIndex > phaseIndex;
                        const isActive = currentPhase === phase;

                        return (
                            <div key={phase} className={`h-2 w-12 rounded-full transition-all duration-300 ${
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