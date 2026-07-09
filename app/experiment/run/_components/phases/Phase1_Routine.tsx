// app/experiment/run/_components/phases/Phase1_Routine.tsx
"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
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
    shapeClass: string;
    shapeLabel: string;
    wireClass: string;
    y: number;
};

type WireTarget = {
    id: WireDest;
    label: string;
    expectedSource: WireSource;
    colorLabel: string;
    dotClass: string;
    shapeClass: string;
    shapeLabel: string;
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
        label: "Primärlüfter\nL-01",
        unit: "%",
        description: "Referenzkreis Hauptstrecke"
    },
    secAir: {
        label: "Sekundärlüfter\nL-02",
        unit: "%",
        description: "Referenzkreis Nebenstrecke"
    },
    exhaust: {
        label: "Abluftsog\nEX-04",
        unit: "%",
        description: "Abluftführung Sektor 04"
    },
    damper: {
        label: "Wetterklappe\nWK-04",
        unit: "%",
        description: "Nachjustage Sektor 04"
    }
};

const calibrationOrder: CalibrationKey[] = ["primAir", "secAir", "exhaust", "damper"];

const wirePorts: WirePort[] = [
    {
        id: "TX-1",
        target: "RX-B",
        label: "TX-1",
        colorLabel: "blau",
        dotClass: "bg-sky-500 border-sky-700",
        shapeClass: "rounded-full",
        shapeLabel: "Kreis",
        wireClass: "stroke-sky-500",
        y: 20
    },
    {
        id: "TX-2",
        target: "RX-C",
        label: "TX-2",
        colorLabel: "gelb",
        dotClass: "bg-amber-400 border-amber-600",
        shapeClass: "rounded-sm",
        shapeLabel: "Quadrat",
        wireClass: "stroke-amber-400",
        y: 50
    },
    {
        id: "TX-3",
        target: "RX-A",
        label: "TX-3",
        colorLabel: "violett",
        dotClass: "bg-violet-500 border-violet-700",
        shapeClass: "rotate-45 rounded-[2px]",
        shapeLabel: "Raute",
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
        shapeClass: "rotate-45 rounded-[2px]",
        shapeLabel: "Raute",
        y: 20
    },
    {
        id: "RX-B",
        label: "RX-B",
        expectedSource: "TX-1",
        colorLabel: "blau",
        dotClass: "bg-sky-500 border-sky-700",
        shapeClass: "rounded-full",
        shapeLabel: "Kreis",
        y: 50
    },
    {
        id: "RX-C",
        label: "RX-C",
        expectedSource: "TX-2",
        colorLabel: "gelb",
        dotClass: "bg-amber-400 border-amber-600",
        shapeClass: "rounded-sm",
        shapeLabel: "Quadrat",
        y: 80
    }
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const CLICK_ALARM_THRESHOLD = 20;
const MOBILE_CLICK_ALARM_THRESHOLD = 10;
const TIME_ALARM_DELAY_MS = 45_000;
const DAMPER_ALARM_THRESHOLD = 10;

export default function Phase1Routine() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoadingAlert, setIsLoadingAlert] = useState(false);
    const [showAlarm, setShowAlarm] = useState(false);

    const [calibration, setCalibration] = useState<CalibrationState>({
        primAir: 22,
        secAir: 80,
        exhaust: 31,
        damper: 41
    });

    const [interactionClickCount, setInteractionClickCount] = useState(0);
    const [damperAttemptCount, setDamperAttemptCount] = useState(0);
    const [damperInteracted, setDamperInteracted] = useState(false);
    const [relays, setRelays] = useState<RelayState[]>(["on", "tripped", "on", "tripped", "tripped", "on"]);
    const [connections, setConnections] = useState<Record<WireSource, WireDest | null>>({
        "TX-1": null,
        "TX-2": null,
        "TX-3": null
    });
    const [activeSource, setActiveSource] = useState<WireSource | null>(null);
    const [activeTarget, setActiveTarget] = useState<WireDest | null>(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const mobileDamperCrossRef = useRef<{
        lastSide: "below" | "above";
        touchedTarget: boolean;
        originSide: "below" | "above" | null;
    }>({
        lastSide: "below",
        touchedTarget: false,
        originSide: null
    });

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

    const alarmReady =
        damperAttemptCount > DAMPER_ALARM_THRESHOLD ||
        interactionClickCount >= (isMobileDevice ? MOBILE_CLICK_ALARM_THRESHOLD : CLICK_ALARM_THRESHOLD);

    const completedTasks = useMemo(() => {
        return [sliders1to3Ready, relaysReady, wiresReady].filter(Boolean).length;
    }, [sliders1to3Ready, relaysReady, wiresReady]);

    const handleSliderChange = (key: CalibrationKey, rawValue: number) => {
        if (!controlsEnabled) return;

        let finalValue = rawValue;

        if (key === "damper") {
            if (isMobileDevice) {
                const [targetMin, targetMax] = targetBands.damper;
                const currentSide = rawValue < targetMin ? "below" : rawValue > targetMax ? "above" : "inside";

                if (currentSide === "inside") {
                    if (!mobileDamperCrossRef.current.originSide) {
                        mobileDamperCrossRef.current.originSide = mobileDamperCrossRef.current.lastSide;
                    }
                    mobileDamperCrossRef.current.touchedTarget = true;
                } else {
                    if (
                        mobileDamperCrossRef.current.touchedTarget &&
                        mobileDamperCrossRef.current.originSide &&
                        currentSide !== mobileDamperCrossRef.current.originSide
                    ) {
                        setShowAlarm(true);
                    }

                    mobileDamperCrossRef.current.lastSide = currentSide;
                    mobileDamperCrossRef.current.touchedTarget = false;
                    mobileDamperCrossRef.current.originSide = null;
                }
            }

            setDamperInteracted(true);
            const currentDamper = calibration.damper;
            const movingUp = rawValue >= currentDamper;
            const nearTarget = rawValue >= 70 && rawValue <= 82;
            const insideBlockedBand = rawValue >= 73 && rawValue <= 77;

            if (nearTarget) {
                setDamperAttemptCount((prev) => prev + 1);
            }

            // Simulierte Stellmotor-Instabilität: stärkerer Schlupf, Rückschlag und grobe Sprünge.
            const jitterKick = (damperAttemptCount % 5) - 2; // -2, -1, 0, +1, +2
            const drift = movingUp ? -8 : 8;
            finalValue = rawValue + drift + jitterKick * 4;

            // Bei kleinen Korrekturen "klebt" der Regler und springt dann abrupt zurück.
            if (Math.abs(rawValue - currentDamper) < 4) {
                finalValue += movingUp ? -7 : 7;
            }

            if (nearTarget && !insideBlockedBand) {
                finalValue += rawValue < 75 ? -7 : 7;
            }

            if (rawValue >= 40 && rawValue <= 90) {
                finalValue = Math.round(finalValue / 5) * 5;
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

        let nextValue = clamp(finalValue, 0, 100);

        if (key === "damper" && nextValue >= targetBands.damper[0] && nextValue <= targetBands.damper[1]) {
            nextValue = nextValue < 75 ? 73 : 77;
        }

        setCalibration((prev) => ({ ...prev, [key]: nextValue }));
    };

    const handleSliderTouchInteraction = (key: CalibrationKey, event: TouchEvent<HTMLDivElement>) => {
        if (!controlsEnabled || !isMobileDevice) return;
        const touch = event.touches[0];
        if (!touch) return;
        event.preventDefault();

        const trackRect = event.currentTarget.getBoundingClientRect();
        const rawValue = ((trackRect.bottom - touch.clientY) / trackRect.height) * 100;
        handleSliderChange(key, clamp(rawValue, 0, 100));
    };

    const toggleRelay = (index: number) => {
        if (!controlsEnabled || relays[index] === "on") return;

        setRelays((prev) => prev.map((relay, idx) => (idx === index ? "on" : relay)));
    };

    const connectWire = (source: WireSource, target: WireDest) => {
        setConnections((prev) => {
            const next = { ...prev };

            // Ein Ziel darf nur einmal belegt sein. Dadurch fühlt es sich wie ein echtes Kabel-Routing an.
            (Object.keys(next) as WireSource[]).forEach((entrySource) => {
                if (next[entrySource] === target) next[entrySource] = null;
            });

            next[source] = target;
            return next;
        });
        setActiveSource(null);
        setActiveTarget(null);
    };

    const handleWireSourceClick = (source: WireSource) => {
        if (!controlsEnabled) return;
        if (activeTarget) {
            connectWire(source, activeTarget);
            return;
        }
        setActiveSource((prev) => (prev === source ? null : source));
    };

    const handleWireTargetClick = (target: WireDest) => {
        if (!controlsEnabled) return;
        if (activeSource) {
            connectWire(activeSource, target);
            return;
        }
        setActiveTarget((prev) => (prev === target ? null : target));
    };

    const resetWiring = () => {
        if (!controlsEnabled) return;
        setConnections({ "TX-1": null, "TX-2": null, "TX-3": null });
        setActiveSource(null);
        setActiveTarget(null);
    };

    useEffect(() => {
        if (showAlarm || !alarmReady) return;

        const timer = window.setTimeout(() => {
            setShowAlarm(true);
        }, 900);

        return () => window.clearTimeout(timer);
    }, [alarmReady, showAlarm]);

    useEffect(() => {
        if (!isPhaseUnlocked || showAlarm) return;

        const timer = window.setTimeout(() => {
            setShowAlarm(true);
        }, TIME_ALARM_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [isPhaseUnlocked, showAlarm]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(pointer: coarse)");
        const updateIsMobile = () => setIsMobileDevice(mediaQuery.matches);
        updateIsMobile();

        mediaQuery.addEventListener("change", updateIsMobile);
        return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }, []);

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
        <div
            className="relative"
            onClickCapture={() => {
                if (!isPhaseUnlocked || showAlarm || isLoadingAlert) return;
                setInteractionClickCount((prev) => prev + 1);
            }}
        >
            {error && (
                <div className="mb-4 rounded-none border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className={`overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm transition-opacity duration-500 ${showAlarm ? "opacity-0" : "opacity-100"}`}>
                <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6 sm:py-5 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                Lokaler Kalibrierungssatz
                            </p>
                            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">WK-04 Stellkreis · Bewetterung Sektor 04</h2>
                            {/*<p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">*/}
                            {/*    Die leichte Stellabweichung aus der Schichtübernahme wird jetzt lokal nachjustiert: Stellkreis, Verriegelungen und Rückmeldesignale.*/}
                            {/*</p>*/}
                        </div>

                        <div className="self-start rounded-none border border-slate-700 bg-slate-900 px-4 py-3 text-sm md:shrink-0">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Prüfschritte</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-white">{completedTasks}/3</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {!isPhaseUnlocked && (
                        <ApprovalPendingNotice className="mb-6" />
                    )}

                    {/*<section className="mb-5 grid gap-3 rounded-none border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-950 shadow-sm lg:grid-cols-3">*/}
                    {/*    <div>*/}
                    {/*        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Auslöser</p>*/}
                    {/*        <p className="mt-1 font-semibold leading-relaxed">WK-04 zeigte bei der Schichtübernahme eine leichte Stellabweichung.</p>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Ziel</p>*/}
                    {/*        <p className="mt-1 font-semibold leading-relaxed">Stellkreis stabilisieren und Rückmeldesignale vor der vollständigen Übernahme plausibilisieren.</p>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Status</p>*/}
                    {/*        <p className="mt-1 font-semibold leading-relaxed">Keine akute Gefahrenlage. Lokale Nachjustage empfohlen.</p>*/}
                    {/*    </div>*/}
                    {/*</section>*/}

                    <div className="grid items-start gap-4 sm:gap-5 xl:grid-cols-[1.45fr_1fr]">
                        <section className={`rounded-none border p-4 sm:p-5 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    {/*<p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">1 · Stellkreis nachführen</p>*/}
                                    <p className="mt-1 font-bold text-slate-900">Regelkreisabgleich Bewetterung</p>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                        Regler manuell kalibrieren, bis die Werte im blau markierten Sollfenster liegen.
                                    </p>
                                </div>
                                {/*<span className={`self-start whitespace-nowrap rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide sm:shrink-0 ${sliders1to3Ready ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>*/}
                                {/*    {sliders1to3Ready ? "Referenzkreise stabil" : "Abgleich offen"}*/}
                                {/*</span>*/}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-4">
                                {calibrationOrder.map((key) => {
                                    const [targetMin, targetMax] = targetBands[key];
                                    const value = calibration[key];
                                    const isDamper = key === "damper";
                                    const inTarget = !isDamper && value >= targetMin && value <= targetMax;
                                    const isDamperHighlighted = isDamper && damperInteracted;
                                    const meta = calibrationLabels[key];
                                    const valuePosition = clamp(value, 4, 96);

                                    return (
                                        <div
                                            key={key}
                                            className={`rounded-none border p-3 transition sm:p-4 ${inTarget ? "border-emerald-300 bg-emerald-50" : isDamperHighlighted ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-slate-50"}`}
                                        >
                                            <div className="mb-3 grid content-start gap-1.5">
                                                <p className="whitespace-pre-line text-[10px] font-bold leading-tight text-slate-900 sm:text-[11px]">{meta.label}</p>
                                                {isDamperHighlighted ? (
                                                    <span className="w-fit rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-800">
                                                        Auffällig
                                                    </span>
                                                ) : inTarget ? (
                                                    <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                                                        Soll
                                                    </span>
                                                ) : (
                                                    <span className="w-fit rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-500">
                                                        Referenz
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`relative h-64 rounded-none border bg-white p-2 shadow-inner ${isDamperHighlighted ? "border-amber-300" : "border-slate-300"}`}
                                                onTouchStart={(event) => handleSliderTouchInteraction(key, event)}
                                                onTouchMove={(event) => handleSliderTouchInteraction(key, event)}
                                            >
                                                <div className="absolute inset-x-2 bottom-2 top-2 rounded-none bg-[linear-gradient(to_top,rgba(15,23,42,0.04),rgba(15,23,42,0.01))]" />

                                                <div
                                                    className="absolute left-2 right-2 z-10 rounded border border-sky-300 bg-sky-200/60"
                                                    style={{ bottom: `${targetMin}%`, height: `${targetMax - targetMin}%` }}
                                                />

                                                {isDamperHighlighted && (
                                                    <div
                                                        className="absolute left-2 right-2 z-10 rounded border border-amber-400 bg-amber-100/80"
                                                        style={{ bottom: "71%", height: "8%" }}
                                                        title="Instabiler Stellbereich"
                                                    />
                                                )}

                                                <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-slate-200" />

                                                <div className="pointer-events-none absolute bottom-2 left-1/2 top-2 z-20 w-12 -translate-x-1/2">
                                                    <div
                                                        className={`absolute left-0 right-0 h-4 rounded-full border shadow-sm transition-all duration-100 ${inTarget ? "border-emerald-700 bg-emerald-500" : isDamperHighlighted ? "border-amber-700 bg-amber-500" : "border-slate-600 bg-slate-500"}`}
                                                        style={{ bottom: `${valuePosition}%` }}
                                                    />
                                                </div>

                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    value={value}
                                                    disabled={!controlsEnabled}
                                                    onChange={(event) => handleSliderChange(key, Number(event.target.value))}
                                                    className={`absolute left-1/2 top-1/2 z-30 h-12 w-60 -translate-x-1/2 -translate-y-1/2 -rotate-90 cursor-pointer accent-slate-700 disabled:cursor-not-allowed ${isMobileDevice ? "touch-auto" : "touch-none"}`}
                                                    aria-label={`${meta.label} einstellen`}
                                                    aria-valuetext={`${Math.round(value)}${meta.unit}`}
                                                />
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                                <span className="font-mono text-lg font-black tabular-nums text-slate-950 sm:text-xl">
                                                    {Math.round(value)}{meta.unit}
                                                </span>
                                                <span className="whitespace-nowrap text-xs font-bold text-slate-500">
                                                    Ziel {targetMin}–{targetMax}{meta.unit}
                                                </span>
                                            </div>

                                            {/*{isDamper && damperAttemptCount > 0 && (*/}
                                            {/*    <p className="mt-2 rounded-none border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-black uppercase tracking-wide text-amber-800">*/}
                                            {/*        Stellabweichung bleibt bestehen*/}
                                            {/*    </p>*/}
                                            {/*)}*/}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="flex flex-col gap-4">
                            <section className={`rounded-none border p-3 md:p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                                <div className="mb-2 flex items-start justify-between gap-3">
                                    <div>
                                        {/*<p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">2 · Verriegelungen zurücksetzen</p>*/}
                                        <p className="mt-1 font-bold text-slate-900">Verriegelungen</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Durch die Stellabweichung wurden einzelne Kontrollrelais vorsorglich ausgelöst. Setze nur rote Relais zurück.
                                        </p>
                                    </div>
                                    <span className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${relaysReady ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-100 text-slate-500"}`}>
                                        {relaysReady ? "Online" : "Offline"}
                                    </span>
                                </div>

                                <div className="rounded-none border border-slate-300 bg-slate-100 p-2.5 shadow-inner">
                                    <div className="grid grid-cols-3 gap-2">
                                        {relays.map((relay, index) => {
                                            const isOn = relay === "on";

                                            return (
                                                <button
                                                    key={`relay-${index}`}
                                                    onClick={() => toggleRelay(index)}
                                                    disabled={!controlsEnabled || isOn}
                                                    className={`relative h-12 rounded-lg border-2 px-1.5 text-center transition md:h-14 ${isOn ? "cursor-default border-emerald-500 bg-emerald-100 text-emerald-900" : "border-rose-500 bg-rose-100 text-rose-900 shadow-[0_0_18px_rgba(244,63,94,0.30)] hover:bg-rose-200"} disabled:cursor-default`}
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

                            <section className={`rounded-none border p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        {/*<p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">3 · Rückmeldesignale prüfen</p>*/}
                                        <p className="mt-1 font-bold text-slate-900">Signalrückmeldung WK-04</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Ordne die Rückmeldesignale den passenden Ports zu.
                                        </p>
                                    </div>
                                    <span className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${wiresReady ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-100 text-slate-500"}`}>
                                        {wiresReady ? "Verbunden" : "Reconnect"}
                                    </span>
                                </div>

                                <div className="rounded-none border border-slate-300 bg-slate-950 p-2.5 text-white shadow-inner">
                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-[92px_1fr_92px] md:items-stretch">
                                        <div className="flex flex-col gap-2">
                                            {wirePorts.map((port) => {
                                                const isActive = activeSource === port.id;
                                                const isConnected = connections[port.id] !== null;
                                                const canConnect = Boolean(activeTarget);

                                                return (
                                                    <button
                                                        key={port.id}
                                                        onClick={() => handleWireSourceClick(port.id)}
                                                        disabled={!controlsEnabled}
                                                        className={`h-7 rounded-lg border px-2 text-left transition md:h-8 ${isActive ? "border-sky-300 bg-sky-900/70 ring-2 ring-sky-400" : isConnected ? "border-slate-600 bg-slate-800" : canConnect ? "border-sky-400 bg-sky-950 ring-1 ring-sky-500 hover:bg-sky-900" : "border-slate-600 bg-slate-900 hover:bg-slate-800"}`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-4 w-4 border ${port.dotClass} ${port.shapeClass}`} />
                                                            <span className="font-mono text-xs font-black">{port.label}</span>
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="relative hidden self-stretch overflow-hidden rounded-none border border-slate-700 bg-slate-900 md:block">
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

                                        <div className="flex flex-col gap-2">
                                            {wireTargets.map((target) => {
                                                const isConnected = Object.values(connections).includes(target.id);
                                                const isActive = activeTarget === target.id;
                                                const canConnect = Boolean(activeSource);

                                                return (
                                                    <button
                                                        key={target.id}
                                                        onClick={() => handleWireTargetClick(target.id)}
                                                        disabled={!controlsEnabled}
                                                        className={`h-7 rounded-lg border px-2 text-left transition md:h-8 ${isActive ? "border-sky-300 bg-sky-900/70 ring-2 ring-sky-400" : isConnected ? "border-emerald-500 bg-emerald-900/40" : canConnect ? "border-sky-400 bg-sky-950 ring-1 ring-sky-500 hover:bg-sky-900" : "border-slate-600 bg-slate-900 hover:bg-slate-800"} disabled:cursor-default`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-4 w-4 border ${target.dotClass} ${target.shapeClass}`} />
                                                            <span className="font-mono text-xs font-black">{target.label}</span>
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-800 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs text-slate-400">
                                            Quelle oder Ziel zuerst antippen, dann die Gegenseite verbinden.
                                        </p>
                                        <button
                                            onClick={resetWiring}
                                            disabled={!controlsEnabled}
                                            className="h-8 shrink-0 rounded-lg border border-slate-600 px-3 py-1 text-xs font-bold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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

            {showAlarm && typeof document !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto border-4 border-red-600 bg-red-950/98 p-3 sm:border-[10px] sm:p-6">
                    <div className="my-auto w-full max-w-4xl rounded-none border-2 border-red-500 bg-[#100000] p-5 text-red-100 shadow-[0_0_100px_rgba(220,38,38,0.45)] sm:p-8 md:p-12">
                        <div className="mb-6 flex items-center gap-3 border-b border-red-900/70 pb-4 sm:gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-red-900/60 text-2xl font-black text-white shadow-[0_0_28px_rgba(239,68,68,0.65)] sm:h-14 sm:w-14 sm:text-3xl">
                                !
                            </div>
                            <div>
                                <p className="text-xs font-mono font-black uppercase tracking-[0.2em] text-red-400 sm:text-sm sm:tracking-[0.32em]">
                                    Kritischer Systemalarm
                                </p>
                                <p className="mt-1 text-xs font-mono text-red-300/80">
                                    Leitstandmeldung / Schieferkamm Sektor 04
                                </p>
                            </div>
                        </div>

                        <h3 className="mb-6 text-2xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                            ABFALL DER GRUBEN BEWETTERUNG
                        </h3>

                        <div className="mb-8 space-y-4 font-mono text-base leading-relaxed text-red-200 sm:mb-10 sm:text-lg md:text-xl">
                            <p className="rounded-none border border-red-500/30 bg-red-900/30 p-3 sm:p-4">
                                <span className="font-black text-white">FEHLERURSACHE:</span> Wetterklappe WK-04 hält die Sollstellung nicht.
                            </p>
                            <p>CH₄-Anstieg in Sektor 04 prognostiziert. Abluftführung instabil.</p>
                            <p>Automatische Eskalation in das Notfallprotokoll erforderlich.</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleStartAlarmPhase}
                                disabled={isLoadingAlert}
                                className={`w-full rounded-xl bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] transition hover:scale-[1.02] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-10 sm:py-5 sm:text-xl md:w-auto ${isNextStepReady ? "next-step-attention" : ""}`}
                            >
                                {isLoadingAlert ? "Notfallprotokoll wird gestartet..." : "Notfallprotokoll initiieren"}
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </div>
    );
}
