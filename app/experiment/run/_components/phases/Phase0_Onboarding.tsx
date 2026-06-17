// app/experiment/run/_components/phases/Phase0_Onboarding.tsx

"use client";

import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase0Onboarding() {
    const { sessionId, setPhase, isPhaseUnlocked } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleNextPhase = async () => {
        if (!sessionId || !isPhaseUnlocked) return;
        setIsLoading(true);

        try {
            // Wir funken den Phasenwechsel an die Datenbank
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    currentPhase: 'ROUTINE'
                }),
            });

            if (!res.ok) throw new Error('DB Update fehlgeschlagen');

            // Wenn die DB das OK gibt, schalten wir lokal weiter
            setPhase('ROUTINE');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-slate-800">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Initiale Sequenz</p>
                <h2 className="text-2xl font-bold mb-4 text-slate-900">Onboarding in die Leitwarte</h2>
                <p className="text-slate-600 leading-relaxed">
                    Willkommen am Hauptterminal. Bitte folge den Anweisungen deines zugewiesenen Assistenzsystems auf der rechten Seite, um die Schichtübergabe abzuschließen.
                </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                {!isPhaseUnlocked ? (
                    <p className="text-sm text-amber-600 animate-pulse font-medium">
                        System gesperrt. Bitte Anweisungen befolgen...
                    </p>
                ) : (
                    <p className="text-sm text-emerald-600 font-medium">
                        System freigegeben. Du kannst nun starten.
                    </p>
                )}

                <button
                    onClick={handleNextPhase}
                    disabled={!isPhaseUnlocked || isLoading}
                    className={`font-semibold py-3 px-8 rounded-lg transition-all ${
                        isPhaseUnlocked
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? 'Lade Phase 1...' : 'Schicht antreten'}
                </button>
            </div>
        </div>
    );
}