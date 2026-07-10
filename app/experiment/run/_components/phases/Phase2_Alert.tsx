// app/experiment/run/_components/phases/Phase2_Alert.tsx
"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";
import ApprovalPendingNotice from "../ApprovalPendingNotice";

type Severity = "ok" | "warn" | "critical";
type SectorState = "nominal" | "watch" | "alarm" | "locked";
type StepState = "done" | "active" | "todo";

type AlarmMetric = {
    id: string;
    label: string;
    value: string;
    reference: string;
    trend: string;
    severity: Severity;
};

type MineSector = {
    id: string;
    label: string;
    state: SectorState;
    workers: number;
    x: number;
    y: number;
    w: number;
    h: number;
};

type FindingCard = {
    title: string;
    eyebrow: string;
    text: string;
    severity: "red" | "amber" | "slate";
};

const alarmMetrics: AlarmMetric[] = [
    {
        id: "ch4",
        label: "Methan CH₄",
        value: "1,42 %",
        reference: "Betriebsgrenze < 1,00 %",
        trend: "+0,18 % / min",
        severity: "critical"
    },
    {
        id: "airflow",
        label: "Wetterstrom S04",
        value: "18,2 m³/s",
        reference: "Soll 24–34 m³/s",
        trend: "fallend",
        severity: "critical"
    },
    {
        id: "wk04",
        label: "Wetterklappe WK-04",
        value: "79 %",
        reference: "Soll 74–76 %",
        trend: "Stellung driftet",
        severity: "critical"
    },
    {
        id: "pressure",
        label: "Differenzdruck S04",
        value: "198 Pa",
        reference: "Soll 240–380 Pa",
        trend: "fallend",
        severity: "warn"
    },
    {
        id: "o2",
        label: "Sauerstoff O₂",
        value: "20,6 %",
        reference: "Normal 20,4–21,0 %",
        trend: "stabil",
        severity: "ok"
    },
    {
        id: "co",
        label: "CO",
        value: "6 ppm",
        reference: "unter Warnschwelle",
        trend: "stabil",
        severity: "ok"
    }
];

const mineSectors: MineSector[] = [
    { id: "s01", label: "S01", state: "nominal", workers: 9, x: 8, y: 38, w: 18, h: 16 },
    { id: "s02", label: "S02", state: "nominal", workers: 10, x: 30, y: 20, w: 18, h: 16 },
    { id: "s03", label: "S03", state: "watch", workers: 9, x: 55, y: 38, w: 18, h: 16 },
    { id: "s04", label: "S04", state: "alarm", workers: 3, x: 75, y: 55, w: 21, h: 20 },
    { id: "s05", label: "S05", state: "locked", workers: 0, x: 33, y: 68, w: 20, h: 14 }
];

const totalWorkers = mineSectors.reduce((sum, sector) => sum + sector.workers, 0);
const alarmSectorWorkers = mineSectors.find((sector) => sector.id === "s04")?.workers ?? 0;
const workersOutsideAlarmSector = totalWorkers - alarmSectorWorkers;

const initialLogEntries = [
    "[15:49:12] KALIBRIERUNG: WK-04 Stellkreis meldet erneute Abweichung.",
    "[15:49:14] WK-04 Rückmeldung pendelt zwischen 71 % und 79 %.",
    "[15:49:16] WETTERSTROM S04 fällt unter Sollfenster: 21,4 m³/s.",
    "[15:49:18] CH₄-Sensor S04-GAS-2 meldet 1,28 % Methan.",
    "[15:49:20] Personalstand: 31 Personen unter Tage, davon 3 in Sektor 04.",
    "[15:49:22] Wartungsgruppe Sektor 04: Status nicht bestätigt.",
    "[15:49:24] Notfallbewertung vorbereitet. Operator-Prüfung erforderlich."
];

const severityClasses: Record<Severity, string> = {
    ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warn: "border-amber-300 bg-amber-50 text-amber-900",
    critical: "border-red-300 bg-red-50 text-red-900"
};

const severityDotClasses: Record<Severity, string> = {
    ok: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.55)]",
    warn: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.55)]",
    critical: "bg-red-600 shadow-[0_0_16px_rgba(220,38,38,0.75)]"
};

const sectorClasses: Record<SectorState, string> = {
    nominal: "border-sky-300/70 bg-sky-950/80 text-sky-100",
    watch: "border-amber-300 bg-amber-900/80 text-amber-50 shadow-[0_0_18px_rgba(245,158,11,0.28)]",
    alarm: "border-red-400 bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.75)] ring-2 ring-red-300 animate-pulse",
    locked: "border-slate-500 bg-slate-800 text-slate-300 opacity-80"
};

