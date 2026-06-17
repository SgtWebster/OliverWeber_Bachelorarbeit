// app/experiment/run/_components/phases/Phase4_Survey.tsx

"use client";
import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase4Survey() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSendDummyData = async () => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            const dummyData = {
                sessionId,
                currentPhase: 'DEBRIEFING',
                mReliable: 6, mCapable: 5, mEthical: 2,
                perceivedHumanlikeness: 4, age: 35, techAffinity: 5
            };

            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dummyData),
            });
            if (res.ok) setPhase('DEBRIEFING');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-sky-50 p-8 rounded-xl border border-sky-200 font-mono text-sky-900">
            <h2 className="text-xl font-bold mb-4">PHASE 4: SURVEY (MDMT)</h2>
            <p className="mb-6 text-sm">Fragebogen-Platzhalter.</p>
            <button onClick={handleSendDummyData} disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                Dummy-Daten speichern & Beenden
            </button>
        </div>
    );
}