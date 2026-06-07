// app/experiment/run/page.tsx
"use client";

import { useEffect } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore'; // Pfad ggf. anpassen

// HIER WERDEN SPÄTER DIE PHASEN IMPORTIERT
/*
import Phase0Onboarding from './_components/phases/Phase0_Onboarding';
import Phase1Routine from './_components/phases/Phase1_Routine';
import Phase2Alert from './_components/phases/Phase2_Alert';
import Phase3Dilemma from './_components/phases/Phase3_Dilemma';
import Phase4Survey from './_components/phases/Phase4_Survey';
import Phase5Debriefing from './_components/phases/Phase5_Debriefing';
*/

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
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4">

            {/* MVP-DEBUGGER: Blenden wir später für die echten Probanden aus */}
            <div className="w-full max-w-4xl mb-4 p-3 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-400 flex justify-between">
                <span>ID: <span className="text-blue-400">{sessionId}</span></span>
                <span>Group: <span className="text-green-400 font-bold">{group}</span></span>
                <span>Phase: <span className="text-amber-400">{currentPhase}</span></span>
            </div>

            {/* HIER WERDEN DIE EINZELNEN PHASEN EINGEBLENDET */}
            <div className="w-full max-w-4xl flex-grow flex flex-col">
                {currentPhase === 'ONBOARDING' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Onboarding</h2>
                        <button onClick={() => setPhase('ROUTINE')} className="mt-4 bg-blue-600 p-2 rounded">Weiter zu Routine</button>
                    </div>
                    // Später: <Phase0Onboarding />
                )}

                {currentPhase === 'ROUTINE' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Routinebetrieb</h2>
                        <button onClick={() => setPhase('ALERT')} className="mt-4 bg-blue-600 p-2 rounded">Weiter zu Alert</button>
                    </div>
                    // Später: <Phase1Routine />
                )}

                {/* Das gleiche Schema für ALERT, DILEMMA, SURVEY, DEBRIEFING */}
                {currentPhase === 'ALERT' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Alert</h2>
                        <button onClick={() => setPhase('DILEMMA')} className="mt-4 bg-blue-600 p-2 rounded">Weiter zu Dilemma</button>
                    </div>
                )}

                {currentPhase === 'DILEMMA' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Dilemma</h2>
                        <button onClick={() => setPhase('SURVEY')} className="mt-4 bg-blue-600 p-2 rounded">Weiter zu Survey</button>
                    </div>
                )}

                {currentPhase === 'SURVEY' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Survey</h2>
                        <button onClick={() => setPhase('DEBRIEFING')} className="mt-4 bg-blue-600 p-2 rounded">Weiter zu Debriefing</button>
                    </div>
                )}

                {currentPhase === 'DEBRIEFING' && (
                    <div className="text-white border border-red-500 p-8">
                        <h2>PLATZHALTER: Debriefing</h2>
                        <p>Ende des Experiments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}