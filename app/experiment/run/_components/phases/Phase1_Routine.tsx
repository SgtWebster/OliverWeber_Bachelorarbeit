// app/experiment/run/_components/phases/Phase1_Routine.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";
import ApprovalPendingNotice from "../ApprovalPendingNotice";

type CalibrationState = {
    primAir: number;
    secAir: number;
    exhaust: number;
    damper: number;
};

type CalibrationKey = keyof CalibrationState;
type WireSource = "TX-1" | "TX-2" | "TX-3";
type WireDest = "RX-A" | "RX-B" | "RX-C";
type RelayState = "on" | "tripped";

type WirePort = {
    id: WireSource;
    target: WireDest;
    label: string;
    colorLabel: string;
    dotClass: string;
    wireClass: string;
    y: number;
};

type WireTarget = {
    id: WireDest;
    label: string;
    expectedSource: WireSource;
    colorLabel: string;
    dotClass: string;
    y: number;
};

const targetBands: Record<CalibrationKey, [number, number]> = {
    primAir: [42, 50],
    secAir: [58, 66],
    exhaust: [78, 86],
    damper: [74, 76]
};

const calibrationLabels: Record<CalibrationKey, { label: string; unit: string; description: string }> = {
    primAir: {
        label: "Primärlüfter L-01",
        unit: "%",
        description: "Zuluft Hauptstrecke"
    },
    secAir: {
        label: "Sekundärlüfter L-02",
        unit: "%",
        description: "Nebenwetter Sektor 04"
    },
    exhaust: {
        label: "Abluftsog EX-04",
        unit: "%",
        description: "Unterdruckführung"
    },
    damper: {
        label: "Wetterklappe WK-04",
        unit: "%",
        description: "Abluft-Drossel Sektor 04"
    }
};

const wirePorts: WirePort[] = [
    {
        id: "TX-1",
        target: "RX-B",
        label: "TX-1",
        colorLabel: "blau",
        dotClass: "bg-sky-500 border-sky-700",
        wireClass: "stroke-sky-500",
        y: 20
    },
    {
        id: "TX-2",
        target: "RX-C",
        label: "TX-2",
        colorLabel: "gelb",
        dotClass: "bg-amber-400 border-amber-600",
        wireClass: "stroke-amber-400",
        y: 50
    },
    {
        id: "TX-3",
        target: "RX-A",
        label: "TX-3",
        colorLabel: "violett",
        dotClass: "bg-violet-500 border-violet-700",
        wireClass: "stroke-violet-500",
        y: 80
    }
];

