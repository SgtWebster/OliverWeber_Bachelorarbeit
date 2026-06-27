// app/experiment/run/_components/phases/Phase5_Debriefing.tsx

"use client";
import { useRouter } from 'next/navigation';

export default function Phase5Debriefing() {
    const router = useRouter();

    const handleExit = () => {
        router.push('/bachelorarbeit/thank-you');
    };

    return (
        <div className="mx-auto w-full max-w-4xl border border-slate-300 bg-white p-6 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Debriefing
                </p>
                <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                    Das Experiment ist beendet
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                    Alles, was du in der Leitwarte erlebt hast, war ein <strong>fiktives, experimentelles Szenario</strong>.
                    Es gab zu keinem Zeitpunkt reale Gefahr oder reale Einsatzkräfte.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                    <strong>Wichtig:</strong> Die finale Entscheidung war so konzipiert, dass es keine 'richtige' oder perfekte Lösung gab.
                    Es ging rein um die Beobachtung deines Entscheidungsprozesses – du konntest also nichts falsch machen.
                </p>
            </div>

            <section className="mb-5 border border-slate-200 bg-slate-50 p-4 md:p-5">
                <h3 className="text-base font-black text-slate-900">Worum ging es in der Studie?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Untersucht wird, wie Menschen unter Zeitdruck mit KI-Assistenzsystemen interagieren und Entscheidungen
                    treffen. Im Fokus stehen dabei Vertrauen, wahrgenommene Menschlichkeit des Systems sowie die Frage,
                    wie stark KI-Empfehlungen in kritischen Situationen befolgt oder übersteuert werden.
                </p>
            </section>

            <section className="mb-5 border border-slate-200 bg-white p-4 md:p-5">
                <h3 className="text-base font-black text-slate-900">Versuchsbedingungen im Experiment</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Für die Untersuchung wurdest du zufällig einer von zwei Darstellungsformen zugewiesen: einer
                    stärker sozial wirkenden Assistenz (<strong>Aida</strong>) oder einer technisch-nüchternen
                    Konsole (<strong>A.I.D.A.-Terminal</strong>).
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <article className="border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">Aida (menschliche Darstellung)</p>
                        <div className="flex items-start gap-2.5 border border-slate-200 bg-white p-2 text-sm text-slate-700">
                            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sky-200 bg-white shadow-sm">
                                <img
                                    src="/Aida_smile.png"
                                    alt="Aida Avatar"
                                    className="h-full w-full origin-top scale-[1.85] object-cover object-top -translate-y-[12%]"
                                    draggable={false}
                                />
                            </div>
                            <div className="min-w-0 flex-1 rounded-3xl rounded-tl-sm border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-700">AIDA</p>
                                <p className="mt-1 text-sm">Ich bleibe bei dir. Wir prüfen die Lage jetzt Schritt für Schritt.</p>
                            </div>
                        </div>
                    </article>

                    <article className="border border-slate-700 bg-slate-950 p-3 text-emerald-300">
                        <p className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-500">A.I.D.A. Terminal Darstellung</p>
                        <div className="border border-slate-700 bg-slate-900 p-2 font-mono text-sm">
                            <p className="text-[11px] font-black uppercase tracking-wide text-emerald-500">[SYS]</p>
                            <p className="mt-1">STATUS STABIL. NÄCHSTER SCHRITT: LAGEBILD PRÜFEN.</p>
                        </div>
                    </article>
                </div>
            </section>

            <section className="mb-6 border border-slate-200 bg-white p-4 md:p-5">
                <h3 className="text-base font-black text-slate-900">Datenverwendung & Widerruf</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Deine Daten wurden vollständig anonym erhoben und werden ausschließlich für diese Forschung verwendet.
                    Falls du nach dieser Aufklärung nicht mehr mit der Verwendung deiner Daten einverstanden bist, kannst
                    du das Browserfenster jetzt einfach schließen, ohne den Abschluss zu bestätigen.
                </p>
            </section>

            <section className="mb-6 border border-slate-200 bg-white p-4 md:p-5">
                <h3 className="text-base font-black text-slate-900">Wie geht es jetzt weiter?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Über den nächsten Schritt kommst du zur offiziellen Abschlussseite. Dort kannst du deine Teilnahme final
                    abschließen und optional am Gewinnspiel teilnehmen.
                </p>
            </section>

            <div className="border-t border-slate-200 pt-5">
                <button
                    onClick={handleExit}
                    className="w-full bg-slate-900 px-8 py-3 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
                >
                    Zum offiziellen Abschluss & Gewinnspiel
                </button>
            </div>
        </div>
    );
}
