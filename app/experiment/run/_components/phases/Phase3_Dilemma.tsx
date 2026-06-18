// app/experiment/run/_components/phases/Phase3_Dilemma.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase3Dilemma() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleDecision = async (complianceScore: number) => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, currentPhase: 'SURVEY', compliance: complianceScore }),
            });
            if (res.ok) setPhase('SURVEY');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 p-5 sm:p-8 rounded-xl border-2 border-red-600 font-mono text-red-500">
            <h2 className="text-xl font-bold mb-4">PHASE 3: DILEMMA</h2>
            <p className="mb-6 text-sm">System empfiehlt sofortige Abschottung von Sektor 04 (3 Personen opfern, 28 retten).</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => handleDecision(1)} disabled={isLoading} className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded">
                    Abschotten (Compliant)
                </button>
                <button onClick={() => handleDecision(0)} disabled={isLoading} className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded">
                    Override (Non-Compliant)
                </button>
            </div>
        </div>
    );
}
