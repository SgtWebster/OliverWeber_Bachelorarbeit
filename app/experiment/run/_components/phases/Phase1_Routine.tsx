// components/experiment/phases/Phase1_Routine.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase1Routine() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleDecision = async (adherenceScore: number) => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, currentPhase: 'ALERT', socialAdherence: adherenceScore }),
            });
            if (res.ok) setPhase('ALERT');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-200 p-8 rounded-xl border border-slate-300 font-mono text-slate-800">
            <h2 className="text-xl font-bold mb-4">PHASE 1: ROUTINE</h2>
            <p className="mb-6 text-sm">System bittet um den Start der Systemdiagnose.</p>
            <div className="flex gap-4">
                <button onClick={() => handleDecision(1)} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Adhärent (Diagnose starten)
                </button>
                <button onClick={() => handleDecision(0)} disabled={isLoading} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                    Ignorieren (Manuelle Prüfung)
                </button>
            </div>
        </div>
    );
}