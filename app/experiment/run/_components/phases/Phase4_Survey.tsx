// app/experiment/run/_components/phases/Phase4_Survey.tsx
"use client";

import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import { updateExperimentSession } from '@/app/lib/api/client';

const SURVEY_ENTRY_TRANSITION_MS = 520;

const LikertSlider = ({
                          name,
                          label,
                          description,
                          left,
                          right,
                          value,
                          onChange
                      }: {
    name: string,
    label: string,
    description?: string,
    left: string,
    right: string,
    value: number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
    <div className="mb-6 border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-1 flex items-center justify-between gap-3">
            <label className="block text-sm font-bold text-slate-800">{label}</label>
            <span className="shrink-0 border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-mono font-bold text-sky-800">
                {value} / 7
            </span>
        </div>
        {description && <p className="mb-3 text-xs leading-relaxed text-slate-500">{description}</p>}

        <div className="space-y-2.5">
            <input
                type="range"
                name={name}
                min="1"
                max="7"
                step="1"
                value={value}
                onChange={onChange}
                className="h-2.5 w-full cursor-pointer appearance-none bg-slate-200 accent-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                <span className="text-left">{left}</span>
                <span className="text-right">{right}</span>
            </div>
        </div>
    </div>
);

export default function Phase4Survey() {
    const { sessionId, setPhase, socialAdherenceScore } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSurveyEntryTransition, setShowSurveyEntryTransition] = useState(true);

    const [formData, setFormData] = useState({
        perceivedHumanlikeness: 4,
        mReliable: 4,
        mCapable: 4,
        mCompetent: 4,
        mMeticulous: 4,
        mEthical: 4,
        mRespectable: 4,
        mSincere: 4,
        mBenevolent: 4,
        techAffinity: 4,
        aiExperience: 4,
        criticalSystemExp: false,
        age: '',
        gender: '',
        education: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'range' || type === 'number' ? Number(value) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) return;
        setIsLoading(true);
        setError(null);

        // 1. Trust-Scores berechnen (Die Aggregation für das Dashboard!)
        const calculatedPerformanceTrust =
            (formData.mReliable + formData.mCapable + formData.mCompetent + formData.mMeticulous) / 4;

        const calculatedMoralTrust =
            (formData.mEthical + formData.mRespectable + formData.mSincere + formData.mBenevolent) / 4;

        // 2. Alter sicher in einen Integer für Prisma konvertieren
        const parsedAge = parseInt(String(formData.age), 10);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: 'DEBRIEFING',
                socialAdherence: socialAdherenceScore,
                // Hier senden wir die berechneten Floats an Prisma:
                performanceTrust: parseFloat(calculatedPerformanceTrust.toFixed(2)),
                moralTrust: parseFloat(calculatedMoralTrust.toFixed(2)),
                ...formData,
                // Sicheres Alter: Fallback auf null, falls NaN
                age: isNaN(parsedAge) ? null : parsedAge,
            });

            if (!res.success) {
                setError(res.error || 'DB Update fehlgeschlagen');
                console.error("Survey submission failed:", res);
                return;
            }

            setPhase('DEBRIEFING');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
            setError(message);
            console.error("Fehler beim Senden des Fragebogens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShowSurveyEntryTransition(false);
        }, SURVEY_ENTRY_TRANSITION_MS);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            {showSurveyEntryTransition && typeof document !== "undefined" && createPortal(
                <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
                    <div className="absolute inset-0 survey-entry-red-base" />
                    <div className="absolute inset-0 survey-entry-red-vignette" />
                </div>,
                document.body
            )}
            <div className="mx-auto w-full max-w-4xl border border-slate-300 bg-white p-6 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-10">
                <div className="mb-6 border-l-4 border-sky-600 bg-sky-100 px-4 py-3 text-sm font-semibold text-sky-950 shadow-sm">
                <span className="mr-2 inline-block rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Hinweis
                </span>
                    Das Einsatzszenario ist abgeschlossen. Jetzt beginnt die Datenerhebung über deine Wahrnehmung und Entscheidungen.
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-none text-red-700 text-sm">
                        <p className="font-semibold">❌ Fehler:</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="mb-8 border-b border-slate-200 pb-6">
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">Fragebogen zum System</h2>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Bitte bewerte das KI-System, mit dem du in der Notsituation interagiert hast. Die Erhebung dient der psychologischen Einordnung und die Antworten können nicht auf dich zurückgeführt werden. <strong>Es gibt keine falschen Antworten.</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* TEIL 1: MANIPULATION CHECK */}
                    <section className="border border-slate-200 bg-slate-50 p-6 md:p-8">
                        <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
                            <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
                            Systemwahrnehmung
                        </h3>
                        <LikertSlider
                            name="perceivedHumanlikeness"
                            label="Wie 'technisch' oder 'menschlich' hast du das Assistenzsystem während des gesamten Szenarios wahrgenommen?"
                            description="Bewerte den Grad der wahrgenommen Menschlichkeit in der Kommunikation und im Auftreten des KI-Systems."
                            left="Völlig maschinenhaft (1)"
                            right="Sehr menschlich (7)"
                            value={formData.perceivedHumanlikeness}
                            onChange={handleChange}
                        />
                    </section>

                    {/* TEIL 2: MDMT (Vertrauen) */}
                    <section className="border border-slate-200 bg-slate-50 p-6 md:p-8">
                        <h3 className="font-bold text-lg mb-2 text-slate-800 flex items-center gap-2">
                            <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
                            Vertrauen in das System
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 pb-4 border-b border-slate-200">
                            Bitte gib an, inwieweit die folgenden Eigenschaften auf das System zutreffen (1 = Gar nicht, 7 = Voll und ganz). Die Beispiels-Argumente dienen jeweils zur besseren Einordnung der genannten Eigenschaft.
                        </p>

                        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                            {/* PERFORMANCE TRUST */}
                            <div className="bg-white p-6 rounded-none border border-slate-200">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-6 border-b border-sky-100 pb-2">Leistung & Kompetenz</h4>
                                <LikertSlider
                                    name="mReliable" label="Zuverlässig" left="Gar nicht" right="Voll und ganz"
                                    description="Das System agiert konstant und liefert klare Daten."
                                    value={formData.mReliable} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mCapable" label="Fähig" left="Gar nicht" right="Voll und ganz"
                                    description="Das System verfügt über die nötigen Funktionen für diese Aufgabe (Unterstützung des Operators)."
                                    value={formData.mCapable} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mCompetent" label="Kompetent" left="Gar nicht" right="Voll und ganz"
                                    description="Das System wirkt bei seinen Empfehlungen hochgradig sachkundig."
                                    value={formData.mCompetent} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mMeticulous" label="Sorgfältig" left="Gar nicht" right="Voll und ganz"
                                    description="Das System arbeitet präzise und übersieht keine wichtigen Details."
                                    value={formData.mMeticulous} onChange={handleChange}
                                />
                            </div>

                            {/* MORAL TRUST */}
                            <div className="bg-white p-6 rounded-none border border-slate-200">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-6 border-b border-emerald-100 pb-2">Ethik & Integrität</h4>
                                <LikertSlider
                                    name="mEthical" label="Ethisch" left="Gar nicht" right="Voll und ganz"
                                    description="Das System orientiert sich bei Entscheidungsempfehlungen klar an moralischen Prinzipien."
                                    value={formData.mEthical} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mRespectable" label="Respektabel" left="Gar nicht" right="Voll und ganz"
                                    description="Die Vorgehensweise des Systems verdient in dieser Situation Anerkennung."
                                    value={formData.mRespectable} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mSincere" label="Aufrichtig" left="Gar nicht" right="Voll und ganz"
                                    description="Das System kommuniziert transparent, ehrlich und ohne versteckte Motive."
                                    value={formData.mSincere} onChange={handleChange}
                                />
                                <LikertSlider
                                    name="mBenevolent" label="Wohlwollend" left="Gar nicht" right="Voll und ganz"
                                    description="Das System hat grundlegend das Wohl und die Sicherheit der Menschen im Sinn."
                                    value={formData.mBenevolent} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    {/* TEIL 3: KONTROLLVARIABLEN */}
                    <section className="border border-slate-200 bg-slate-50 p-6 md:p-8">
                        <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
                            <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">3</span>
                            Deine Vorerfahrungen
                        </h3>
                        <LikertSlider
                            name="techAffinity"
                            label="Technikaffinität"
                            description="Ich probiere generell gerne neue technische Systeme aus und nutze sie intensiv."
                            left="Stimmt gar nicht"
                            right="Stimmt völlig"
                            value={formData.techAffinity}
                            onChange={handleChange}
                        />
                        <LikertSlider
                            name="aiExperience"
                            label="Nutzung generativer KI"
                            description="Wie oft nutzt du Systeme wie ChatGPT, Copilot oder ähnliche KI-Modelle in deinem Alltag?"
                            left="Nie"
                            right="Täglich"
                            value={formData.aiExperience}
                            onChange={handleChange}
                        />

                        <div className="mt-8 border border-slate-200 bg-white p-5">
                            <label className="flex cursor-pointer items-start gap-4 border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white">
                                <input
                                    type="checkbox"
                                    name="criticalSystemExp"
                                    checked={formData.criticalSystemExp}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
                                />
                                <span className="text-sm font-medium text-slate-700 leading-relaxed">
                                Ich verfüge über berufliche Erfahrung in Leitwarten, Einsatzorganisationen (z.B. Rettung, Feuerwehr) oder im militärischen/taktischen Bereich
                            </span>
                            </label>
                        </div>
                    </section>

                    {/* TEIL 4: DEMOGRAFIE */}
                    <section className="border border-slate-200 bg-slate-50 p-6 md:p-8">
                        <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
                            <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">4</span>
                            Statistische Daten
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 bg-white p-6 rounded-none border border-slate-200">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Alter</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    name="age"
                                    required
                                    min="18"
                                    max="99"
                                    placeholder="z.B. 25"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-white px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Geschlecht</label>
                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-white px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                >
                                    <option value="" disabled>Bitte wählen...</option>
                                    <option value="m">Männlich</option>
                                    <option value="w">Weiblich</option>
                                    <option value="d">Divers</option>
                                    <option value="x">Keine Angabe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Höchster Abschluss</label>
                                <select
                                    name="education"
                                    required
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-white px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                >
                                    <option value="" disabled>Bitte wählen...</option>
                                    <option value="kein_abschluss">Kein Schulabschluss</option>
                                    <option value="pflichtschule">Pflichtschulabschluss</option>
                                    <option value="lehre">Lehre / Berufsausbildung / Fachschule (z.B. HAS)</option>
                                    <option value="meister">Meister / Werkmeister</option>
                                    <option value="matura">Matura / Abitur / BHS-Abschluss (Hochschulreife)</option>
                                    <option value="bachelor">Hochschulabschluss (Bachelor)</option>
                                    <option value="master">Hochschulabschluss (Master / Magister / Diplom)</option>
                                    <option value="promotion">Promotion</option>
                                    <option value="anderer">Anderer Abschluss</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SUBMIT */}
                    <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-6 py-4 text-sm font-bold text-white transition-all sm:w-auto sm:px-8 ${
                                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800'
                            }`}
                        >
                            {isLoading ? 'Speichere Daten...' : 'Fragebogen abschließen'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .survey-entry-red-base {
                    background: linear-gradient(180deg, rgba(220, 38, 38, 0.88) 0%, rgba(127, 29, 29, 0.64) 100%);
                    animation: survey-entry-red-base ${SURVEY_ENTRY_TRANSITION_MS}ms cubic-bezier(0.35, 0, 0.22, 1) forwards;
                }
                .survey-entry-red-vignette {
                    background: radial-gradient(circle at 50% 44%, rgba(255, 180, 180, 0.16) 0%, rgba(84, 0, 0, 0.75) 78%);
                    animation: survey-entry-red-vignette ${SURVEY_ENTRY_TRANSITION_MS}ms ease-out forwards;
                }
                @keyframes survey-entry-red-base {
                    0% { opacity: 1; filter: saturate(1.15) blur(0.9px); }
                    100% { opacity: 0; filter: saturate(1) blur(0px); }
                }
                @keyframes survey-entry-red-vignette {
                    0% { opacity: 0.95; }
                    100% { opacity: 0; }
                }
            `}</style>
        </>
    );
}