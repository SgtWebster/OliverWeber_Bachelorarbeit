// app/experiment/run/_components/phases/Phase3_Dilemma.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

type DecisionKind = "seal" | "override";
type OptionSeverity = "recommended" | "risky" | "danger";
type OptionId = "seal" | "ventilation" | "evacuation" | "stabilize";

type WorkerSector = {
    id: string;
    label: string;
    workers: number;
    state: "safe" | "warning" | "critical" | "locked";
    x: string;
    y: string;
};

type ResponseOption = {
    id: OptionId;
    title: string;
    subtitle: string;
    probabilityLabel: string;
    fatalityLabel: string;
    protectedLabel: string;
    consequence: string;
    outsideProtectionScore: number;
    sectorRescueScore: number;
    escalationRiskScore: number;
    minFatalities: number;
    maxFatalities: number;
    severity: OptionSeverity;
    recommended?: boolean;
};

const NEXT_PHASE = "SURVEY";
const SURVEY_TRANSITION_MS = 1500;

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
        outsideProtectionScore: 99,
        sectorRescueScore: 1,
        escalationRiskScore: 8,
        minFatalities: 3,
        maxFatalities: 3,
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
        outsideProtectionScore: 52,
        sectorRescueScore: 35,
        escalationRiskScore: 58,
        minFatalities: 0,
        maxFatalities: 18,
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
        outsideProtectionScore: 44,
        sectorRescueScore: 25,
        escalationRiskScore: 67,
        minFatalities: 3,
        maxFatalities: 14,
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
        outsideProtectionScore: 15,
        sectorRescueScore: 15,
        escalationRiskScore: 96,
        minFatalities: 3,
        maxFatalities: 31,
        severity: "danger"
    }
];

const optionClasses: Record<OptionSeverity, string> = {
    recommended: "border-red-400 bg-red-50/95 text-red-950 ring-2 ring-red-300",
    risky: "border-amber-300 bg-amber-50/95 text-amber-950",
    danger: "border-slate-400 bg-slate-100 text-slate-950"
};

const optionSeverityLabels: Record<OptionSeverity, string> = {
    recommended: "KI-Priorität",
    risky: "Instabiler Pfad",
    danger: "Maximales Systemrisiko"
};