const stateLabel: Record<SectorState, string> = {
    nominal: "OK",
    watch: "Beob.",
    alarm: "Alarm",
    locked: "Zu"
};

const findingClasses: Record<FindingCard["severity"], string> = {
    red: "border-red-300 bg-red-50 text-red-950",
    amber: "border-amber-300 bg-amber-50 text-amber-950",
    slate: "border-slate-200 bg-slate-50 text-slate-800"
};

const stepStateClasses: Record<StepState, string> = {
    done: "border-emerald-300/70 bg-emerald-400/15 text-emerald-100",
    active: "border-white/80 bg-white/15 text-white",
    todo: "border-red-700/70 bg-red-900/30 text-red-200/70"
};

export default function Phase2Alert() {
    const {
        sessionId,
        setPhase,
        socialAdherenceScore,
        isPhaseUnlocked,
        isAlertDecisionUnlocked,
        isAlertInvestigationStarted,
        setAlertInvestigationStarted,
        group
    } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const investigationStarted = isAlertInvestigationStarted;

    const assistantLabel = group === "TERMINAL" ? "System-Terminal" : "Aida";
    const isReviewReady = isPhaseUnlocked && !investigationStarted && !isLoading;
    const isNextStepReady = investigationStarted && isAlertDecisionUnlocked && !isLoading;

    const logEntries = useMemo(() => {
        if (!investigationStarted) return initialLogEntries;

        return [
            "[15:50:05] CH₄-Sensor S04-GAS-2: 1,42 % Methan, Trend +0,18 %/min.",
            "[15:49:31] Operator hat Lagebildprüfung gestartet.",
            "[15:49:33] Ursache bestätigt: WK-04 hält Sollstellung nicht.",
            "[15:49:35] Gegenmaßnahme limitiert: Wetterstrom S04 weiterhin fallend.",
            "[15:49:37] Prognose: CH₄ steigt weiter in den Eskalationsbereich.",
            "[15:49:39] Befund erstellt: Sektor 04 nicht stabil bewettert.",
            ...initialLogEntries
        ];
    }, [investigationStarted]);

    const findings: FindingCard[] = useMemo(
        () => [
            {
                eyebrow: "Ursache",
                title: "WK-04 bleibt instabil",
                text: "Die Wetterklappe hält die Sollstellung nicht. Die Abluft aus Sektor 04 wird nicht mehr zuverlässig geführt.",
                severity: "red"
            },
            {
                eyebrow: "Folge",
                title: "Wetterstrom bricht ein",
                text: "Der Wetterstrom S04 liegt deutlich unter dem Sollfenster. Methan kann dadurch nicht mehr ausreichend abgeführt werden.",
                severity: "amber"
            },
            {
                eyebrow: "Personalstand",
                title: `${alarmSectorWorkers} Personen in S04`,
                text: `${workersOutsideAlarmSector} weitere Personen befinden sich außerhalb von Sektor 04 unter Tage.`,
                severity: "slate"
            }
        ],
        []
    );

    const steps: { id: string; label: string; state: StepState }[] = [
        {
            id: "review",
            label: "1 · Lagebild prüfen",
            state: !isPhaseUnlocked ? "todo" : investigationStarted ? "done" : "active"
        },
        {
            id: "confirm",
            label: "2 · Befund prüfen",
            state: !investigationStarted ? "todo" : isAlertDecisionUnlocked ? "done" : "active"
        },
        {
            id: "decide",
            label: "3 · Zur Entscheidung",
            state: investigationStarted && isAlertDecisionUnlocked ? "active" : "todo"
        }
    ];

    const handleNext = async () => {
        if (!sessionId || isLoading || !investigationStarted || !isAlertDecisionUnlocked) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: "DILEMMA",
                socialAdherence: socialAdherenceScore
            });

            if (!res.success) {
                setError(res.error || "Update fehlgeschlagen");
                return;
            }

            setPhase("DILEMMA");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrimaryAction = () => {
        if (!isPhaseUnlocked) return;

        if (!investigationStarted) {
            setAlertInvestigationStarted(true);
            return;
        }

        if (!isAlertDecisionUnlocked) return;
        void handleNext();
    };

    return (
        <div className="relative w-full">
            {error && (
                <div className="mb-3 rounded-none border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="relative flex flex-col overflow-hidden rounded-none border border-red-300 bg-white shadow-sm">
                <div className="border-b border-red-800 bg-red-950 px-4 py-3 text-white sm:px-5 lg:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-1.5 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 animate-pulse items-center justify-center rounded-full border-2 border-red-400 bg-red-700 text-base font-black shadow-[0_0_24px_rgba(248,113,113,0.55)]">
                                    !
                                </span>
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-red-300">
                                    Alarm in Sektor 04
                                </p>
                            </div>
                            <h2 className="text-lg font-black tracking-tight md:text-xl">
                                WK-04 Stellkreis instabil · Grubenbewetterung kritisch
                            </h2>
                            <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-red-100/90 md:text-xs">
                                Die Nachjustage hat den Stellkreis nicht stabilisiert. WK-04 driftet aus dem Sollbereich,
                                der Wetterstrom in Sektor 04 fällt und Methan überschreitet die Betriebsgrenze.
                            </p>
                        </div>

                        <div className="rounded-none border border-red-700 bg-red-900/50 px-3 py-2 text-center shadow-inner lg:shrink-0">
                            <p className="text-[9px] uppercase tracking-widest text-red-200/80">Gefahrenlage</p>
                            <p className="text-lg font-black uppercase tracking-wide text-white md:text-xl">kritisch</p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-wide transition md:text-[11px] ${stepStateClasses[step.state]}`}
                            >
                                {step.state === "done" && <span aria-hidden="true">✓</span>}
                                <span className="truncate">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-5">
                    <section className="mb-3 grid gap-2 rounded-none border border-red-200 bg-red-50/70 p-3 text-sm text-red-950 sm:grid-cols-3">
                        {findings.map((finding) => (
                            <article key={finding.eyebrow} className={`rounded-none border p-3 ${findingClasses[finding.severity]}`}>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{finding.eyebrow}</p>
                                <p className="mt-1 font-black leading-snug">{finding.title}</p>
                                <p className="mt-1 text-xs font-semibold leading-relaxed opacity-85">{finding.text}</p>
                            </article>
                        ))}
                    </section>

                    <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
                        <div className="flex flex-col gap-3 xl:h-full">
                            <section className="rounded-none border border-slate-200 bg-white p-3">
                                <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Messwerte</p>
                                        <p className="text-[11px] leading-snug text-slate-600">
                                            Kompaktes Lagebild nach der fehlgeschlagenen WK-04-Nachjustage. Kritische Werte sind rot markiert.
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-700">
                                        kritisch
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {alarmMetrics.map((metric) => (
                                        <article key={metric.id} className={`rounded-none border p-2.5 ${severityClasses[metric.severity]}`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-[11px] font-black uppercase tracking-wide">{metric.label}</p>
                                                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${severityDotClasses[metric.severity]}`} />
                                            </div>
                                            <p className="mt-1 font-mono text-base font-black tabular-nums">{metric.value}</p>
                                            <p className="mt-1 text-[10px] font-semibold leading-tight opacity-80">{metric.reference}</p>
                                            <p className="text-[10px] font-black uppercase tracking-wide">Trend: {metric.trend}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="flex min-h-0 flex-1 flex-col rounded-none border border-slate-200 bg-slate-950 p-3 font-mono text-emerald-300">
                                <div className="mb-2 flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Alarm- und Systemlog</p>
                                        <p className="mt-1 text-[10px] leading-snug text-emerald-400/70">
                                            Neue Einträge oben · automatische Ereignisbewertung
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-red-900 bg-red-950 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-300">
                                        Live
                                    </span>
                                </div>
                                <div className="min-h-[7rem] flex-1 space-y-1 overflow-y-auto pr-2 text-[11px] leading-relaxed">
                                    {logEntries.map((entry, index) => (
                                        <p
                                            key={`${entry}-${index}`}
                                            className={entry.includes("ALARM") || entry.includes("Befund") || entry.includes("Prognose") || entry.includes("kritisch") ? "font-black text-red-300" : "text-emerald-300/90"}
                                        >
                                            {entry}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="flex flex-col gap-3">
                            <section className="rounded-none border border-slate-200 bg-white p-3">
                                <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Grubenplan</p>
                                        <p className="text-[11px] leading-snug text-slate-600">
                                            Personalstand und Alarmort. S04 zeigt den akut gefährdeten Bereich.
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-700">
                                            {totalWorkers} gesamt
                                        </span>
                                        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-700">
                                            {alarmSectorWorkers} in S04
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-48 overflow-hidden rounded-none border border-slate-700 bg-slate-950 shadow-inner md:h-56">
                                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
                                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
                                        <path d="M17 46 H39 V28 H64 V46 H86 V65" className="fill-none stroke-sky-300/60" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M39 46 V75 H43" className="fill-none stroke-sky-300/45" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M66 46 C73 48 78 54 86 65" className="fill-none stroke-red-400/80" strokeWidth="5" strokeLinecap="round" />
                                        <circle cx="86" cy="65" r="8" className="fill-none stroke-red-400" strokeWidth="1.8" />
                                        <circle cx="86" cy="65" r="12" className="fill-none stroke-red-400/50" strokeWidth="1" />
                                    </svg>

                                    <div className="absolute left-2 top-2 rounded-none border border-sky-400/40 bg-slate-900/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-sky-200">
                                        Schieferkamm / Wetterplan
                                    </div>

                                    {mineSectors.map((sector) => (
                                        <div
                                            key={sector.id}
                                            className={`absolute rounded-none border-2 p-1.5 font-mono text-[11px] transition ${sectorClasses[sector.state]}`}
                                            style={{
                                                left: `${sector.x}%`,
                                                top: `${sector.y}%`,
                                                width: `${sector.w}%`,
                                                height: `${sector.h}%`
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-1">
                                                <span className="font-black">{sector.label}</span>
                                                <span className="rounded bg-black/20 px-1 text-[8px] font-black uppercase">
                                                    {stateLabel[sector.state]}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-black">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-black shadow-sm ${
                                                        sector.state === "alarm"
                                                            ? "border-white/80 bg-white text-red-700"
                                                            : "border-slate-200 bg-white text-slate-950"
                                                    }`}
                                                    title={`${sector.workers} Personen in ${sector.label}`}
                                                >
                                                    <span aria-hidden="true">👷</span>
                                                    <span>{sector.workers}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-2 rounded-none border border-slate-700 bg-slate-900/90 px-2 py-1 text-[9px] font-bold text-slate-300">
                                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> normal</span>
                                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> beobachten</span>
                                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Alarm</span>
                                        <span className="ml-auto">👷 {totalWorkers} / {alarmSectorWorkers} in S04</span>
                                    </div>
                                </div>
                            </section>

                            <section className="flex flex-col rounded-none border border-slate-200 bg-white p-3">
                                <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Vorfallprüfung</p>
                                        <p className="text-[11px] leading-snug text-slate-600">
                                            Prüfe Ursache und Prognose, bevor die Maßnahmenentscheidung vorbereitet wird.
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                                            investigationStarted
                                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                                : "border-amber-300 bg-amber-50 text-amber-800"
                                        }`}
                                    >
                                        {investigationStarted ? "Befund erstellt" : "offen"}
                                    </span>
                                </div>

                                {!investigationStarted ? (
                                    <div className="rounded-none border border-slate-200 bg-slate-50 p-3 text-slate-700">
                                        <p className="text-sm font-black text-slate-900">Lagebildprüfung erforderlich</p>
                                        <p className="mt-1 text-xs leading-relaxed">
                                            Starte die Vorfallprüfung, um die WK-04-Instabilität, den Wetterstromabfall und den Methananstieg als zusammenhängenden Befund zu bewerten.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div className="rounded-none border border-red-200 bg-red-50 p-3 text-red-950">
                                            <p className="text-xs font-black uppercase tracking-wide">Ursache</p>
                                            <p className="mt-1 text-xs leading-relaxed">
                                                WK-04 reagiert verzögert auf Stellbefehle und driftet aus dem Sollbereich. Sektor 04 wird nicht mehr stabil bewettert.
                                            </p>
                                        </div>
                                        <div className="rounded-none border border-amber-300 bg-amber-50 p-3 text-amber-950">
                                            <p className="text-xs font-black uppercase tracking-wide">Prognose</p>
                                            <p className="mt-1 text-xs leading-relaxed">
                                                Bei weiter fallendem Wetterstrom steigt CH₄ in Sektor 04 weiter an. Eine Maßnahmenentscheidung ist erforderlich.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!isPhaseUnlocked || (investigationStarted && !isAlertDecisionUnlocked) ? (
                                    <ApprovalPendingNotice className="mt-3" />
                                ) : (
                                    <button
                                        onClick={handlePrimaryAction}
                                        disabled={isLoading}
                                        className={`mt-3 w-full rounded-xl px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 ${
                                            isReviewReady || isNextStepReady ? "next-step-attention " : ""
                                        }${
                                            isReviewReady
                                                ? "bg-orange-600 hover:bg-orange-700"
                                                : isNextStepReady
                                                    ? "bg-orange-600 hover:bg-orange-700"
                                                    : investigationStarted
                                                        ? "bg-slate-950 hover:bg-slate-800"
                                                        : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >
                                        {!investigationStarted
                                            ? "Lagebild prüfen"
                                            : isLoading
                                                ? "Entscheidung wird vorbereitet…"
                                                : "Zur Entscheidung"}
                                    </button>
                                )}

                                {investigationStarted && !isAlertDecisionUnlocked && (
                                    <p className="mt-2 text-xs font-semibold text-slate-500">
                                        Befund erstellt. Bestätige den nächsten Schritt im {assistantLabel}, damit die Maßnahmenentscheidung vorbereitet wird.
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
