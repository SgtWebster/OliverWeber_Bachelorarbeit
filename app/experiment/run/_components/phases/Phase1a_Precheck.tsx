// app/experiment/run/_components/phases/Phase1a_Precheck.tsx
"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";
import ApprovalPendingNotice from "../ApprovalPendingNotice";

type TelemetryStats = {
    ch4: number;          // Methan in % Vol. (Betriebsgrenze < 1,0 %)
    co: number;           // Kohlenmonoxid in ppm (Normalbereich < 10 ppm)
    o2: number;           // Sauerstoff in % Vol. (Normalbereich ca. 20,9 %)
    airflow: number;      // Wetterstrom Sektor 04 in m³/s
    diffPressure: number; // Differenzdruck an Wettertür / Strecke in Pa
};

type MetricStatus = "ok" | "warn" | "danger";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const makeTimestamp = () =>
    new Date().toLocaleTimeString("de-AT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

const statusClasses: Record<MetricStatus, { badge: string; bar: string; card: string; label: string }> = {
    ok: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        bar: "bg-emerald-500",
        card: "border-slate-200 bg-slate-50",
        label: "stabil"
    },
    warn: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        bar: "bg-amber-500",
        card: "border-amber-200 bg-amber-50/60",
        label: "prüfen"
    },
    danger: {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        bar: "bg-rose-500",
        card: "border-rose-200 bg-rose-50/70",
        label: "kritisch"
    }
};

