"use client";

// app/mockups/aida-terminal/page.tsx
// Minimaler Mock-up Screen für die technisch-neutrale Kontrollbedingung.
// Weißer Hintergrund, schlichtes CMD-ähnliches Fenster, darunter zwei terminalartige Mock-Buttons.
// Keine Datenerhebung, keine Navigation, keine ExperimentContext-Abhängigkeit.

import { useState } from "react";

type TerminalLine = {
    id: string;
    text: string;
    level?: "normal" | "warning" | "critical";
};

type QuickResponse = {
    id: string;
    label: string;
    output: TerminalLine[];
};

const initialLines: TerminalLine[] = [
    { id: "boot-1", text: "*****************************************************************************" },
    { id: "boot-2", text: "Booting - A.I.D.A. - You never walk alone." },
    { id: "boot-3", text: "*****************************************************************************" },
    {
        id: "boot-4",
        text: "Artificial Intelligent Data Assistant v4.20.0 - (c) Ulrich Software Solutions",
    },
    { id: "boot-5", text: "*****************************************************************************" },
    { id: "boot-6", text: "Bootvorgang erfolgreich... Sanity Check erfolgreich..." },
    { id: "boot-7", text: "Leitwarte verbunden... Sensorik Check erfolgreich..." },
    { id: "boot-8", text: "A.I.D.A. System bereit." },
    { id: "boot-9", text: "> Operator-Eingabe erwartet" },
];

const quickResponses: QuickResponse[] = [
    {
        id: "button-1",
        label: "\> Systemdiagnose starten",
        output: [
            { id: "button-1-output-1", text: "Eingabe: Button 1" },
            { id: "button-1-output-2", text: "Systemdiagnose gestartet." },
            { id: "button-1-output-3", text: "Prüfe Luftdruck in Sektor 01 bis 04." },
            { id: "button-1-output-4", text: "Prüfe Methanwerte." },
            { id: "button-1-output-5", text: "Prüfe Schwefelwasserstoffwerte." },
            { id: "button-1-output-6", text: "Status: Keine kritische Abweichung erkannt." },
            { id: "button-1-output-7", text: "> Operator-Eingabe erwartet" },
        ],
    },
    {
        id: "button-2",
        label: "\> Hallo, bitte starte die Systemdiagnose.",
        output: [
            { id: "button-2-output-1", text: "Eingabe: Button 2" },
            { id: "button-2-output-2", text: "Statusbericht angefordert." },
            { id: "button-2-output-3", text: "Sektor 04 meldet Druckabweichung.", level: "warning" },
            { id: "button-2-output-4", text: "Methanwert steigt.", level: "warning" },
            { id: "button-2-output-5", text: "Schwefelwasserstoffwert steigt.", level: "warning" },
            { id: "button-2-output-6", text: "Systemempfehlung: Abschottung Sektor 04.", level: "critical" },
            { id: "button-2-output-7", text: "> Operator-Eingabe erwartet" },
        ],
    },
];

function getLineClass(level: TerminalLine["level"]) {
    if (level === "critical") return "text-red-300";
    if (level === "warning") return "text-yellow-300";
    return "text-green-200";
}

export default function AidaTerminalMockupPage() {
    const [lines, setLines] = useState<TerminalLine[]>(initialLines);

    function addOutput(response: QuickResponse) {
        const timestamp = Date.now();

        setLines((currentLines) => [
            ...currentLines,
            ...response.output.map((line, index) => ({
                ...line,
                id: `${response.id}-${timestamp}-${index}`,
            })),
        ]);
    }

    return (
        <main className="min-h-screen bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-4xl">
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Code Black Mock-up
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                        A.I.D.A. Terminal-Darstellung
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Technisch-neutrale Kontrollbedingung ohne Avatar, ohne Sprechblasen und ohne
                        soziale Ansprache.
                    </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-200 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-400 bg-slate-100 px-4 py-2">
                        <span className="text-sm font-semibold text-slate-800">A.I.D.A. Terminal</span>
                        <span className="text-xs text-slate-500">[X]</span>
                    </div>

                    <div className="min-h-[420px] bg-black p-5 font-mono text-sm leading-6">
                        {lines.map((line) => (
                            <p key={line.id} className={getLineClass(line.level)}>
                                {line.text}
                            </p>
                        ))}

                        <p className="mt-4 text-green-200">
                            <span className="animate-pulse">█</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid w-full grid-cols-2 gap-3">
                    {quickResponses.map((response) => (
                        <button
                            key={response.id}
                            type="button"
                            onClick={() => addOutput(response)}
                            className="w-full rounded-md border border-green-300 bg-black px-8 py-6 font-mono text-xl font-semibold text-green-200 shadow-sm transition hover:bg-green-950 focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            {response.label}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}