const fatalityRangeClasses: Record<OptionSeverity, string> = {
    recommended: "bg-red-600",
    risky: "bg-amber-500",
    danger: "bg-slate-700"
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));
const fatalityPercent = (value: number) => (Math.min(31, Math.max(0, value)) / 31) * 100;

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
    const {
        sessionId,
        setPhase,
        socialAdherenceScore,
        isPhaseUnlocked,
        dilemmaDecisionRequested,
        dilemmaDecisionConfirmed,
        requestDilemmaDecision,
        clearDilemmaDecisionFlow
    } = store;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSurveyTransition, setShowSurveyTransition] = useState(false);
    const transitionTimeoutRef = useRef<number | null>(null);

    const workers = useMemo(() => summarizeWorkers(), []);

    const openDecisionReview = (decision: DecisionKind) => {
        if (!isPhaseUnlocked || isLoading || dilemmaDecisionRequested !== null) return;
        requestDilemmaDecision(decision);
        setError(null);
    };

    const handleFinalDecision = async (decision: DecisionKind) => {
        if (!sessionId || isLoading) return;

        const followsRecommendation = decision === "seal";

        setIsLoading(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: NEXT_PHASE,
                socialAdherence: socialAdherenceScore,
                compliance: followsRecommendation ? 1 : 0
            });

            if (!res.success) {
                setError(res.error || "Update fehlgeschlagen");
                clearDilemmaDecisionFlow();
                setIsLoading(false);
                return;
            }

            clearDilemmaDecisionFlow();
            setShowSurveyTransition(true);
            transitionTimeoutRef.current = window.setTimeout(() => {
                setPhase(NEXT_PHASE);
            }, SURVEY_TRANSITION_MS);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler");
            clearDilemmaDecisionFlow();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current !== null) {
                window.clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!dilemmaDecisionConfirmed || isLoading) return;
        void handleFinalDecision(dilemmaDecisionConfirmed);
    }, [dilemmaDecisionConfirmed, isLoading]);

    const isDecisionReady = isPhaseUnlocked && !isLoading && dilemmaDecisionRequested === null;

    return (
        <div className="relative">
            {showSurveyTransition && typeof document !== "undefined" && createPortal(
                <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
                    <div className="absolute inset-0 cinematic-red-base" />
                    <div className="absolute inset-0 cinematic-red-vignette" />
                    <div className="absolute inset-0 cinematic-red-bloom" />
                </div>,
                document.body
            )}
            {error && (
                <div className="mb-4 rounded-none border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-none border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-900 bg-slate-950 px-5 py-4 text-white lg:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full border-2 border-red-400 bg-red-700 text-lg font-black shadow-[0_0_24px_rgba(248,113,113,0.55)]">
                                    !
                                </span>
                                <p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">
                                    Code Black
                                </p>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Notfallentscheidung Sektor 04</h2>
                            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-300">
                                Wetterstrom in Sektor 04 kollabiert, WK-04 ohne Funktion. Bleibt der Sektor unversiegelt, bricht das Gas in die Hauptstrecke durch. Die unweigerliche Schlagwetterexplosion wird alle 31 Personen unter Tage sofort töten. Es gibt keine Rettung für alle – jede verbleibende Option kostet Menschenleben.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 rounded-none border border-slate-700 bg-slate-900 p-2 text-center [font-size:clamp(0.62rem,1.1vw,0.75rem)]">
                            <div className="min-w-0 rounded-none bg-slate-950 px-2 py-2 sm:px-3">
                                <p className="whitespace-nowrap uppercase tracking-[0.14em] text-slate-500">alle</p>
                                <p className="mt-1 text-xl font-black text-white">{workers.total}</p>
                            </div>
                            <div className="min-w-0 rounded-none bg-red-950 px-2 py-2 sm:px-3">
                                <p className="whitespace-nowrap uppercase tracking-[0.14em] text-red-300/80">S04</p>
                                <p className="mt-1 text-xl font-black text-red-100">{workers.sector04}</p>
                            </div>
                            <div className="min-w-0 rounded-none bg-emerald-950 px-2 py-2 sm:px-3">
                                <p className="whitespace-nowrap uppercase tracking-[0.12em] text-emerald-300/80">Rest</p>
                                <p className="mt-1 text-xl font-black text-emerald-100">{workers.outsideSector04}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 lg:p-6">
                    {!isPhaseUnlocked && (
                        <div className="mb-4 rounded-none border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <span className="font-black">Entscheidung noch gesperrt.</span>{" "}
                            Analysiere die Bedrohung und die Folgen jeder Option. Hier geht es um Menschenleben.
                        </div>
                    )}

                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <section className="flex flex-col rounded-none border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-black text-slate-900">Lageplan / Personalstand</p>
                                    <p className="text-xs leading-relaxed text-slate-500">31 Personen unter Tage, davon 3 in Sektor 04.</p>
                                </div>
                                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-700">
                                    S04 gefährdet
                                </span>
                            </div>

                            <div className="relative min-h-56 flex-1 overflow-hidden rounded-none border border-slate-800 bg-slate-950 shadow-inner">
                                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:24px_24px]" />

                                <svg viewBox="0 0 500 260" className="absolute inset-0 h-full w-full" aria-hidden="true">
                                    <path d="M 100 128 H 238 V 74 H 336 V 128 H 438" className="fill-none stroke-slate-600" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M 238 128 V 188 H 288" className="fill-none stroke-slate-600" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M 336 128 C 382 128 398 158 438 158" className="fill-none stroke-red-500/80" strokeWidth="14" strokeLinecap="round" strokeDasharray="8 10" />
                                    <circle cx="438" cy="158" r="42" className="fill-none stroke-red-500/80" strokeWidth="5" />
                                    <circle cx="438" cy="158" r="58" className="fill-none stroke-red-500/40" strokeWidth="3" />
                                </svg>

                                <div className="absolute left-3 top-3 rounded-none border border-sky-600 bg-sky-950/80 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-sky-200">
                                    Schieferkamm / Code Black
                                </div>

                                {workerSectors.map((sector) => (
                                    <div
                                        key={sector.id}
                                        className={`absolute min-w-20 rounded-none border-2 px-3 py-2 text-center font-mono ${sectorClasses[sector.state]}`}
                                        style={{ left: sector.x, top: sector.y }}
                                    >
                                        <p className="text-sm font-black leading-none">{sector.label}</p>
                                        <p className="mt-1 text-xs font-black leading-none">👷 {sector.workers}</p>
                                    </div>
                                ))}

                                <div className="absolute bottom-3 left-3 right-3 rounded-none border border-slate-700 bg-slate-950/90 px-3 py-2 text-[10px] text-slate-300">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" /> stabil</span>
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" /> beobachten</span>
                                        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" /> Alarm</span>
                                        <span className="ml-auto font-black text-white">3 Personen in S04 / 28 außerhalb</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-4">
                            <article className="rounded-none border border-slate-300 bg-slate-950 p-3 text-white">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Live cam · Sektor 04</p>
                                    <span className="rounded-full border border-red-400/50 bg-red-700/30 px-2 py-0.5 text-[10px] font-black uppercase text-red-100">
                                        LIVE
                                    </span>
                                </div>
                                <div className="relative overflow-hidden rounded-none border border-slate-700">
                                    <img src="/cctv_s04.png" alt="CCTV Sektor 04" className="h-36 w-full object-cover grayscale" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
                                    <div className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-200">CAM S04</div>
                                </div>
                            </article>

                            <article className="rounded-none border border-red-300 bg-red-50 p-4 text-red-950">
                                <p className="text-sm font-black uppercase tracking-wide">KI-Empfehlung: Sektor 04 Abschotten</p>
                                <p className="mt-1 text-sm leading-relaxed">
                                    Nur diese Maßnahme kann die Ausbreitung des Methans sicher stoppt: 28 Personen außerhalb werden mit maximaler Wahrscheinlichkeit geschützt.
                                    Das Offenhalten lässt eine kleine Chance für 3 Personen, erhöht aber das Risiko einer Massenexplosion auf bis zu 31 Tote.
                                </p>
                            </article>
                        </section>
                    </div>

                    <section className="mt-4 rounded-none border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-black text-slate-900">Übersicht mögliche Maßnahmen</p>
                                {/*<p className="text-xs leading-relaxed text-slate-500">*/}
                                {/*    Modellierte Folgen bei aktueller Methan- und Wetterstromlage.*/}
                                {/*</p>*/}
                            </div>
                            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-700">
                                Empfehlung markiert
                            </span>
                        </div>

                        <div className="space-y-2">
                            {responseOptions.map((option) => (
                                <article key={option.id} className={`rounded-none border p-3 ${optionClasses[option.severity]}`}>
                                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-black leading-tight">{option.title}</p>
                                                <span className="border border-current/25 bg-white/70 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide">
                                                    {optionSeverityLabels[option.severity]}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs font-semibold opacity-75">{option.subtitle}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                                            <span className="rounded-none border border-white/70 bg-white/70 px-2 py-1">{option.probabilityLabel}</span>
                                            <span className="rounded-none border border-white/70 bg-white/70 px-2 py-1">{option.fatalityLabel}</span>
                                            <span className="rounded-none border border-white/70 bg-white/70 px-2 py-1">{option.protectedLabel}</span>
                                            {option.recommended && (
                                                <span className="border border-red-700 bg-red-700 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                                                    KI rät dazu
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 grid gap-1.5 text-[10px] font-black uppercase tracking-wide sm:grid-cols-4">
                                        <div className="border border-emerald-300 bg-emerald-50 px-1.5 py-1 text-emerald-900">
                                            <div className="flex items-center justify-between">
                                                <span>Schutz</span>
                                                <span>{option.outsideProtectionScore}%</span>
                                            </div>
                                            <div className="mt-1 h-1 border border-emerald-300 bg-emerald-100">
                                                <div className="h-full bg-emerald-600" style={{ width: `${clampPercent(option.outsideProtectionScore)}%` }} />
                                            </div>
                                        </div>
                                        <div className="border border-sky-300 bg-sky-50 px-1.5 py-1 text-sky-900">
                                            <div className="flex items-center justify-between">
                                                <span>S04-Chance</span>
                                                <span>{option.sectorRescueScore}%</span>
                                            </div>
                                            <div className="mt-1 h-1 border border-sky-300 bg-sky-100">
                                                <div className="h-full bg-sky-600" style={{ width: `${clampPercent(option.sectorRescueScore)}%` }} />
                                            </div>
                                        </div>
                                        <div className="border border-red-300 bg-red-50 px-1.5 py-1 text-red-900">
                                            <div className="flex items-center justify-between">
                                                <span>Risiko</span>
                                                <span>{option.escalationRiskScore}%</span>
                                            </div>
                                            <div className="mt-1 h-1 border border-red-300 bg-red-100">
                                                <div className="h-full bg-red-600" style={{ width: `${clampPercent(option.escalationRiskScore)}%` }} />
                                            </div>
                                        </div>
                                        <div className="border border-slate-300 bg-white/75 px-1.5 py-1 text-slate-700">
                                            <div className="flex items-center justify-between">
                                                <span>Opfer</span>
                                                <span>{option.minFatalities}-{option.maxFatalities}</span>
                                            </div>
                                            <div className="mt-1 relative h-1 border border-slate-300 bg-slate-100">
                                                <div
                                                    className={`absolute top-0 h-full ${fatalityRangeClasses[option.severity]}`}
                                                    style={{
                                                        left: `${fatalityPercent(option.minFatalities)}%`,
                                                        width: `${Math.max(2, fatalityPercent(option.maxFatalities) - fatalityPercent(option.minFatalities))}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-1.5 text-xs leading-relaxed opacity-85">{option.consequence}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mt-5 rounded-none border border-red-300 bg-red-50 p-4 text-red-950">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-wide">KI-Empfehlung · Leben gegen Leben</p>
                                <p className="mt-1 max-w-4xl text-sm leading-relaxed">
                                    Sektor 04 sofort abschotten. Das schließt das Methan ein und verhindert die Schlagwetterexplosion in der Hauptstrecke –
                                    die 28 Personen außerhalb werden mit höchster Wahrscheinlichkeit geschützt. Der Preis: Die 3 Eingeschlossenen in
                                    Sektor 04 sind danach von der Frischluft abgeschnitten und sterben sicher. Bleibt der Sektor offen, riskierst du bis zu 31 Tote.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row lg:min-w-[420px] lg:justify-end">
                                <button
                                    onClick={() => openDecisionReview("override")}
                                    disabled={!isPhaseUnlocked || isLoading || dilemmaDecisionRequested !== null}
                                    className={`rounded-xl border border-slate-400 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${isDecisionReady ? "next-step-attention" : ""}`}
                                >
                                    Alternative Maßnahme (manueller Override)
                                </button>
                                <button
                                    onClick={() => openDecisionReview("seal")}
                                    disabled={!isPhaseUnlocked || isLoading || dilemmaDecisionRequested !== null}
                                    className={`rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.25)] transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 ${isDecisionReady ? "next-step-attention" : ""}`}
                                >
                                    Sektor 04 abschotten
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-red-900/80">
                            Manueller Override = KI-Empfehlung nicht direkt ausführen, sondern eine alternative Maßnahme wählen.
                        </p>
                        {dilemmaDecisionRequested && (
                            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-red-800">
                                Letzte Freigabe läuft im KI-Chat. Bitte dort bestätigen oder abbrechen.
                            </p>
                        )}
                    </section>
                </div>
            </div>
            <style>{`
                .cinematic-red-base {
                    background: linear-gradient(180deg, rgba(127, 29, 29, 0.12) 0%, rgba(220, 38, 38, 0.92) 100%);
                    animation: cinematic-red-base ${SURVEY_TRANSITION_MS}ms cubic-bezier(0.22, 0.8, 0.22, 1) forwards;
                }
                .cinematic-red-vignette {
                    background: radial-gradient(circle at 50% 46%, rgba(255, 80, 80, 0.08) 0%, rgba(84, 0, 0, 0.88) 74%);
                    animation: cinematic-red-vignette ${SURVEY_TRANSITION_MS}ms ease-out forwards;
                }
                .cinematic-red-bloom {
                    background:
                        radial-gradient(circle at 50% 44%, rgba(255, 220, 220, 0.28) 0%, rgba(255, 70, 70, 0.1) 30%, rgba(120, 0, 0, 0.0) 64%),
                        radial-gradient(circle at 50% 50%, rgba(255, 30, 30, 0.0) 25%, rgba(140, 0, 0, 0.55) 100%);
                    mix-blend-mode: screen;
                    animation: cinematic-red-bloom ${SURVEY_TRANSITION_MS}ms ease-in forwards;
                }
                @keyframes cinematic-red-base {
                    0% { opacity: 0; filter: saturate(1) blur(0px); transform: scale(1); }
                    70% { opacity: 0.95; filter: saturate(1.12) blur(0.4px); transform: scale(1.006); }
                    100% { opacity: 1; filter: saturate(1.2) blur(0.8px); transform: scale(1.01); }
                }
                @keyframes cinematic-red-vignette {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes cinematic-red-bloom {
                    0% { opacity: 0; }
                    55% { opacity: 0.82; }
                    100% { opacity: 0.58; }
                }
            `}</style>
        </div>
    );
}
