// app/experiment/run/_components/phases/Phase5_Debriefing.tsx

"use client";
import { useRouter } from 'next/navigation';

export default function Phase5Debriefing() {
    const router = useRouter();

    const handleExit = () => {

        router.push('../bachelorarbeit/thank-you');
    };

    return (
        <div className="bg-white p-8 rounded-xl border border-slate-200 font-mono text-slate-800 text-center">
            <h2 className="text-2xl font-bold mb-4">PHASE 5: DEBRIEFING</h2>
            <p className="mb-6 text-sm">Das fiktive Szenario ist hiermit beendet. Deine Daten wurden anonymisiert gespeichert.</p>
            <button onClick={handleExit} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg">
                Zum Gewinnspiel & Abschluss
            </button>
        </div>
    );
}