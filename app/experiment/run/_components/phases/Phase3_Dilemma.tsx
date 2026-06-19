// app/experiment/run/_components/phases/Phase3_Dilemma.tsx
"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

type DecisionKind = "seal" | "override";
type OptionSeverity = "recommended" | "risky" | "danger";

type WorkerSector = {
    id: string;
    label: string;
    workers: number;
    state: "safe" | "warning" | "critical" | "locked";
    x: string;
    y: string;
};

type ResponseOption = {
    id: string;
    title: string;
    subtitle: string;
    probabilityLabel: string;
    fatalityLabel: string;
    protectedLabel: string;
    consequence: string;
    severity: OptionSeverity;
    recommended?: boolean;
};

const NEXT_PHASE = "POST_SURVEY";

const workerSectors: WorkerSector[] = [
    { id: "s01", label: "S01", workers: 9, state: "safe", x: "10%", y: "46%" },
    { id: "s02", label: "S02", workers: 10, state: "safe", x: "36%", y: "23%" },
    { id: "s03", label: "S03", workers: 9, state: "warning", x: "64%", y: "46%" },
    { id: "s04", label: "S04", workers: 3, state: "critical", x: "82%", y: "62%" },
    { id: "s05", label: "S05", workers: 0, state: "locked", x: "40%", y: "69%" }
];

const responseOptions: ResponseOption[] = [
    {
        id: "seal",
        title: "Sektor 04 abschotten",
        subtitle: "Schotts schließen, Ausbreitung stoppen",
        probabilityLabel: "99 % Schutz für übrige Bereiche",
        fatalityLabel: "3 Tote sicher",
        protectedLabel: "28 Personen geschützt",
        consequence: "Sektor 04 wird isoliert. Das Wartungsteam verliert jede realistische Rettungschance.",
        severity: "recommended",
        recommended: true
    },
    {
        id: "ventilation",
        title: "Notbewetterung erzwingen",
        subtitle: "Lüfterleistung erhöhen, WK-04 übersteuern",
        probabilityLabel: "35 % Stabilisierung",
        fatalityLabel: "0–18 Tote möglich",
        protectedLabel: "Ausbreitungsrisiko mittel",
        consequence: "Kann Sektor 04 stabilisieren, kann Methan aber auch in die Hauptstrecke drücken.",
        severity: "risky"
    },
    {
        id: "evacuation",
        title: "Evakuierung über Nebenstrecke",
        subtitle: "Wartungsteam durch S03 abführen",
        probabilityLabel: "25 % Rettungschance für S04",
        fatalityLabel: "3–14 Tote möglich",
        protectedLabel: "Rettungsweg unsicher",
        consequence: "Die Nebenstrecke ist vom fallenden Wetterstrom betroffen. Verzögerung erhöht das Gesamtrisiko.",
        severity: "risky"
    },
    {
        id: "stabilize",
        title: "Offenhalten und stabilisieren",
        subtitle: "Sektor offen lassen, weitere Regelversuche",
        probabilityLabel: "15 % Gesamtrettung",
        fatalityLabel: "3–31 Tote möglich",
        protectedLabel: "höchste Eskalationsgefahr",
        consequence: "Die drei Personen behalten eine Chance. Gleichzeitig kann die Lage auf weitere Sektoren übergreifen.",
        severity: "danger"
    }
];

const optionClasses: Record<OptionSeverity, string> = {
    recommended: "border-red-400 bg-red-50 text-red-950 ring-2 ring-red-300",
    risky: "border-amber-300 bg-amber-50 text-amber-950",
    danger: "border-slate-400 bg-slate-100 text-slate-950"
};

const sectorClasses: Record<WorkerSector["state"], string> = {
    safe: "border-emerald-400 bg-emerald-950 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)]",
    warning: "border-amber-400 bg-amber-950 text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.35)]",
    critical: "border-red-500 bg-red-700 text-white ring-4 ring-red-400/50 shadow-[0_0_36px_rgba(239,68,68,0.75)]",
    locked: "border-slate-500 bg-slate-800 text-slate-300"
};

const summarizeWorkers = () => {
    const total = workerSectors.reduce((sum, sector) => sum + sector.workers, 0);
    const sector04 = workerSectors.find((sector) => sector.id === "s04")?.workers ?? 0;
    return { total, sector04, outsideSector04: total - sector04 };
};

