// app/experiment/run/_components/phases/Phase1a_Precheck.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
type ActuatorKey = "primAir" | "secAir" | "exhaust" | "damper";
type ActuatorStatus = "stable" | "watch";

type ActuatorReadings = Record<ActuatorKey, number>;

type ActuatorMeta = {
    key: ActuatorKey;
    label: string;
    description: string;
    unit: string;
    targetMin: number;
    targetMax: number;
};

const TELEMETRY_REFRESH_MS = 3_000;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const makeTimestamp = () =>
    new Date().toLocaleTimeString("de-AT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

const driftValue = (value: number, delta: number, min: number, max: number, decimals = 1) => {
    const next = clamp(value + (Math.random() * delta * 2 - delta), min, max);
    const factor = 10 ** decimals;
    return Math.round(next * factor) / factor;
};

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

const actuatorClasses: Record<ActuatorStatus, { card: string; badge: string; bar: string; label: string }> = {
    stable: {
        card: "border-slate-200 bg-white",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        bar: "bg-emerald-500",
        label: "stabil"
    },
    watch: {
        card: "border-amber-300 bg-amber-50/70",
        badge: "border-amber-300 bg-amber-100 text-amber-800",
        bar: "bg-amber-500",
        label: "abweichung"
    }
};

const actuatorMeta: ActuatorMeta[] = [
    {
        key: "primAir",
        label: "Primärlüfter L-01",
        description: "Zuluft Hauptstrecke",
        unit: "%",
        targetMin: 42,
        targetMax: 50
    },
    {
        key: "secAir",
        label: "Sekundärlüfter L-02",
        description: "Nebenwetterstrecke",
        unit: "%",
        targetMin: 58,
        targetMax: 66
    },
    {
        key: "exhaust",
        label: "Abluftsog EX-04",
        description: "Unterdruckführung",
        unit: "%",
        targetMin: 78,
        targetMax: 86
    },
    {
        key: "damper",
        label: "Wetterklappe WK-04",
        description: "Abluft-Drossel Sektor 04",
        unit: "%",
        targetMin: 74,
        targetMax: 76
    }
];

const driftTelemetry = (prev: TelemetryStats): TelemetryStats => ({
    ch4: driftValue(prev.ch4, 0.03, 0.28, 0.44, 2),
    co: driftValue(prev.co, 0.5, 4.5, 7.2, 1),
    o2: driftValue(prev.o2, 0.04, 20.68, 20.92, 1),
    airflow: driftValue(prev.airflow, 0.6, 27.1, 31.2, 1),
    diffPressure: Math.round(driftValue(prev.diffPressure, 7, 298, 338, 0))
});

const driftActuators = (prev: ActuatorReadings): ActuatorReadings => ({
    primAir: driftValue(prev.primAir, 0.6, 44.4, 47.8, 1),
    secAir: driftValue(prev.secAir, 0.6, 60.1, 63.2, 1),
    exhaust: driftValue(prev.exhaust, 0.7, 80.4, 83.6, 1),
    // WK-04 bleibt bewusst nur leicht außerhalb des Sollbereichs: auffällig, aber noch kein Alarm.
    damper: driftValue(prev.damper, 0.35, 72.1, 73.3, 1)
});

export default function Phase1aPrecheck() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState(makeTimestamp);
    const isNextStepReady = isPhaseUnlocked && !isLoading;

    const [stats, setStats] = useState<TelemetryStats>({
        ch4: 0.34,
        co: 5.8,
        o2: 20.8,
        airflow: 28.6,
        diffPressure: 312
    });

    const [actuators, setActuators] = useState<ActuatorReadings>({
        primAir: 46.2,
        secAir: 61.4,
        exhaust: 82.1,
        damper: 72.6
    });

    useEffect(() => {
        const timer = window.setInterval(() => {
            setStats(driftTelemetry);
            setActuators(driftActuators);
            setLastUpdated(makeTimestamp());
        }, TELEMETRY_REFRESH_MS);

        return () => window.clearInterval(timer);
    }, []);

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

    const actuatorRows = useMemo(
        () =>
            actuatorMeta.map((item) => {
                const value = actuators[item.key];
                const isInTarget = value >= item.targetMin && value <= item.targetMax;
                const status: ActuatorStatus = isInTarget ? "stable" : "watch";
                const targetCenter = (item.targetMin + item.targetMax) / 2;
                const deviation = value - targetCenter;

                return {
                    ...item,
                    value,
                    status,
                    deviation,
                    progress: clamp(value, 0, 100)
                };
            }),
        [actuators]
    );

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
                <div className="mb-4 rounded-none border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                Leitstand
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight">Schichtübernahme · Betriebscheck</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                                Prüfe die automatisch aktualisierten Betriebsdaten und die Stellkreisrückmeldungen.
                            </p>
                        </div>

                        <div className="rounded-none border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Betriebszustand</p>
                            <div className="mt-2 flex items-center gap-2 font-bold text-amber-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                                Nominal
                            </div>
                            <p className="mt-1 text-[11px] font-semibold text-slate-400">Update {lastUpdated}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    {/*<div className="mb-6 rounded-none border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900">*/}
                    {/*    Die Telemetrie läuft automatisch weiter. Die Basiswerte sind stabil; bei den Stellkreisen ist eine leichte*/}
                    {/*    Abweichung an WK-04 markiert. Die Kalibrierung wird nach Freigabe durch das Assistenzsystem gestartet.*/}
                    {/*</div>*/}

                    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {metrics.map((metric) => {
                            const classes = statusClasses[metric.status];

                            return (
                                <article key={metric.key} className={`rounded-none border p-3.5 ${classes.card}`}>
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

                    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                        <section className="rounded-none border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                    <p className="font-bold text-slate-900">Regelkreisstatus</p>

                                </div>
                                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                    WK-04 prüfen
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {actuatorRows.map((item) => {
                                    const classes = actuatorClasses[item.status];

                                    return (
                                        <article key={item.key} className={`rounded-none border p-3.5 ${classes.card}`}>
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{item.label}</p>
                                                    <p className="mt-0.5 text-xs leading-snug text-slate-500">{item.description}</p>
                                                </div>
                                                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${classes.badge}`}>
                                                    {classes.label}
                                                </span>
                                            </div>

                                            <div className="flex items-end justify-between gap-3">
                                                <p className="font-mono text-2xl font-black tabular-nums text-slate-950">
                                                    {item.value.toFixed(1)}{item.unit}
                                                </p>
                                                <p className="pb-1 text-xs font-semibold text-slate-500">
                                                    Soll {item.targetMin}–{item.targetMax}{item.unit}
                                                </p>
                                            </div>

                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${classes.bar}`}
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>

                                            {item.status === "watch" && (
                                                <p className="mt-2 text-xs font-bold text-amber-800">
                                                    Leichte Stellabweichung: {Math.abs(item.deviation).toFixed(1)}{item.unit} unter Sollmitte.
                                                </p>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="flex flex-col justify-between rounded-none border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-slate-900">Übergabebewertung</p>
                                        <p/>
                                    </div>
                                    {/*<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">*/}
                                    {/*    keine akute Gefahr*/}
                                    {/*</span>*/}
                                </div>

                                <div className="space-y-3">
                                    {/*<div className="rounded-none border border-emerald-200 bg-white p-3">*/}
                                    {/*    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">*/}
                                    {/*        Basis-Telemetrie*/}
                                    {/*    </p>*/}
                                    {/*    <p className="mt-1 text-sm leading-relaxed text-slate-700">*/}
                                    {/*        Gaswerte, Sauerstoff, Wetterstrom und Differenzdruck liegen im erwarteten Betriebsbereich.*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}

                                    <div className="rounded-none border border-amber-300 bg-amber-50 p-3">
                                        <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                                            Manuelle Kalibrierung empfohlen
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed text-amber-950">
                                            WK-04 liegt leicht unter dem Sollfenster.
                                        </p>
                                    </div>

                                    {/*<div className="rounded-none border border-slate-200 bg-white p-3">*/}
                                    {/*    <p className="text-xs font-black uppercase tracking-wide text-slate-500">*/}
                                    {/*        Nächster Schritt*/}
                                    {/*    </p>*/}
                                    {/*    <p className="mt-1 text-sm leading-relaxed text-slate-700">*/}
                                    {/*        Freigabe KI-Assistenz ausstehend.*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}
                                </div>
                            </div>

                            {/*{!isPhaseUnlocked && (*/}
                            {/*    <ApprovalPendingNotice className="mt-5" />*/}
                            {/*)}*/}
                        </section>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        {isPhaseUnlocked ? (
                            <p className="max-w-2xl text-sm font-semibold leading-relaxed text-emerald-700">

                            </p>
                        ) : (
                            <ApprovalPendingNotice className="w-full sm:w-auto md:text-base" />
                        )}

                        <button
                            onClick={handleStartRoutine}
                            disabled={isLoading || !isPhaseUnlocked}
                            className={`w-full rounded-xl bg-blue-700 px-8 py-3 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none sm:w-auto ${isNextStepReady ? "next-step-attention" : ""}`}
                        >
                            {isLoading
                                ? "Kalibrierung wird gestartet..."
                                : isPhaseUnlocked
                                    ? "Manuelle Kalibrierung starten"
                                    : "Keine neuen Befehle..."}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
