"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

type MixtureState = {
    co2: number;
    nutri: number;
    rad: number;
    water: number;
};

const ACTIVITY_THRESHOLD = 16;
const HONEY_TARGETS = ["A1", "B2", "C3", "D2"];
const WIRE_TARGETS = { red: "R", blue: "B", green: "G" } as const;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const targetBands: Record<keyof MixtureState, [number, number]> = {
    co2: [46, 58],
    nutri: [24, 36],
    rad: [72, 84],
    water: [14, 26]
};

const colorStyles: Record<keyof MixtureState, string> = {
    co2: "bg-lime-400",
    nutri: "bg-emerald-400",
    rad: "bg-rose-500",
    water: "bg-sky-400"
};

const scaleColor = (value: number) => {
    if (value >= 75) return "bg-emerald-500";
    if (value >= 50) return "bg-amber-500";
    return "bg-rose-500";
};

export default function Phase1Routine() {
    const { sessionId, setPhase, socialAdherenceScore, isPhaseUnlocked } = useExperimentStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoadingAlert, setIsLoadingAlert] = useState(false);
    const [showAlarm, setShowAlarm] = useState(false);
    const [activityCount, setActivityCount] = useState(0);

    const [mixture, setMixture] = useState<MixtureState>({
        co2: 40,
        nutri: 31,
        rad: 63,
        water: 28
    });

    const [honeyActivated, setHoneyActivated] = useState<string[]>([]);
    const [wireConnect, setWireConnect] = useState<{ red: string | null; blue: string | null; green: string | null }>({
        red: null,
        blue: null,
        green: null
    });
    const [selectedWire, setSelectedWire] = useState<"red" | "blue" | "green" | null>(null);
    const [panelKnobs, setPanelKnobs] = useState({
        bypass: 38,
        cctv: 22,
        pulse: 65
    });

    const controlsEnabled = isPhaseUnlocked && !showAlarm && !isLoadingAlert;
    const bumpActivity = () => setActivityCount((prev) => prev + 1);

    const systemStats = useMemo(() => {
        const mixtureScore =
            ((100 - Math.abs(mixture.co2 - 52)) +
                (100 - Math.abs(mixture.nutri - 30)) +
                (100 - Math.abs(mixture.rad - 78)) +
                (100 - Math.abs(mixture.water - 20))) /
            4;

        const honeyScore = (honeyActivated.length / HONEY_TARGETS.length) * 100;
        const wireScore =
            (Object.entries(wireConnect).filter(([wire, target]) => target === WIRE_TARGETS[wire as keyof typeof WIRE_TARGETS]).length / 3) * 100;
        const knobScore = (panelKnobs.bypass + panelKnobs.cctv + panelKnobs.pulse) / 3;

        return {
            pressure: clamp(Math.round((mixtureScore + knobScore) / 2), 0, 100),
            ventilation: clamp(Math.round((mixtureScore + wireScore) / 2), 0, 100),
            network: clamp(Math.round((wireScore + honeyScore) / 2), 0, 100),
            stability: clamp(Math.round((mixtureScore + honeyScore + wireScore + knobScore) / 4), 0, 100),
            anomaly: clamp(Math.round(100 - (honeyScore * 0.35 + wireScore * 0.35 + mixtureScore * 0.3)), 0, 100)
        };
    }, [mixture, honeyActivated.length, wireConnect, panelKnobs.bypass, panelKnobs.cctv, panelKnobs.pulse]);

    const setMixtureValue = (key: keyof MixtureState, value: number) => {
        if (!controlsEnabled) return;
        setMixture((prev) => ({ ...prev, [key]: value }));
        bumpActivity();
    };

    const toggleHoneyCell = (cellId: string) => {
        if (!controlsEnabled) return;
        setHoneyActivated((prev) => {
            const next = prev.includes(cellId) ? prev.filter((id) => id !== cellId) : [...prev, cellId];
            return next;
        });
        setPanelKnobs((prev) => ({
            ...prev,
            pulse: clamp(prev.pulse + (Math.random() > 0.5 ? 2 : -2), 0, 100)
        }));
        bumpActivity();
    };

    const startWirePick = (wire: "red" | "blue" | "green") => {
        if (!controlsEnabled) return;
        setSelectedWire(wire);
        bumpActivity();
    };

    const connectWire = (target: "R" | "B" | "G") => {
        if (!controlsEnabled || !selectedWire) return;
        setWireConnect((prev) => ({ ...prev, [selectedWire]: target }));
        setSelectedWire(null);
        setPanelKnobs((prev) => ({
            ...prev,
            cctv: clamp(prev.cctv + (target === WIRE_TARGETS[selectedWire] ? 4 : -5), 0, 100)
        }));
        bumpActivity();
    };

    const tweakKnob = (knob: keyof typeof panelKnobs, value: number) => {
        if (!controlsEnabled) return;
        setPanelKnobs((prev) => ({ ...prev, [knob]: value }));
        bumpActivity();
    };

    const mixtureReady = (Object.keys(mixture) as Array<keyof MixtureState>).every((key) => {
        const [min, max] = targetBands[key];
        return mixture[key] >= min && mixture[key] <= max;
    });
    const honeyReady = HONEY_TARGETS.every((id) => honeyActivated.includes(id));
    const wiresReady = Object.entries(WIRE_TARGETS).every(([wire, target]) => wireConnect[wire as keyof typeof wireConnect] === target);
    const enoughActivity = activityCount >= ACTIVITY_THRESHOLD;

    const canTriggerAlarm = isPhaseUnlocked && mixtureReady && honeyReady && wiresReady && enoughActivity;

    const readinessText = useMemo(() => {
        if (!isPhaseUnlocked) return "KI-Freigabe ausstehend.";
        if (!mixtureReady) return "Regler in der Mischkammer müssen in den markierten Zielbereich.";
        if (!honeyReady) return "Noch nicht alle Ziel-Waben wurden aktiviert.";
        if (!wiresReady) return "Verdrahtung ist unvollständig oder falsch.";
        if (!enoughActivity) return "Bitte noch etwas mit den Reglern und Modulen interagieren.";
        return "System bereit. Alarmsequenz kann gestartet werden.";
    }, [isPhaseUnlocked, mixtureReady, honeyReady, wiresReady, enoughActivity]);

    const triggerAlarm = () => {
        if (!controlsEnabled || !canTriggerAlarm) return;
        setShowAlarm(true);
    };

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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    ❌ {error}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-2">Phase 1 · Routinebetrieb</p>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Operator-Spielkonsole</h2>
                    <p className="text-sm text-slate-600">
                        Mini-Spiele im Among-Us-Stil: klar markierte Zielzonen, bunte Interaktion und live reagierende Systemwerte.
                    </p>
                </div>

                {!isPhaseUnlocked && (
                    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
                        KI-Freigabe ausstehend. Danach sind die Spiele aktiv.
                    </div>
                )}

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 mb-4">
                    {[
                        { label: "Druck", value: systemStats.pressure },
                        { label: "Belüftung", value: systemStats.ventilation },
                        { label: "Netzwerk", value: systemStats.network },
                        { label: "Stabilität", value: systemStats.stability },
                        { label: "Anomalie", value: 100 - systemStats.anomaly }
                    ].map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                            <p className="text-xl font-black text-slate-900 mb-2">{kpi.value}%</p>
                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div className={`h-full ${scaleColor(kpi.value)} transition-all duration-300`} style={{ width: `${kpi.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_0.9fr]">
                    <section className={`rounded-xl border p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-100/70 opacity-70"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-slate-800">1) Mischkammer</p>
                            <p className="text-xs text-slate-500">{mixtureReady ? "Ziel erreicht" : "Regler einstellen"}</p>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Ziehe jeden Regler in den farbig markierten Zielbereich.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(Object.keys(mixture) as Array<keyof MixtureState>).map((key) => {
                                const [targetMin, targetMax] = targetBands[key];
                                const value = mixture[key];
                                const inTarget = value >= targetMin && value <= targetMax;
                                return (
                                    <div key={key} className={`rounded-lg border p-2 ${inTarget ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                                        <div className="relative h-40 rounded-md border border-slate-200 bg-sky-100/40 p-2 flex flex-col justify-end">
                                            <div
                                                className="absolute left-2 right-2 rounded border border-emerald-400/70 bg-emerald-300/20"
                                                style={{ bottom: `${targetMin}%`, height: `${targetMax - targetMin}%` }}
                                            />
                                            <div className={`relative z-10 w-full rounded-sm ${colorStyles[key]} transition-all`} style={{ height: `${value}%` }} />
                                        </div>
                                        <p className="mt-2 text-xs font-bold uppercase text-slate-700">{key}</p>
                                        <p className="text-[11px] text-slate-500">Ziel: {targetMin}-{targetMax}</p>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={value}
                                            disabled={!controlsEnabled}
                                            onChange={(e) => setMixtureValue(key, Number(e.target.value))}
                                            className="w-full mt-1 accent-sky-600"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-100/70 opacity-70"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-slate-800">2) Waben-Freischaltung</p>
                            <p className="text-xs text-slate-500">{honeyActivated.length}/{HONEY_TARGETS.length} Zielwaben</p>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Aktiviere die markierten Waben: {HONEY_TARGETS.join(", ")}</p>

                        <div className="grid grid-cols-4 gap-2">
                            {["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "D3", "E2"].map((cell) => {
                                const active = honeyActivated.includes(cell);
                                const isTarget = HONEY_TARGETS.includes(cell);
                                return (
                                    <button
                                        key={cell}
                                        onClick={() => toggleHoneyCell(cell)}
                                        disabled={!controlsEnabled}
                                        className={`h-14 rounded-xl border font-bold text-xs transition ${
                                            active
                                                ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                                                : isTarget
                                                    ? "border-amber-300 bg-amber-100 text-amber-800"
                                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        } disabled:opacity-50`}
                                    >
                                        {cell}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className={`rounded-xl border p-4 ${controlsEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-100/70 opacity-70"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-slate-800">3) Verdrahtung + Panel</p>
                            <p className="text-xs text-slate-500">{wiresReady ? "Verdrahtung korrekt" : "Verdrahtung offen"}</p>
                        </div>

                        <div className="space-y-2 mb-3">
                            {(["red", "blue", "green"] as const).map((wire) => (
                                <div key={wire} className="flex items-center gap-2">
                                    <button
                                        onClick={() => startWirePick(wire)}
                                        disabled={!controlsEnabled}
                                        className={`px-3 py-1.5 rounded border text-xs font-bold ${
                                            wire === "red"
                                                ? "bg-rose-100 border-rose-300 text-rose-800"
                                                : wire === "blue"
                                                    ? "bg-sky-100 border-sky-300 text-sky-800"
                                                    : "bg-emerald-100 border-emerald-300 text-emerald-800"
                                        } ${selectedWire === wire ? "ring-2 ring-slate-400" : ""}`}
                                    >
                                        {wire.toUpperCase()}
                                    </button>
                                    <span className="text-xs text-slate-500">→</span>
                                    <span className="text-xs font-semibold text-slate-700">{wireConnect[wire] ?? "?"}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {(["R", "B", "G"] as const).map((target) => (
                                <button
                                    key={target}
                                    onClick={() => connectWire(target)}
                                    disabled={!controlsEnabled || !selectedWire}
                                    className="rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold py-2 disabled:opacity-50"
                                >
                                    Port {target}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {(Object.keys(panelKnobs) as Array<keyof typeof panelKnobs>).map((knob) => (
                                <label key={knob} className="block rounded border border-slate-200 bg-slate-50 p-2">
                                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                                        <span>{knob.toUpperCase()}</span>
                                        <span>{panelKnobs[knob]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={panelKnobs[knob]}
                                        disabled={!controlsEnabled}
                                        onChange={(e) => tweakKnob(knob, Number(e.target.value))}
                                        className="w-full accent-violet-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="hidden 2xl:block mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Erweiterte Telemetrie (FullHD+)</p>
                    <div className="grid grid-cols-6 gap-2 text-xs">
                        {Array.from({ length: 54 }).map((_, idx) => {
                            const value = clamp(30 + ((idx * 13 + activityCount * 5) % 70), 0, 100);
                            return (
                                <div key={idx} className="rounded border border-slate-200 bg-slate-50 p-2">
                                    <p className="font-semibold text-slate-700 mb-1">CH-{idx + 1}</p>
                                    <div className="h-1.5 rounded bg-slate-200 overflow-hidden">
                                        <div className={`h-full ${scaleColor(value)}`} style={{ width: `${value}%` }} />
                                    </div>
                                    <p className="mt-1 text-slate-500">{value}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs sm:text-sm text-slate-600">{readinessText} · Aktivität {activityCount}/{ACTIVITY_THRESHOLD}</p>
                    <button
                        onClick={triggerAlarm}
                        disabled={!controlsEnabled || !canTriggerAlarm}
                        className="w-full sm:w-auto rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-2.5 px-4 disabled:opacity-40"
                    >
                        Alarmprozedur auslösen
                    </button>
                </div>
            </div>

            {showAlarm && (
                <div className="fixed inset-0 z-50 bg-red-950/92 border-4 border-red-400 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl rounded-2xl border border-red-300 bg-[#12070b] p-5 sm:p-8 text-red-100 shadow-[0_0_40px_rgba(248,113,113,0.35)]">
                        <p className="text-xs uppercase tracking-[0.25em] text-red-300 mb-3">Systemmeldung — Warning</p>
                        <h3 className="text-2xl sm:text-3xl font-black mb-3">Achtung — Grenzwertüberschreitung festgestellt</h3>
                        <p className="text-sm sm:text-base leading-relaxed mb-5">
                            Anstieg entzündlicher Gase in Level 4. Kohlenstaubkonzentration kritisch. Lüftung nahe Auslastungsgrenze.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 mb-5 text-sm">
                            <div className="rounded-lg border border-red-300/40 bg-red-900/20 p-3">CH4: 4.6% (LEL 5%)</div>
                            <div className="rounded-lg border border-red-300/40 bg-red-900/20 p-3">Vent-Last: 82% → 85%</div>
                            <div className="rounded-lg border border-red-300/40 bg-red-900/20 p-3">Druckabfall: +17%</div>
                            <div className="rounded-lg border border-red-300/40 bg-red-900/20 p-3">Sensor L4-03: 3 Anomalien</div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleStartAlarmPhase}
                                disabled={isLoadingAlert}
                                className="rounded-lg border border-amber-300 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-bold py-2.5 px-4 disabled:opacity-50"
                            >
                                {isLoadingAlert ? "Lade..." : "Alarmprozedur starten"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