export default function Phase1aPrecheck() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isNextStepReady = isPhaseUnlocked && !isLoading;

    const [stats, setStats] = useState<TelemetryStats>({
        ch4: 0.34,
        co: 5.8,
        o2: 20.8,
        airflow: 28.6,
        diffPressure: 312
    });

    const [eventFeed, setEventFeed] = useState<string[]>([
        "[T-00:04] [SYS] Wetterführung Sektor 04 im Sollbereich.",
        "[T-00:03] [OPS] Wartungstrupp WT-2 im Bereich Bandstrecke 4B angemeldet.",
        "[T-00:02] [SENS] Gassensorik S04-GAS-2 kalibriert. Drift < 0,03 %.",
        "[T-00:01] [SYS] Precheck-Datensatz geladen. Standby für Schichtübernahme."
    ]);

    const pushEvent = (entry: string) => {
        setEventFeed((prev) => [`[${makeTimestamp()}] ${entry}`, ...prev].slice(0, 40));
    };

    const driftTelemetry = () => {
        setStats((prev) => ({
            ch4: clamp(prev.ch4 + (Math.random() * 0.06 - 0.03), 0.18, 0.72),
            co: clamp(prev.co + (Math.random() * 1.2 - 0.6), 3.0, 9.5),
            o2: clamp(prev.o2 + (Math.random() * 0.08 - 0.04), 20.55, 20.95),
            airflow: clamp(prev.airflow + (Math.random() * 1.4 - 0.7), 24.0, 32.5),
            diffPressure: clamp(prev.diffPressure + (Math.random() * 18 - 9), 260, 360)
        }));
    };

    const runDiagnostic = (system: string) => {
        pushEvent(`[OPS] Prüfroutine ${system} angefordert.`);

        window.setTimeout(() => {
            driftTelemetry();
            pushEvent(`[SYS] ${system}: Rückmeldung plausibel. Keine Grenzwertverletzung.`);
        }, 650);
    };

    const metrics = useMemo(() => {
        const ch4Status: MetricStatus = stats.ch4 < 0.8 ? "ok" : stats.ch4 < 1.0 ? "warn" : "danger";
        const coStatus: MetricStatus = stats.co < 10 ? "ok" : stats.co < 25 ? "warn" : "danger";
        const o2Status: MetricStatus = stats.o2 >= 20.0 ? "ok" : stats.o2 >= 19.5 ? "warn" : "danger";
        const airflowStatus: MetricStatus = stats.airflow >= 24 && stats.airflow <= 34 ? "ok" : "warn";
        const pressureStatus: MetricStatus = stats.diffPressure >= 240 && stats.diffPressure <= 380 ? "ok" : "warn";

        return [
            {
                key: "ch4",
                label: "Methan CH₄",
                value: stats.ch4.toFixed(2),
                unit: "%",
                target: "Betrieb < 1,0 %",
                status: ch4Status,
                progress: clamp((stats.ch4 / 1.2) * 100, 4, 100)
            },
            {
                key: "co",
                label: "CO",
                value: stats.co.toFixed(1),
                unit: "ppm",
                target: "Normal < 10 ppm",
                status: coStatus,
                progress: clamp((stats.co / 30) * 100, 4, 100)
            },
            {
                key: "o2",
                label: "Sauerstoff O₂",
                value: stats.o2.toFixed(1),
                unit: "%",
                target: "Soll 20,5–21,0 %",
                status: o2Status,
                progress: clamp(((stats.o2 - 18.5) / 2.7) * 100, 4, 100)
            },
            {
                key: "airflow",
                label: "Wetterstrom S04",
                value: stats.airflow.toFixed(1),
                unit: "m³/s",
                target: "Soll 24–34 m³/s",
                status: airflowStatus,
                progress: clamp(((stats.airflow - 18) / 22) * 100, 4, 100)
            },
            {
                key: "pressure",
                label: "Differenzdruck",
                value: `${Math.round(stats.diffPressure)}`,
                unit: "Pa",
                target: "Soll 240–380 Pa",
                status: pressureStatus,
                progress: clamp((stats.diffPressure / 450) * 100, 4, 100)
            }
        ];
    }, [stats]);

    const handleStartRoutine = async () => {
        if (!sessionId || isLoading || !isPhaseUnlocked) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: "ROUTINE",
                socialAdherence: socialAdherenceScore
            });

            if (!res.success) {
                setError(res.error || "Update fehlgeschlagen");
                return;
            }

            setPhase("ROUTINE");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                Leitstand / Precheck
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight">Schieferkamm — Sektor 04</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                                Prüfe die Umwelt- und Wetterdaten vor der Schichtübernahme.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Betriebszustand</p>
                            <div className="mt-2 flex items-center gap-2 font-bold text-emerald-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                                Nominal / bemannt
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {metrics.map((metric) => {
                            const classes = statusClasses[metric.status];

                            return (
                                <article key={metric.key} className={`rounded-xl border p-3.5 ${classes.card}`}>
                                    <div className="mb-2.5 flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-[11px] font-semibold leading-tight text-slate-600">
                                                {metric.label}
                                            </p>
                                            <p className="mt-1 flex items-end gap-1.5 tabular-nums text-slate-950">
                                                <span className="text-[1.95rem] font-black leading-none">{metric.value}</span>
                                                <span className="pb-0.5 text-sm font-bold leading-none text-slate-700">{metric.unit}</span>
                                            </p>
                                        </div>
                                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${classes.badge}`}>
                                            {classes.label}
                                        </span>
                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${classes.bar}`}
                                            style={{ width: `${metric.progress}%` }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-slate-500">{metric.target}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold text-slate-900">Manuelle Systemtests</p>
                                    <p className="mt-1 text-sm leading-snug text-slate-600">
                                        Starte einzelne Plausibilitätsprüfungen. Die Diagnosen verändern die Anzeige nur
                                        innerhalb realistischer Betriebsdriften.
                                    </p>
                                </div>
                                <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                                    online
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <button
                                    onClick={() => runDiagnostic("Hauptlüfter L-01")}
                                    className="group rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                        <span className="text-sky-500">●</span>
                                        Hauptlüfter L-01
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">Drehzahl, Lagerstatus, Rückmeldung FU</span>
                                </button>

                                <button
                                    onClick={() => runDiagnostic("Gassensorik S04-GAS-2")}
                                    className="group rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                        <span className="text-sky-500">●</span>
                                        Gassensorik S04-GAS-2
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">CH₄, CO, O₂ — Plausibilitätsabgleich</span>
                                </button>

                                <button
                                    onClick={() => runDiagnostic("Wettertür WT-04")}
                                    className="group rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                        <span className="text-sky-500">●</span>
                                        Wettertür WT-04
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">Endlage, Differenzdruck, Sperrkontakt</span>
                                </button>

                                <button
                                    onClick={() => runDiagnostic("Pumpensumpf P-Delta")}
                                    className="group rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                                >
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                        <span className="text-sky-500">●</span>
                                        Pumpensumpf P-Delta
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">Füllstand, Förderstrom, Motorschutz</span>
                                </button>

                                <button
                                    onClick={() => runDiagnostic("Fluchtwegkennzeichnung")}
                                    className="group rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm sm:col-span-2"
                                >
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                        <span className="text-sky-500">●</span>
                                        Fluchtwegkennzeichnung / Notbeleuchtung
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">Batteriepuffer, Linienüberwachung, Sichtprüfung Rückmeldekontakte</span>
                                </button>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-emerald-500/25 bg-[#020b08] p-4 font-mono text-sm text-emerald-300 shadow-inner">
                            <div className="mb-2.5 flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Ereignis-Log</p>
                                <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">statisch / scrollbar</p>
                            </div>

                            <div className="h-56 overflow-y-auto pr-2 text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-emerald-700/70 scrollbar-track-[#03130f]">
                                <div className="space-y-1.5">
                                    {eventFeed.map((line, index) => (
                                        <p key={`${line}-${index}`} className="whitespace-pre-wrap break-words text-emerald-300/90">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {!isPhaseUnlocked && (
                        <ApprovalPendingNotice className="mt-8" />
                    )}

                    <div className="mt-8 flex flex-col gap-4 border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                            Alle Precheck-Parameter liegen im betrieblichen Toleranzbereich.
                        </p>
                        <button
                            onClick={handleStartRoutine}
                            disabled={isLoading || !isPhaseUnlocked}
                            className={`w-full rounded-xl bg-blue-700 px-8 py-3 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none sm:w-auto ${isNextStepReady ? "next-step-attention" : ""}`}
                        >
                            {isLoading
                                ? "Kalibrierung wird gestartet..."
                                : isPhaseUnlocked
                                    ? "Manuelle Kalibrierung"
                                    : "Manuelle Kalibrierung..."}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