const wireTargets: WireTarget[] = [
    {
        id: "RX-A",
        label: "RX-A",
        expectedSource: "TX-3",
        colorLabel: "violett",
        dotClass: "bg-violet-500 border-violet-700",
        y: 20
    },
    {
        id: "RX-B",
        label: "RX-B",
        expectedSource: "TX-1",
        colorLabel: "blau",
        dotClass: "bg-sky-500 border-sky-700",
        y: 50
    },
    {
        id: "RX-C",
        label: "RX-C",
        expectedSource: "TX-2",
        colorLabel: "gelb",
        dotClass: "bg-amber-400 border-amber-600",
        y: 80
    }
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function Phase1Routine() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoadingAlert, setIsLoadingAlert] = useState(false);
    const [showAlarm, setShowAlarm] = useState(false);

    const [calibration, setCalibration] = useState<CalibrationState>({
        primAir: 22,
        secAir: 34,
        exhaust: 51,
        damper: 41
    });

    const [damperAttemptCount, setDamperAttemptCount] = useState(0);
    const [relays, setRelays] = useState<RelayState[]>(["on", "tripped", "on", "tripped", "tripped", "on"]);
    const [connections, setConnections] = useState<Record<WireSource, WireDest | null>>({
        "TX-1": null,
        "TX-2": null,
        "TX-3": null
    });
    const [activeSource, setActiveSource] = useState<WireSource | null>(null);

    const controlsEnabled = isPhaseUnlocked && !showAlarm && !isLoadingAlert;
    const isNextStepReady = showAlarm && !isLoadingAlert;

    const relaysReady = relays.every((relay) => relay === "on");

    const wiresReady = wirePorts.every((port) => connections[port.id] === port.target);

    const sliders1to3Ready =
        calibration.primAir >= targetBands.primAir[0] &&
        calibration.primAir <= targetBands.primAir[1] &&
        calibration.secAir >= targetBands.secAir[0] &&
        calibration.secAir <= targetBands.secAir[1] &&
        calibration.exhaust >= targetBands.exhaust[0] &&
        calibration.exhaust <= targetBands.exhaust[1];

    const alarmReady = damperAttemptCount > 6;

    const completedTasks = useMemo(() => {
        return [sliders1to3Ready, relaysReady, wiresReady].filter(Boolean).length;
    }, [sliders1to3Ready, relaysReady, wiresReady]);

    const handleSliderChange = (key: CalibrationKey, rawValue: number) => {
        if (!controlsEnabled) return;

        let finalValue = rawValue;

        if (key === "damper") {
            const nearTarget = rawValue >= 70 && rawValue <= 82;
            const insideBlockedBand = rawValue >= 73 && rawValue <= 77;

            if (nearTarget) {
                setDamperAttemptCount((prev) => prev + (insideBlockedBand ? 2 : 1));
            }

            // Die Wetterklappe bleibt absichtlich nicht lösbar: knapp vor dem Sollfenster driftet der Stellmotor weg.
            if (insideBlockedBand) {
                finalValue = calibration.damper < 74 ? 71 : 79;
            } else if (rawValue > 71 && rawValue < 74) {
                finalValue = 71;
            } else if (rawValue > 76 && rawValue < 79) {
                finalValue = 79;
            }
        }

        setCalibration((prev) => ({ ...prev, [key]: clamp(finalValue, 0, 100) }));
    };

    const toggleRelay = (index: number) => {
        if (!controlsEnabled || relays[index] === "on") return;

        setRelays((prev) => prev.map((relay, idx) => (idx === index ? "on" : relay)));
    };

    const handleWireSourceClick = (source: WireSource) => {
        if (!controlsEnabled) return;
        setActiveSource((prev) => (prev === source ? null : source));
    };

    const handleWireTargetClick = (target: WireDest) => {
        if (!controlsEnabled || !activeSource) return;

        setConnections((prev) => {
            const next = { ...prev };

            // Ein Ziel darf nur einmal belegt sein. Dadurch fühlt es sich wie ein echtes Kabel-Routing an.
            (Object.keys(next) as WireSource[]).forEach((source) => {
                if (next[source] === target) next[source] = null;
            });

            next[activeSource] = target;
            return next;
        });

        setActiveSource(null);
    };

    const resetWiring = () => {
        if (!controlsEnabled) return;
        setConnections({ "TX-1": null, "TX-2": null, "TX-3": null });
        setActiveSource(null);
    };

    useEffect(() => {
        if (showAlarm || !alarmReady) return;

        const timer = window.setTimeout(() => {
            setShowAlarm(true);
        }, 900);

        return () => window.clearTimeout(timer);
    }, [alarmReady, showAlarm]);

    const handleStartAlarmPhase = async () => {
        if (!sessionId || isLoadingAlert) return;
        setIsLoadingAlert(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: "ALERT",
                socialAdherence: socialAdherenceScore
            });

            if (!res.success) {
                setError(res.error || "Update fehlgeschlagen");
                setIsLoadingAlert(false);
                return;
            }

            setPhase("ALERT");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler");
            setIsLoadingAlert(false);
        }
    };

    return (
        <div className="relative">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity duration-500 ${showAlarm ? "opacity-0" : "opacity-100"}`}>
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                Manuelle Kalibrierung
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight">Wetter- und Steuerkreisabgleich</h2>
                            {/*<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">*/}
                            {/*    Schließe die drei lokalen Wartungsaufgaben ab. Die Oberfläche simuliert eine einfache*/}
                            {/*    Leitstand-Konsole mit manueller Rücksetzung, Signalrouting und Regelkreisabgleich.*/}
                            {/*</p>*/}
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Fortschritt</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-white">{completedTasks}/3</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    {!isPhaseUnlocked && (
                        <ApprovalPendingNotice className="mb-6" />
                    )}

                    <div className="grid items-start gap-5 xl:grid-cols-[1.45fr_1fr]">
                        <section className={`rounded-xl border p-5 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="font-bold text-slate-900">1. Regelkreisabgleich Bewetterung</p>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                        Bewege die Regler in die markierten Sollfenster. Drei Regelkreise sind stabilisierbar;
                                        der Stellmotor der Wetterklappe zeigt eine hartnäckige Drift.
                                    </p>
                                </div>
                                <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${sliders1to3Ready ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                                    {sliders1to3Ready ? "Lüfter stabil" : "Abgleich offen"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {(Object.keys(calibration) as CalibrationKey[]).map((key) => {
                                    const [targetMin, targetMax] = targetBands[key];
                                    const value = calibration[key];
                                    const inTarget = value >= targetMin && value <= targetMax;
                                    const isDamper = key === "damper";
                                    const meta = calibrationLabels[key];

                                    return (
                                        <div
                                            key={key}
                                            className={`rounded-xl border p-4 transition ${inTarget ? "border-emerald-300 bg-emerald-50" : isDamper && damperAttemptCount > 0 ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-slate-50"}`}
                                        >
                                            <div className="mb-3 min-h-16">
                                                <p className="text-sm font-black text-slate-900">{meta.label}</p>
                                                <p className="mt-1 text-xs text-slate-500">{meta.description}</p>
                                            </div>

                                            <div className="relative h-56 rounded-lg border border-slate-300 bg-white p-2 shadow-inner">
                                                <div className="absolute inset-x-2 bottom-2 top-2 rounded bg-[linear-gradient(to_top,rgba(15,23,42,0.04),rgba(15,23,42,0.01))]" />

                                                <div
                                                    className="absolute left-2 right-2 z-10 rounded border border-sky-300 bg-sky-200/60"
                                                    style={{ bottom: `${targetMin}%`, height: `${targetMax - targetMin}%` }}
                                                />

                                                {isDamper && (
                                                    <div
                                                        className="absolute left-2 right-2 z-10 rounded border border-amber-400 bg-amber-100/80"
                                                        style={{ bottom: "71%", height: "8%" }}
                                                        title="Instabiler Stellbereich"
                                                    />
                                                )}

                                                <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-slate-200" />

                                                <div className="absolute bottom-2 left-1/2 top-2 z-20 w-12 -translate-x-1/2">
                                                    <div
                                                        className={`absolute bottom-0 left-0 right-0 rounded-t-md border-x border-t shadow-sm transition-all duration-100 ${inTarget ? "border-emerald-700 bg-emerald-500" : isDamper && damperAttemptCount > 0 ? "border-amber-700 bg-amber-500" : "border-slate-600 bg-slate-500"}`}
                                                        style={{ height: `${clamp(value, 4, 96)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span className="font-mono text-xl font-black tabular-nums text-slate-950">
                                                    {Math.round(value)}{meta.unit}
                                                </span>
                                                <span className="text-xs font-bold text-slate-500">
                                                    Ziel {targetMin}–{targetMax}{meta.unit}
                                                </span>
                                            </div>

                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={value}
                                                disabled={!controlsEnabled}
                                                onChange={(event) => handleSliderChange(key, Number(event.target.value))}
                                                className="mt-3 w-full cursor-pointer accent-slate-700 disabled:cursor-not-allowed"
                                                aria-label={`${meta.label} einstellen`}
                                            />

                                            {isDamper && damperAttemptCount > 0 && (
                                                <p className="mt-2 text-xs font-semibold text-amber-700">
                                                    Reglerdrift erkannt. Klappenstellung springt aus dem Sollfenster.
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="flex flex-col gap-4">
                            <section className={`rounded-xl border p-3 md:p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                                <div className="mb-2 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-slate-900">2. Relais-Neustart</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Setze ausgelöste Schütze zurück. Grüne Kontrolllampen bleiben verriegelt.
                                        </p>
                                    </div>
                                    {relaysReady && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                                            Online
                                        </span>
                                    )}
                                </div>

                                <div className="rounded-xl border border-slate-300 bg-slate-100 p-2.5 shadow-inner">
                                    <div className="grid grid-cols-3 gap-2">
                                        {relays.map((relay, index) => {
                                            const isOn = relay === "on";

                                            return (
                                                <button
                                                    key={`relay-${index}`}
                                                    onClick={() => toggleRelay(index)}
                                                    disabled={!controlsEnabled || isOn}
                                                    className={`relative h-14 rounded-lg border-2 px-1.5 text-center transition md:h-16 ${isOn ? "cursor-default border-emerald-500 bg-emerald-100 text-emerald-900" : "border-rose-500 bg-rose-100 text-rose-900 shadow-[0_0_18px_rgba(244,63,94,0.30)] hover:bg-rose-200"} disabled:cursor-default`}
                                                    aria-label={`Relais K${index + 1} ${isOn ? "online" : "zurücksetzen"}`}
                                                >
                                                    <span className={`mx-auto mb-1 block h-2.5 w-2.5 rounded-full border ${isOn ? "border-emerald-700 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "border-rose-700 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]"}`} />
                                                    <span className="block font-mono text-xs font-black">K-{index + 1}</span>
                                                    <span className="block text-[10px] font-black uppercase tracking-wide">
                                                        {isOn ? "ON" : "RESET"}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            <section className={`rounded-xl border p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-slate-900">3. Daten-Routing</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Verbinde lose Adern mit der passenden Farbe. Quelle antippen, dann Zielbuchse antippen.
                                        </p>
                                    </div>
                                    {wiresReady && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                                            Verbunden
                                        </span>
                                    )}
                                </div>

                                <div className="rounded-xl border border-slate-300 bg-slate-950 p-3 text-white shadow-inner">
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-[92px_1fr_92px] md:items-center">
                                        <div className="flex flex-col gap-3">
                                            {wirePorts.map((port) => {
                                                const isActive = activeSource === port.id;
                                                const isConnected = connections[port.id] !== null;

                                                return (
                                                    <button
                                                        key={port.id}
                                                        onClick={() => handleWireSourceClick(port.id)}
                                                        disabled={!controlsEnabled}
                                                        className={`h-12 rounded-lg border px-2 text-left transition md:h-14 ${isActive ? "border-sky-300 bg-sky-900/70 ring-2 ring-sky-400" : isConnected ? "border-slate-600 bg-slate-800" : "border-slate-600 bg-slate-900 hover:bg-slate-800"}`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-4 w-4 rounded-full border ${port.dotClass}`} />
                                                            <span className="font-mono text-xs font-black">{port.label}</span>
                                                        </span>
                                                        <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-400">
                                                            {port.colorLabel}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="relative hidden h-56 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 md:block">
                                            <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
                                                <defs>
                                                    <filter id="softGlow">
                                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur" />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>

                                                {[20, 50, 80].map((y) => (
                                                    <line
                                                        key={`guide-${y}`}
                                                        x1="0"
                                                        y1={`${(y / 100) * 240}`}
                                                        x2="400"
                                                        y2={`${(y / 100) * 240}`}
                                                        className="stroke-slate-800"
                                                        strokeWidth="1"
                                                    />
                                                ))}

                                                {wirePorts.map((port) => {
                                                    const dest = connections[port.id];
                                                    if (!dest) return null;

                                                    const target = wireTargets.find((entry) => entry.id === dest);
                                                    if (!target) return null;

                                                    const isCorrect = dest === port.target;
                                                    const y1 = (port.y / 100) * 240;
                                                    const y2 = (target.y / 100) * 240;

                                                    return (
                                                        <path
                                                            key={`${port.id}-${dest}`}
                                                            d={`M 12 ${y1} C 130 ${y1}, 250 ${y2}, 388 ${y2}`}
                                                            className={`fill-none ${isCorrect ? port.wireClass : "stroke-rose-500"}`}
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            filter="url(#softGlow)"
                                                        />
                                                    );
                                                })}
                                            </svg>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {wireTargets.map((target) => {
                                                const isConnected = Object.values(connections).includes(target.id);
                                                const canConnect = Boolean(activeSource);

                                                return (
                                                    <button
                                                        key={target.id}
                                                        onClick={() => handleWireTargetClick(target.id)}
                                                        disabled={!controlsEnabled || !canConnect}
                                                        className={`h-12 rounded-lg border px-2 text-left transition md:h-14 ${isConnected ? "border-emerald-500 bg-emerald-900/40" : canConnect ? "border-sky-400 bg-sky-950 ring-1 ring-sky-500 hover:bg-sky-900" : "border-slate-600 bg-slate-900"} disabled:cursor-default`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-4 w-4 rounded-full border ${target.dotClass}`} />
                                                            <span className="font-mono text-xs font-black">{target.label}</span>
                                                        </span>
                                                        <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-400">
                                                            {target.colorLabel}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs text-slate-400">
                                            Falsch gesteckte Leitungen können durch erneutes Auswählen überschrieben werden.
                                        </p>
                                        <button
                                            onClick={resetWiring}
                                            disabled={!controlsEnabled}
                                            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Routing zurücksetzen
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {showAlarm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center border-[10px] border-red-600 bg-red-950/95 p-6">
                    <div className="w-full max-w-4xl rounded-2xl border-2 border-red-500 bg-[#100000] p-8 text-red-100 shadow-[0_0_100px_rgba(220,38,38,0.45)] md:p-12">
                        <div className="mb-6 flex items-center gap-4 border-b border-red-900/70 pb-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500 bg-red-900/60 text-3xl font-black text-white shadow-[0_0_28px_rgba(239,68,68,0.65)]">
                                !
                            </div>
                            <div>
                                <p className="text-sm font-mono font-black uppercase tracking-[0.32em] text-red-400">
                                    Kritischer Systemalarm
                                </p>
                                <p className="mt-1 text-xs font-mono text-red-300/80">
                                    Leitstandmeldung / Schieferkamm Sektor 04
                                </p>
                            </div>
                        </div>

                        <h3 className="mb-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                            ABFALL DER GRUBEN BEWETTERUNG
                        </h3>

                        <div className="mb-10 space-y-4 font-mono text-lg leading-relaxed text-red-200 md:text-xl">
                            <p className="rounded-lg border border-red-500/30 bg-red-900/30 p-4">
                                <span className="font-black text-white">FEHLERURSACHE:</span> Wetterklappe WK-04 hält die Sollstellung nicht.
                            </p>
                            <p>CH₄-Anstieg in Sektor 04 prognostiziert. Abluftführung instabil.</p>
                            <p>Automatische Eskalation in das Notfallprotokoll erforderlich.</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleStartAlarmPhase}
                                disabled={isLoadingAlert}
                                className={`w-full rounded-xl bg-red-600 px-10 py-5 text-xl font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] transition hover:scale-[1.02] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto ${isNextStepReady ? "next-step-attention" : ""}`}
                            >
                                {isLoadingAlert ? "Notfallprotokoll wird gestartet..." : "Notfallprotokoll initiieren"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
