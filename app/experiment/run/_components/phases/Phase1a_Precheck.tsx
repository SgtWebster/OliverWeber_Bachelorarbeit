"use client";

import { useMemo, useState } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

type SystemStats = {
    pressure: number;
    ventilation: number;
    gasIndex: number;
    energy: number;
    jitter: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const scaleColor = (value: number, warningAt: number) => {
    if (value >= warningAt + 8) return "bg-emerald-500";
    if (value >= warningAt - 3) return "bg-amber-500";
    return "bg-rose-500";
};

export default function Phase1aPrecheck() {
    const { sessionId, setPhase, socialAdherenceScore } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [stats, setStats] = useState<SystemStats>({
        pressure: 74,
        ventilation: 69,
        gasIndex: 61,
        energy: 81,
        jitter: 22
    });

    const [fanBoost, setFanBoost] = useState(55);
    const [opsCount, setOpsCount] = useState(0);
    const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({
        "L4-SENSOR": true,
        "VENT-PATH-B": false,
        "RIG-DELTA": true,
        "AUX-PUMP": false,
        "MESH-LINK": true,
        "LOG-BRIDGE": false
    });

    const [eventFeed, setEventFeed] = useState<string[]>([
        "[OK] Lüftung stabil",
        "[INFO] CH4 steigt leicht",
        "[INFO] L4-03 Signaljitter ~3%"
    ]);

    const pushEvent = (entry: string) => {
        setEventFeed((prev) => [entry, ...prev].slice(0, 9));
    };

    const mutateStats = (changes: Partial<SystemStats>, eventText: string) => {
        setStats((prev) => ({
            pressure: clamp((changes.pressure ?? prev.pressure), 0, 100),
            ventilation: clamp((changes.ventilation ?? prev.ventilation), 0, 100),
            gasIndex: clamp((changes.gasIndex ?? prev.gasIndex), 0, 100),
            energy: clamp((changes.energy ?? prev.energy), 0, 100),
            jitter: clamp((changes.jitter ?? prev.jitter), 0, 100)
        }));
        setOpsCount((prev) => prev + 1);
        pushEvent(eventText);
    };

    const triggerToyAction = (action: "flush" | "pump" | "ping" | "scramble") => {
        if (action === "flush") {
            mutateStats(
                {
                    ventilation: stats.ventilation + 4,
                    gasIndex: stats.gasIndex + 3,
                    energy: stats.energy - 2,
                    jitter: stats.jitter + 2
                },
                "[OPS] Filter-Spülung ausgelöst"
            );
            return;
        }

        if (action === "pump") {
            mutateStats(
                {
                    pressure: stats.pressure + 4,
                    ventilation: stats.ventilation - 3,
                    gasIndex: stats.gasIndex - 2,
                    energy: stats.energy - 5
                },
                "[OPS] Puls-Pumpe getaktet"
            );
            return;
        }

        if (action === "ping") {
            mutateStats(
                {
                    jitter: stats.jitter - 6,
                    energy: stats.energy - 1
                },
                "[OPS] Diagnose-Ping gesendet"
            );
            return;
        }

        mutateStats(
            {
                pressure: stats.pressure + (Math.random() > 0.5 ? 3 : -3),
                ventilation: stats.ventilation + (Math.random() > 0.5 ? 4 : -4),
                gasIndex: stats.gasIndex + (Math.random() > 0.5 ? 2 : -2),
                jitter: stats.jitter + (Math.random() > 0.5 ? 5 : -5)
            },
            "[OPS] Zufallscheck ausgeführt"
        );
    };

    const toggleModule = (moduleName: string) => {
        setModuleStates((prev) => {
            const nextValue = !prev[moduleName];
            mutateStats(
                {
                    pressure: stats.pressure + (nextValue ? 1 : -1),
                    ventilation: stats.ventilation + (nextValue ? 2 : -2),
                    gasIndex: stats.gasIndex + (nextValue ? 1 : -1),
                    jitter: stats.jitter + (nextValue ? 1 : -2)
                },
                `[MOD] ${moduleName} ${nextValue ? "aktiviert" : "deaktiviert"}`
            );
            return { ...prev, [moduleName]: nextValue };
        });
    };

    const handleFanBoost = (value: number) => {
        setFanBoost(value);
        mutateStats(
            {
                ventilation: value,
                pressure: clamp(70 + (value - 55) * 0.2, 0, 100),
                energy: clamp(stats.energy - 1 + (value < 45 ? 2 : -1), 0, 100)
            },
            `[CTRL] Lüfterboost auf ${value}% gesetzt`
        );
    };

    const kpiCards = useMemo(
        () => [
            { label: "Druckstabilität", value: stats.pressure, warningAt: 70 },
            { label: "Belüftung", value: stats.ventilation, warningAt: 68 },
            { label: "Gasindex", value: stats.gasIndex, warningAt: 63 },
            { label: "Energie", value: stats.energy, warningAt: 75 },
            { label: "Signalrauschen", value: 100 - stats.jitter, warningAt: 66 }
        ],
        [stats]
    );

    const handleStartRoutine = async () => {
        if (!sessionId || isLoading) return;
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    ❌ {error}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-2">Allgemeines Operator Dashboard</p>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Systemübersicht</h2>
                    {/*<p className="text-sm text-slate-600">*/}
                    {/*    Viele Anzeigen sind absichtlich überladen. Jede Aktion verändert Werte und Event-Logs.*/}
                    {/*</p>*/}
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
                    {kpiCards.map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                            <p className="text-2xl font-black text-slate-900 mb-2">{Math.round(kpi.value)}%</p>
                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className={`h-full ${scaleColor(kpi.value, kpi.warningAt)} transition-all duration-300`}
                                    style={{ width: `${kpi.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                    <section className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-slate-800">Interaktive Kontrollmodule</p>
                            <p className="text-xs text-slate-500">Aktionen: {opsCount}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 mb-3">
                            <button onClick={() => triggerToyAction("flush")} className="rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-800">
                                Filter spülen
                            </button>
                            <button onClick={() => triggerToyAction("pump")} className="rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">
                                Pumpe takten
                            </button>
                            <button onClick={() => triggerToyAction("ping")} className="rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-2 text-sm font-semibold text-violet-800">
                                Diagnose-Ping
                            </button>
                            <button onClick={() => triggerToyAction("scramble")} className="rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800">
                                Zufallscheck
                            </button>
                        </div>

                        <label className="block rounded-lg border border-slate-200 p-3 bg-slate-50 mb-3">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Lüfterboost</span>
                                <span>{fanBoost}%</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={90}
                                value={fanBoost}
                                onChange={(e) => handleFanBoost(Number(e.target.value))}
                                className="w-full accent-sky-600"
                            />
                        </label>

                        <div className="grid sm:grid-cols-2 gap-2">
                            {Object.entries(moduleStates).map(([moduleName, active]) => (
                                <button
                                    key={moduleName}
                                    onClick={() => toggleModule(moduleName)}
                                    className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                                        active
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {moduleName} · {active ? "ON" : "OFF"}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <p className="font-bold text-slate-800 mb-3">Ereignis-Feed</p>
                        <div className="space-y-1.5 font-mono text-xs text-slate-700">
                            {eventFeed.map((line, index) => (
                                <p key={`${line}_${index}`}>{line}</p>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="hidden 2xl:block mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Erweiterte Leitstandmatrix (FullHD+)</p>
                    <div className="grid grid-cols-6 gap-2 text-xs">
                        {Array.from({ length: 42 }).map((_, idx) => (
                            <div key={idx} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 flex justify-between">
                                <span>MOD-{idx + 1}</span>
                                <span className={idx % 5 === 0 ? "text-amber-700" : "text-emerald-700"}>
                                    {idx % 5 === 0 ? "WARN" : "OK"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <p className="text-xs sm:text-sm text-slate-600">
                        Wenn du bereit bist, wechsle in den Kontrollraum.
                    </p>
                    <button
                        onClick={handleStartRoutine}
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 disabled:opacity-50"
                    >
                        {isLoading ? "Lade..." : "Routine starten"}
                    </button>
                </div>
            </div>
        </div>
    );
}
