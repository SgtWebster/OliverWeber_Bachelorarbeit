// app/(main)/bachelorarbeit/thank-you/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function ThankYouPage() {
    const router = useRouter();
    const { currentPhase } = useExperimentStore();

    const [email, setEmail] = useState('');
    const [wantsRaffle, setWantsRaffle] = useState(true); // Gewinnspiel als Default an
    const [wantsNewsletter, setWantsNewsletter] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 🚨 DIE FIREWALL: Wirft jeden raus, der das Experiment nicht regulär beendet hat
    useEffect(() => {
        if (currentPhase !== 'DEBRIEFING') {
            router.replace('/bachelorarbeit');
        }
    }, [currentPhase, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, wantsRaffle, wantsNewsletter })
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[70vh] max-w-2xl mx-auto px-4 py-16 flex items-center justify-center text-slate-800">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                {/* Header-Bereich */}
                <div className="bg-sky-900 px-8 py-10 text-center text-white">
                    <h1 className="text-3xl font-bold mb-4">Vielen Dank für deine Teilnahme!</h1>
                    <p className="text-sky-100 leading-relaxed">
                        Dein Datensatz wurde vollständig anonymisiert gespeichert und trägt maßgeblich zum Erfolg dieser Bachelorarbeit bei.
                    </p>
                </div>

                {/* Formular-Bereich */}
                <div className="p-8">
                    {status === 'success' ? (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-6 rounded-xl text-center">
                            <h3 className="text-xl font-bold mb-2">Erfolgreich eingetragen!</h3>
                            <p>Deine E-Mail-Adresse wurde registriert. Die Gewinner der Amazon-Gutscheine werden nach Abschluss der Erhebung benachrichtigt.</p>
                            <button
                                onClick={() => router.push('/')}
                                className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                            >
                                Zurück zur Startseite
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Gewinnspiel & Ergebnisse</h2>
                                <p className="text-sm text-slate-600 mb-6">
                                    Unter allen Teilnehmern werden 1x 50,- Euro und 2x 25,- Euro Amazon Gutscheine verlost. Deine E-Mail-Adresse wird <strong>strikt getrennt</strong> von deinen Experiment-Daten gespeichert und nach der Auslosung unwiderruflich gelöscht.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                    E-Mail-Adresse
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="max.mustermann@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={wantsRaffle}
                                        onChange={(e) => setWantsRaffle(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
                                    />
                                    <span className="text-sm text-slate-700">
                                        Ich möchte an der Verlosung der 1x 50,- Euro und 2x 25,- Euro Amazon Gutscheine teilnehmen.
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={wantsNewsletter}
                                        onChange={(e) => setWantsNewsletter(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
                                    />
                                    <span className="text-sm text-slate-700">
                                        Ich möchte eine kurze Zusammenfassung der Ergebnisse erhalten, sobald die Arbeit abgeschlossen ist.
                                    </span>
                                </label>
                            </div>

                            {status === 'error' && (
                                <p className="text-red-600 text-sm font-semibold">Es gab ein Problem bei der Speicherung. Bitte versuche es noch einmal.</p>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <button type="button" onClick={() => router.push('/')} className="w-full sm:w-auto text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
                                    <span className="block">Nein, danke!</span>
                                    <span className="block">(Beenden)</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white transition ${
                                        status === 'loading' ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800 shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {status === 'loading' ? 'Wird gespeichert...' : 'Daten absenden'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
