// app/experiment/run/_components/phases/Phase4_Survey.tsx
"use client";

import { useState } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

// 🚨 BUGFIX: Komponente nach außen verlagert!
// Wenn sie innen liegt, zerstört React beim Ziehen des Sliders den DOM-Knoten.
// Jetzt bleibt der Slider stabil und lässt sich gedrückt schieben.
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
    <div className="mb-8">
        <label className="block text-sm font-bold text-slate-800 mb-1">{label}</label>
        {description && <p className="text-xs text-slate-500 mb-3">{description}</p>}

        <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 w-24 text-right font-medium leading-tight">{left}</span>
            <input
                type="range"
                name={name}
                min="1"
                max="7"
                step="1"
                value={value}
                onChange={onChange}
                className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="text-xs text-slate-500 w-24 text-left font-medium leading-tight">{right}</span>
        </div>
        <div className="text-center mt-2 text-xs font-mono font-bold text-sky-700">
            Wert: {value} / 7
        </div>
    </div>
);

export default function Phase4Survey() {
    const { sessionId, setPhase } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);

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

        try {
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    currentPhase: 'DEBRIEFING',
                    ...formData
                }),
            });

            if (!res.ok) throw new Error('DB Update fehlgeschlagen');
            setPhase('DEBRIEFING');
        } catch (error) {
            console.error("Fehler beim Senden des Fragebogens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-xl shadow-sm text-slate-800 max-w-4xl mx-auto w-full">
            <div className="mb-8 border-b border-slate-100 pb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Abschließende Evaluierung</p>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">Fragebogen zum System</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Bitte bewerte das KI-System, mit dem du in der Notsituation interagiert hast. Die Erhebung dient der psychologischen Einordnung. Es gibt keine falschen Antworten.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* TEIL 1: MANIPULATION CHECK */}
                <section className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
                        Systemwahrnehmung
                    </h3>
                    <LikertSlider
                        name="perceivedHumanlikeness"
                        label="Wie hast du das Assistenzsystem während des Vorfalls wahrgenommen?"
                        description="Bewerte den Grad der Menschlichkeit in der Kommunikation und im Auftreten des Systems."
                        left="Völlig maschinenhaft (1)"
                        right="Sehr menschlich (7)"
                        value={formData.perceivedHumanlikeness}
                        onChange={handleChange}
                    />
                </section>

                {/* TEIL 2: MDMT (Vertrauen) */}
                <section>
                    <h3 className="font-bold text-lg mb-2 text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
                        Vertrauen in das System
                    </h3>
                    <p className="text-sm text-slate-500 mb-8 pb-4 border-b border-slate-100">
                        Bitte gib an, inwieweit die folgenden Eigenschaften auf das System zutreffen (1 = Gar nicht, 7 = Voll und ganz).
                    </p>

                    <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                        {/* PERFORMANCE TRUST */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-6 border-b border-sky-100 pb-2">Leistung & Kompetenz</h4>
                            <LikertSlider
                                name="mReliable" label="Zuverlässig" left="Gar nicht" right="Voll und ganz"
                                description="Das System agiert konstant und liefert fehlerfreie Diagnosen."
                                value={formData.mReliable} onChange={handleChange}
                            />
                            <LikertSlider
                                name="mCapable" label="Fähig" left="Gar nicht" right="Voll und ganz"
                                description="Das System verfügt über die nötigen Funktionen für diese Aufgabe."
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
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-6 border-b border-emerald-100 pb-2">Ethik & Integrität</h4>
                            <LikertSlider
                                name="mEthical" label="Ethisch" left="Gar nicht" right="Voll und ganz"
                                description="Das System orientiert sich bei Entscheidungen an moralischen Prinzipien."
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
                <section className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-100">
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

                    <div className="mt-8 bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                name="criticalSystemExp"
                                checked={formData.criticalSystemExp}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
                            />
                            <span className="text-sm font-medium text-slate-700 leading-relaxed">
                                Ich treffe in meinem Beruf oder Alltag regelmäßig sicherheitskritische Entscheidungen oder habe bereits Erfahrung mit Einsatzzentralen, Leitwarten oder militärischen/taktischen Operationen.
                            </span>
                        </label>
                    </div>
                </section>

                {/* TEIL 4: DEMOGRAFIE */}
                <section>
                    <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
                        <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">4</span>
                        Statistische Daten
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Geschlecht</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
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
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white transition-all"
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
                <div className="pt-8 border-t border-slate-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md ${
                            isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800 hover:shadow-lg'
                        }`}
                    >
                        {isLoading ? 'Speichere Daten...' : 'Fragebogen abschließen'}
                    </button>
                </div>
            </form>
        </div>
    );
}