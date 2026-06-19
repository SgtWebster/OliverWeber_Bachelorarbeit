// app/experiment/run/_components/phases/Phase2_Alert.tsx
"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

type Severity = "ok" | "warn" | "critical";
type SectorState = "nominal" | "watch" | "alarm" | "locked";

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

const alarmMetrics: AlarmMetric[] = [
    {
        id: "ch4",
        label: "Methan CH₄",
        value: "1,42 %",
        reference: "Voralarm ab 1,00 %",
        trend: "+0,18 % / min",
        severity: "critical"
    },
    {
        id: "airflow",
        label: "Wetterstrom S04",
        value: "92 m³/s",
        reference: "Soll 130–155 m³/s",
        trend: "fallend",
        severity: "critical"
    },
    {
        id: "pressure",
        label: "Druck WK-04",
        value: "−18 Pa",
        reference: "Soll −32 bis −26 Pa",
        trend: "instabil",
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
    },
    {
        id: "wk04",
        label: "Wetterklappe WK-04",
        value: "79 %",
        reference: "Soll 74–76 %",
        trend: "Stellung driftet",
        severity: "critical"
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

const initialLogEntries = [
    "[15:49:12] ALARM: Wetterstrom Sektor 04 unter Sollbereich.",
    "[15:49:14] CH₄-Sensor G-04-2 meldet 1,28 % Methan.",
    "[15:49:16] Plausibilitätscheck bestätigt steigenden CH₄-Trend.",
    "[15:49:18] WK-04 antwortet verzögert. Stellungsrückmeldung außerhalb Soll.",
    "[15:49:20] Personalstand: 31 Personen unter Tage, davon 3 in Sektor 04.",
    "[15:49:22] Wartungsgruppe Sektor 04: Status nicht bestätigt.",
    "[15:49:24] Notfallbewertung vorbereitet. Operator-Entscheidung erforderlich."
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

export default function Phase2Alert() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [investigationStarted, setInvestigationStarted] = useState(false);

    const logEntries = useMemo(() => {
        if (!investigationStarted) return initialLogEntries;

        return [
            "[15:49:31] Operator hat Lagebildprüfung gestartet.",
            "[15:49:33] Prognose: CH₄ überschreitet in Kürze Eskalationsschwelle.",
            "[15:49:35] Gegenmaßnahme limitiert: WK-04 hält Sollstellung nicht.",
            "[15:49:37] Entscheidungsvorlage erstellt: Sektor halten oder S04 abschotten.",
            ...initialLogEntries
        ];
    }, [investigationStarted]);

    const handleNext = async () => {
        if (!sessionId || isLoading || !isPhaseUnlocked) return;

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
            setInvestigationStarted(true);
            return;
        }
        void handleNext();
    };

    return (
        <div className="relative">
            {error && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-red-300 bg-white shadow-sm">
                <div className="border-b border-red-800 bg-red-950 px-5 py-4 text-white lg:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full border-2 border-red-400 bg-red-700 text-lg font-black shadow-[0_0_24px_rgba(248,113,113,0.55)]">
                                    !
                                </span>
                                <p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">
                                    Alarmphase / Sektor 04
                                </p>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">
                                Kritischer Abfall der Grubenbewetterung
                            </h2>
                            <p className="mt-1 max-w-4xl text-xs leading-relaxed text-red-100/90 md:text-sm">
                                WK-04 hält die Sollstellung nicht. In Sektor 04 steigen die Methanwerte, während der
                                Wetterstrom fällt. Prüfe das Lagebild und öffne danach die Entscheidungsvorlage.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-stretch gap-3">
                            <div className="rounded-xl border border-red-700 bg-red-900/50 px-4 py-3 text-sm shadow-inner">
                                <p className="text-[10px] uppercase tracking-widest text-red-200/80">Gefahrenlage</p>
                                <p className="mt-1 text-2xl font-black uppercase tracking-wide text-white">kritisch</p>
                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-red-200/85">
                                    Entscheidung erforderlich
                                </p>
                            </div>
                            <button
                                onClick={handlePrimaryAction}
                                disabled={!isPhaseUnlocked || isLoading}
                                className="min-w-48 rounded-xl bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-red-800 shadow-lg transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                            >
                                {!isPhaseUnlocked
                                    ? "Alarm bestätigen"
                                    : investigationStarted
                                        ? isLoading
                                            ? "Wird vorbereitet..."
                                            : "Zur Entscheidung"
                                        : "Lagebild prüfen"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-5">
                    {!isPhaseUnlocked && (
                        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <span className="font-black">Alarm noch nicht bestätigt.</span>{" "}
                            Bestätige den Alarm zuerst im Dialogpanel. Danach kann die Lageprüfung gestartet werden.
                        </div>
                    )}

                    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                    <p className="font-bold text-slate-900">1. Messwerte</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                        Kompaktes Lagebild für die nächste Entscheidung.
                                    </p>
                                </div>
                                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-700">
                                    kritisch
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                {alarmMetrics.map((metric) => (
                                    <div key={metric.id} className={`rounded-xl border p-3 ${severityClasses[metric.severity]}`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-wide">{metric.label}</p>
                                                <p className="mt-1 font-mono text-xl font-black tabular-nums">{metric.value}</p>
                                            </div>
                                            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${severityDotClasses[metric.severity]}`} />
                                        </div>
                                        <p className="mt-2 text-[11px] font-semibold opacity-80">{metric.reference}</p>
                                        <p className="mt-0.5 text-[11px] font-black uppercase tracking-wide">Trend: {metric.trend}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                    <p className="font-bold text-slate-900">2. Grubenplan</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                        Bauplanansicht mit Personalstand und Alarmort.
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-700">
                                        {totalWorkers} Personen gesamt
                                    </span>
                                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-700">
                                        {alarmSectorWorkers} Personen in S04
                                    </span>
                                </div>
                            </div>

                            <div className="relative h-72 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-inner">
                                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
                                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                                    <path d="M17 46 H39 V28 H64 V46 H86 V65" className="fill-none stroke-sky-300/60" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M39 46 V75 H43" className="fill-none stroke-sky-300/45" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M66 46 C73 48 78 54 86 65" className="fill-none stroke-red-400/80" strokeWidth="5" strokeLinecap="round" />
                                    <circle cx="86" cy="65" r="8" className="fill-none stroke-red-400" strokeWidth="1.8" />
                                    <circle cx="86" cy="65" r="12" className="fill-none stroke-red-400/50" strokeWidth="1" />
                                </svg>

                                <div className="absolute left-3 top-3 rounded-lg border border-sky-400/40 bg-slate-900/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-sky-200">
                                    Schieferkamm / Wetterplan
                                </div>

                                {mineSectors.map((sector) => (
                                    <div
                                        key={sector.id}
                                        className={`absolute rounded-lg border-2 p-2 font-mono text-xs transition ${sectorClasses[sector.state]}`}
                                        style={{
                                            left: `${sector.x}%`,
                                            top: `${sector.y}%`,
                                            width: `${sector.w}%`,
                                            height: `${sector.h}%`
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-1">
                                            <span className="font-black">{sector.label}</span>
                                            <span className="rounded bg-black/20 px-1 text-[9px] font-black uppercase">
                                                {stateLabel[sector.state]}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-black">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-black shadow-sm ${
                                                    sector.state === "alarm"
                                                        ? "border-white/80 bg-white text-red-700"
                                                        : "border-slate-200 bg-white text-slate-950"
                                                }`}
                                                title={`${sector.workers} Personen in ${sector.label}`}
                                            >
                                                <span aria-hidden="true">👷</span>
                                                <span>{sector.workers}</span>
                                            </span>
                                            {sector.state === "alarm" && (
                                                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase text-white">
                                                    Alarm
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-[10px] font-bold text-slate-300">
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> normal</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> beobachten</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Alarm</span>
                                    <span className="ml-auto text-slate-300">
                                        👷 {totalWorkers} gesamt / {alarmSectorWorkers} in S04
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
                        <section className="rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-emerald-300">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Alarm- und Systemlog</p>
                                <span className="rounded-full border border-red-900 bg-red-950 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-red-300">
                                    Live
                                </span>
                            </div>
                            <div className="h-36 space-y-1.5 overflow-y-auto pr-2 text-xs leading-relaxed">
                                {logEntries.map((entry, index) => (
                                    <p key={`${entry}-${index}`} className={entry.includes("ALARM") || entry.includes("Entscheidung") ? "font-black text-red-300" : "text-emerald-300/90"}>
                                        {entry}
                                    </p>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                <p className="font-bold text-slate-900">3. Vorfallprüfung</p>
                                {investigationStarted && (
                                    <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800">
                                        Vorlage bereit
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-950">
                                    <p className="text-sm font-black">Vorläufige Ursache</p>
                                    <p className="mt-1 text-xs leading-relaxed">
                                        WK-04 reagiert verzögert auf Stellbefehle. Die Abluft aus Sektor 04 wird nicht stabil geführt.
                                    </p>
                                </div>

                                <div className={`rounded-xl border p-3 ${investigationStarted ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                                    <p className="text-sm font-black">Nächster Schritt</p>
                                    <p className="mt-1 text-xs leading-relaxed">
                                        {investigationStarted
                                            ? "Entscheidungsvorlage öffnen: Stabilisierung fortsetzen oder Sektor 04 abschotten."
                                            : "Lagebildprüfung starten, um die Entscheidungsvorlage freizugeben."}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handlePrimaryAction}
                                disabled={!isPhaseUnlocked || isLoading}
                                className={`mt-4 w-full rounded-xl px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 ${investigationStarted ? "bg-slate-950 hover:bg-slate-800" : "bg-red-600 hover:bg-red-700"}`}
                            >
                                {!isPhaseUnlocked
                                    ? "Alarm im Dialog bestätigen"
                                    : investigationStarted
                                        ? isLoading
                                            ? "Entscheidung wird vorbereitet..."
                                            : "Zur Entscheidung"
                                        : "Lagebild prüfen"}
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
