// app/experiment/run/_components/phases/Phase2_Alert.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import { updateExperimentSession } from '@/app/lib/api/client';

export default function Phase2Alert() {
    const { sessionId, setPhase, socialAdherenceScore } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNext = async () => {
        if (!sessionId) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: 'DILEMMA',
                socialAdherence: socialAdherenceScore
            });
            if (!res.success) {
                setError(res.error || 'Update fehlgeschlagen');
                return;
            }
            setPhase('DILEMMA');
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
            <div className="bg-red-100 p-5 sm:p-8 rounded-xl border-2 border-red-500 font-mono text-red-900">
                <h2 className="text-xl font-bold mb-4">PHASE 2: ALERT</h2>
                <p className="mb-6 text-sm">KRITISCHER DRUCKABFALL IN SEKTOR 04.</p>
                <button onClick={handleNext} disabled={isLoading} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded disabled:opacity-50">
                    Vorfall untersuchen
                </button>
            </div>
        </div>
    );
}
