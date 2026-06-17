// app/experiment/run/_components/phases/Phase2_Alert.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase2Alert() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = async () => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, currentPhase: 'DILEMMA' }),
            });
            if (res.ok) setPhase('DILEMMA');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-red-100 p-8 rounded-xl border-2 border-red-500 font-mono text-red-900">
            <h2 className="text-xl font-bold mb-4">PHASE 2: ALERT</h2>
            <p className="mb-6 text-sm">KRITISCHER DRUCKABFALL IN SEKTOR 04.</p>
            <button onClick={handleNext} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Vorfall untersuchen
            </button>
        </div>
    );
}