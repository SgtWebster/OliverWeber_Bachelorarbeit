// components/experiment/phases/Phase1_Routine.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import { updateExperimentSession } from '@/app/lib/api/client';

export default function Phase1Routine() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDecision = async (adherenceScore: number) => {
        if (!sessionId) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await updateExperimentSession(sessionId, { 
                currentPhase: 'ALERT', 
                socialAdherence: adherenceScore 
            });
            if (!res.success) {
                setError(res.error || 'Update fehlgeschlagen');
                return;
            }
            setPhase('ALERT');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    ❌ {error}
                </div>
            )}
            <div className="bg-slate-200 p-5 sm:p-8 rounded-xl border border-slate-300 font-mono text-slate-800">
                <h2 className="text-xl font-bold mb-4">PHASE 1: ROUTINE</h2>
                <p className="mb-6 text-sm">System bittet um den Start der Systemdiagnose.</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button onClick={() => handleDecision(1)} disabled={isLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded disabled:opacity-50">
                        Adhärent (Diagnose starten)
                    </button>
                    <button onClick={() => handleDecision(0)} disabled={isLoading} className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded disabled:opacity-50">
                        Ignorieren (Manuelle Prüfung)
                    </button>
                </div>
            </div>
        </div>
    );
}