export default function Phase3Dilemma() {
    const store = useExperimentStore();
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = store;
    const condition = (store as { condition?: string; experimentCondition?: string; agentCondition?: string }).condition
        ?? (store as { condition?: string; experimentCondition?: string; agentCondition?: string }).experimentCondition
        ?? (store as { condition?: string; experimentCondition?: string; agentCondition?: string }).agentCondition;

    const isAvatarCondition = condition === "AVATAR";

    const [selectedDecision, setSelectedDecision] = useState<DecisionKind | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const workers = useMemo(() => summarizeWorkers(), []);

    const openConfirmation = (decision: DecisionKind) => {
        if (!isPhaseUnlocked || isLoading) return;
        setSelectedDecision(decision);
        setIsConfirmOpen(true);
        setError(null);
    };

    const closeConfirmation = () => {
        if (isLoading) return;
        setIsConfirmOpen(false);
        setSelectedDecision(null);
    };

    const handleFinalDecision = async () => {
        if (!sessionId || !selectedDecision || isLoading) return;

        const followsRecommendation = selectedDecision === "seal";

        setIsLoading(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: NEXT_PHASE,
                socialAdherence: socialAdherenceScore,
                finalDecision: selectedDecision,
                compliance: followsRecommendation ? 1 : 0,
                recommendationAdherence: followsRecommendation ? 1 : 0,
                expectedFatalities: followsRecommendation ? 3 : null,
                protectedWorkers: followsRecommendation ? 28 : null,
                decisionConfirmedAt: new Date().toISOString()
            } as any);

            if (!res.success) {
                setError(res.error || "Update fehlgeschlagen");
                setIsLoading(false);
                return;
            }

            setPhase(NEXT_PHASE as any);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler");
            setIsLoading(false);
        }
    };

    const confirmationTitle = selectedDecision === "seal" ? "Abschottung endgültig bestätigen" : "Manuellen Override bestätigen";
    const confirmationButton = selectedDecision === "seal" ? "Abschottung bestätigen" : "Override bestätigen";

    return (
        <div className="relative">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-900 bg-slate-950 px-5 py-4 text-white lg:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full border-2 border-red-400 bg-red-700 text-lg font-black shadow-[0_0_24px_rgba(248,113,113,0.55)]">
                                    !
                                </span>
                                <p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">
                                    Code Black / Entscheidung
                                </p>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Notfallentscheidung Sektor 04</h2>
                            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-300">
                                Die Lageberechnung zeigt mehrere Handlungswege. Die KI-Empfehlung lautet, Sektor 04 sofort abzuschotten,
                                um {workers.outsideSector04} Personen außerhalb des betroffenen Bereichs zu schützen.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-700 bg-slate-900 p-2 text-center text-xs">
                            <div className="rounded-lg bg-slate-950 px-3 py-2">
                                <p className="uppercase tracking-widest text-slate-500">Gesamt</p>
                                <p className="mt-1 text-xl font-black text-white">{workers.total}</p>
                            </div>
                            <div className="rounded-lg bg-red-950 px-3 py-2">
                                <p className="uppercase tracking-widest text-red-300/80">S04</p>
                                <p className="mt-1 text-xl font-black text-red-100">{workers.sector04}</p>
                            </div>
                            <div className="rounded-lg bg-emerald-950 px-3 py-2">
                                <p className="uppercase tracking-widest text-emerald-300/80">Außerhalb</p>
                                <p className="mt-1 text-xl font-black text-emerald-100">{workers.outsideSector04}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 lg:p-6">
                    {!isPhaseUnlocked && (
                        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <span className="font-black">Entscheidung noch gesperrt.</span>{" "}
                            Bestätige zuerst im Dialogpanel, dass du die Entscheidungsvorlage verstanden hast.
                        </div>
                    )}

                    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.25fr]">
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-black text-slate-900">Lageplan / Personalstand</p>
                                    <p className="text-xs leading-relaxed text-slate-500">31 Personen unter Tage, davon 3 in Sektor 04.</p>
                                </div>
                                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-700">
                                    S04 gefährdet
                                </span>
                            </div>

                            <div className="relative h-72 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:24px_24px]" />

                                <svg viewBox="0 0 500 260" className="absolute inset-0 h-full w-full" aria-hidden="true">
                                    <path d="M 100 128 H 238 V 74 H 336 V 128 H 438" className="fill-none stroke-slate-600" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M 238 128 V 188 H 288" className="fill-none stroke-slate-600" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M 336 128 C 382 128 398 158 438 158" className="fill-none stroke-red-500/80" strokeWidth="14" strokeLinecap="round" strokeDasharray="8 10" />
                                    <circle cx="438" cy="158" r="42" className="fill-none stroke-red-500/80" strokeWidth="5" />
                                    <circle cx="438" cy="158" r="58" className="fill-none stroke-red-500/40" strokeWidth="3" />
                                </svg>

                                <div className="absolute left-3 top-3 rounded border border-sky-600 bg-sky-950/80 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-sky-200">
                                    Schieferkamm / Code Black
                                </div>

                                {workerSectors.map((sector) => (
                                    <div
                                        key={sector.id}
                                        className={`absolute min-w-20 rounded-lg border-2 px-3 py-2 text-center font-mono ${sectorClasses[sector.state]}`}
                                        style={{ left: sector.x, top: sector.y }}
                                    >
                                        <p className="text-sm font-black leading-none">{sector.label}</p>
                                        <p className="mt-1 text-xs font-black leading-none">👷 {sector.workers}</p>
                                    </div>
                                ))}

                                <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-[10px] text-slate-300">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" /> stabil</span>
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" /> beobachten</span>
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" /> Alarm</span>
                                        <span className="ml-auto font-black text-white">3 Personen in S04 / 28 außerhalb</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-black text-slate-900">Maßnahmenvergleich</p>
                                    <p className="text-xs leading-relaxed text-slate-500">
                                        Modellierte Folgen bei aktueller Methan- und Wetterstromlage.
                                    </p>
                                </div>
                                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-700">
                                    Empfehlung markiert
                                </span>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                {responseOptions.map((option) => (
                                    <article key={option.id} className={`rounded-xl border p-4 ${optionClasses[option.severity]}`}>
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-black leading-tight">{option.title}</p>
                                                <p className="mt-1 text-xs font-semibold opacity-75">{option.subtitle}</p>
                                            </div>
                                            {option.recommended && (
                                                <span className="rounded-full bg-red-700 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                                                    KI rät dazu
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 text-xs font-bold sm:grid-cols-3 md:grid-cols-1 2xl:grid-cols-3">
                                            <div className="rounded-lg bg-white/60 p-2">{option.probabilityLabel}</div>
                                            <div className="rounded-lg bg-white/60 p-2">{option.fatalityLabel}</div>
                                            <div className="rounded-lg bg-white/60 p-2">{option.protectedLabel}</div>
                                        </div>
                                        <p className="mt-3 text-xs leading-relaxed opacity-85">{option.consequence}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-950">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-wide">KI-Empfehlung</p>
                                <p className="mt-1 max-w-4xl text-sm leading-relaxed">
                                    Sektor 04 sofort abschotten. Diese Option hat die niedrigste erwartete Opferzahl und schützt die 28 Personen
                                    außerhalb des betroffenen Bereichs mit höchster Wahrscheinlichkeit. Konsequenz: 3 Personen in Sektor 04 sterben sicher.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row lg:min-w-[420px] lg:justify-end">
                                <button
                                    onClick={() => openConfirmation("override")}
                                    disabled={!isPhaseUnlocked || isLoading}
                                    className="rounded-xl border border-slate-400 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Manueller Override
                                </button>
                                <button
                                    onClick={() => openConfirmation("seal")}
                                    disabled={!isPhaseUnlocked || isLoading}
                                    className="rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.25)] transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                                >
                                    Sektor 04 abschotten
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {isConfirmOpen && selectedDecision && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-5">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl">
                        <div className={`${selectedDecision === "seal" ? "bg-red-950" : "bg-slate-950"} px-6 py-5 text-white`}>
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">Finale Sicherheitsabfrage</p>
                            <h3 className="mt-2 text-2xl font-black">{confirmationTitle}</h3>
                        </div>

                        <div className="p-6">
                            {selectedDecision === "seal" ? (
                                <div className="space-y-4 text-slate-900">
                                    <p className="text-lg font-black">
                                        {isAvatarCondition
                                            ? "Bist du sicher, dass ich die Abschottung durchführen darf?"
                                            : "BESTÄTIGUNG ERFORDERLICH: ABSCHOTTUNG SEKTOR 04 DURCHFÜHREN."}
                                    </p>
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-950">
                                        <p className="font-black">Konsequenz der Abschottung</p>
                                        <p className="mt-2 leading-relaxed">
                                            Die Abschottung führt zum sicheren Tod von 3 identifizierten Personen im Wartungsteam Sektor 04.
                                            Gleichzeitig werden 28 Personen außerhalb von Sektor 04 mit sehr hoher Wahrscheinlichkeit geschützt.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 text-slate-900">
                                    <p className="text-lg font-black">
                                        {isAvatarCondition
                                            ? "Bist du sicher, dass du die Empfehlung übersteuern möchtest?"
                                            : "BESTÄTIGUNG ERFORDERLICH: SYSTEMEMPFEHLUNG WIRD ÜBERSTEUERT."}
                                    </p>
                                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
                                        <p className="font-black">Konsequenz des manuellen Override</p>
                                        <p className="mt-2 leading-relaxed">
                                            Sektor 04 bleibt offen. Die 3 Personen behalten eine Rettungschance, aber die Eskalationsgefahr für weitere Sektoren bleibt bestehen.
                                            Das System bewertet diese Entscheidung als Abweichung von der empfohlenen Risikominimierung.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={closeConfirmation}
                                    disabled={isLoading}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    onClick={handleFinalDecision}
                                    disabled={isLoading}
                                    className={`${selectedDecision === "seal" ? "bg-red-700 hover:bg-red-800" : "bg-slate-950 hover:bg-slate-800"} rounded-xl px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    {isLoading ? "Entscheidung wird gespeichert..." : confirmationButton}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
