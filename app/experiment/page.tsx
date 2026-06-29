// app/experiment/page.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { createExperimentSession, updateExperimentSession } from "@/app/lib/api/client";

const NEXT_STEP_PATH = "/experiment/run"; // <-- Gefixt!
const CONSENT_STORAGE_KEY = "bachelorarbeit-consent-v1";
const CONTACT_EMAIL = "o.weber@mci4me.at";

type ConsentState = {
    informationRead: boolean;
    sensitiveContent: boolean;
};

type InfoSectionProps = {
    title: string;
    children: ReactNode;
};

function InlineInfoTooltip({ text }: { text: string }) {
    return (
        <span className="group relative inline-flex items-center align-middle">
            <span
                tabIndex={0}
                aria-label="Information zu KI-System"
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[10px] font-semibold leading-none text-slate-700 cursor-help"
            >
                i
            </span>
            <span
                role="tooltip"
                className="pointer-events-none invisible absolute left-0 top-full z-10 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-none border border-slate-300 bg-white p-3 text-xs font-normal leading-relaxed text-slate-700 opacity-0 shadow-[0_14px_28px_rgba(15,23,42,0.14)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 sm:left-1/2 sm:-translate-x-1/2 sm:w-80"
            >
                {text}
            </span>
        </span>
    );
}

function InfoSection({ title, children }: InfoSectionProps) {
    return (
        <section className="border border-slate-300 rounded-none bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">{title}</h2>
            <div className="mt-3 space-y-3 text-slate-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
}

function ConsentCheckbox({
                             id,
                             checked,
                             onChange,
                             children,
                         }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}) {
    return (
        <label
            htmlFor={id}
            className="flex cursor-pointer gap-3 rounded-none border border-slate-300 bg-slate-50 p-4 text-left transition-colors hover:border-slate-400 hover:bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2"
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-400 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <span className="text-sm leading-relaxed text-slate-800">
                {children}
            </span>
        </label>
    );
}

export default function BachelorarbeitConsentPage() {
    const router = useRouter();
    const { setGroup, setConsented, setSessionId, setPhase, resetSocialAdherence } = useExperimentStore();


    const [consent, setConsent] = useState<ConsentState>({
        informationRead: false,
        sensitiveContent: false,
    });
    const [isQuickSurveyPathEnabled, setIsQuickSurveyPathEnabled] = useState(false);
    const [devStartLoadingGroup, setDevStartLoadingGroup] = useState<"AVATAR" | "TERMINAL" | null>(null);

    const canStart = consent.informationRead && consent.sensitiveContent;

    function updateConsent(key: keyof ConsentState, value: boolean) {
        setConsent((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function handleStartExperiment() {
        if (!canStart) return;

        try {
            setConsented(true); // Türsteher-Badge vergeben
            router.push('/experiment/run');

            window.localStorage.setItem(
                CONSENT_STORAGE_KEY,
                JSON.stringify({
                    accepted: true,
                    acceptedAt: new Date().toISOString(),
                    version: "2026-06-01-reduced",
                }),
            );
        } catch {
            // Fallback bei blockiertem localStorage
        }

        // Bei regulärem Start NICHTS setzen, run/page.tsx übernimmt die Zufallsauslosung!
        router.push(NEXT_STEP_PATH);
    }

    function generateSessionId() {
        if (typeof window !== "undefined" && window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        return `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    }

    // 🚀 DIE CHEAT-FUNKTION
    async function handleCheatStart(condition: 'AVATAR' | 'TERMINAL') {
        setGroup(condition);
        setConsented(true);

        if (!isQuickSurveyPathEnabled) {
            router.push(NEXT_STEP_PATH);
            return;
        }

        setDevStartLoadingGroup(condition);
        resetSocialAdherence();

        const generatedId = generateSessionId();

        try {
            const createSessionResult = await createExperimentSession(generatedId, condition);
            if (!createSessionResult.success) {
                throw new Error(createSessionResult.error || "Session konnte nicht erstellt werden.");
            }

            const quickpathUpdateResult = await updateExperimentSession(generatedId, {
                currentPhase: "SURVEY",
                socialAdherence: 0,
                compliance: 0
            });

            if (!quickpathUpdateResult.success) {
                throw new Error(quickpathUpdateResult.error || "Quickpath-Werte konnten nicht gesetzt werden.");
            }

            setSessionId(generatedId);
            setPhase("SURVEY");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unbekannter Fehler";
            window.alert(`Quickpath fehlgeschlagen: ${message}`);
            setDevStartLoadingGroup(null);
            return;
        }

        setDevStartLoadingGroup(null);
        router.push(NEXT_STEP_PATH);
    }

    return (
        <main
            id="main-content"
            className="min-h-[100dvh] bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-4xl space-y-6">
                <header className="rounded-none border border-slate-300 bg-white px-6 py-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:px-8 sm:py-9">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Informationsblatt und Einwilligungserklärung
                    </p>

                    <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                        Teilnahme an einer wissenschaftlichen Online-Studie
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                        Vielen Dank für dein Interesse. Diese Studie findet im Rahmen meiner Bachelorarbeit im Studiengang Digital Business & Software Engineering am MCI statt. Die Teilnahme ist natürlich völlig freiwillig und startet erst nach deiner aktiven Zustimmung am Ende der Seite.
                    </p>

                    <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
                        <div className="border border-slate-200 bg-slate-50 p-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Verantwortlich</dt>
                            <dd className="mt-1 text-slate-600">Oliver Weber</dd>
                        </div>
                        <div className="border border-slate-200 bg-slate-50 p-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Kontakt</dt>
                            <dd className="mt-1">
                                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                    {CONTACT_EMAIL}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </header>

                <div className="grid gap-3 rounded-none border border-slate-300 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm sm:grid-cols-3">
                    <span className="flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-2">⏱️ ca. 10–15 Min.</span>
                    <span className="flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-2">🔒 Anonym & Freiwillig</span>
                    <span className="flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-2">↩️ Jederzeit abbrechbar</span>
                </div>

                <div className="rounded-none border border-amber-300 border-l-4 bg-amber-50 p-5 text-amber-900 shadow-sm">
                    <h2 className="flex items-center gap-2 text-base font-bold">
                        ⚠️ Wichtiger Hinweis zu den Inhalten ("Triggerwarnung")
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed">
                        In diesem Experiment wirst du mit einer moralischen Entscheidungssituation konfrontiert, die unter Umständen als psychisch belastend empfunden werden kann. Wenn du dich unwohl fühlst, kannst du die Teilnahme jederzeit und kommentarlos abbrechen.
                    </p>
                </div>

                <div className="space-y-4">
                    <InfoSection title="1. Ziel und Ablauf">
                        <p>
                            In dieser Studie (Dauer ca. <strong>10-15 Minuten</strong>) nimmst du an einem <strong>interaktiven Szenario</strong> teil, bei dem du Unterstützung von einem <strong>KI-System</strong><InlineInfoTooltip text='Eine KI (Künstliche Intelligenz) ist ein computergestütztes System, das Muster erkennt und auf Basis gelernter Beispiele Hinweise oder Antworten geben kann. Im Experiment meint „KI-System“ die digitale Unterstützung, die dir im Szenario Entscheidungshilfen gibt.' /> erhältst. Wir untersuchen dabei die Interaktion mit dem System und die Entscheidungen, die du triffst.
                        </p>
                        <p>
                            Um deine Entscheidungen nicht zu beeinflussen, erfolgt die vollständige Aufklärung über den genauen Untersuchungszweck erst im letzten Teil der Studie.
                        </p>
                    </InfoSection>

                    <InfoSection title="2. Freiwilligkeit und Abbruch">
                        <p>
                            Die Teilnahme ist komplett freiwillig. Du kannst das Experiment <strong>jederzeit</strong> ohne Angabe von Gründen <strong>abbrechen</strong> (z.B. durch Schließen des Browserfensters).
                        </p>
                    </InfoSection>

                    <InfoSection title="3. Datenschutz und Anonymität">
                        <p>
                            <strong>Alles ist anonym!</strong> Es werden keine direkten Identifikationsdaten (wie Name oder Telefonnummer) erhoben. Alle Daten werden ausschließlich für wissenschaftliche Zwecke aggregiert ausgewertet, sicher gespeichert und spätestens 12 Monate nach Beurteilung der Arbeit gelöscht.
                        </p>
                        <p>
                            Die Teilnahme am optionalen <strong>Gewinnspiel</strong> (Amazon Gutscheine als "Dankeschön") erfolgt am Ende über ein separates Formular, das keinerlei Verbindung zu deinen Studiendaten hat. Deine E-Mail-Adresse wird ausschließlich für die Kontaktaufnahme im Gewinnfall verwendet und danach umgehend gelöscht.
                        </p>
                    </InfoSection>

                    <InfoSection title="4. Durchführung">
                        <p>
                            Idealerweise solltest du das Experiment nach Möglichkeit an einem <strong>Desktop-PC bzw. Laptop</strong> durchführen, dennoch ist die Teilnahme auch über ein Smartphone möglich. Wichtig ist nur, dass du eine stabile Internetverbindung hast und dich in einer ruhigen Umgebung befindest, in der du dich auf das Szenario konzentrieren kannst.
                        </p>
                    </InfoSection>
                </div>

                <section className="rounded-none border border-slate-300 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900">Einwilligung zur Teilnahme</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Bitte bestätige die folgenden Punkte, um an der Studie teilzunehmen.
                    </p>

                    <fieldset className="mt-6 space-y-3">
                        <ConsentCheckbox id="information-read" checked={consent.informationRead} onChange={(c) => updateConsent("informationRead", c)}>
                            Ich habe die Informationen gelesen und verstanden.
                        </ConsentCheckbox>
                        <ConsentCheckbox id="sensitive-content" checked={consent.sensitiveContent} onChange={(c) => updateConsent("sensitiveContent", c)}>
                            Ich bestätige, dass ich mindestens 18 Jahre alt bin.
                        </ConsentCheckbox>
                    </fieldset>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <button type="button" onClick={() => router.push("/")} className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                            Nicht teilnehmen
                        </button>
                        <button type="button" onClick={handleStartExperiment} disabled={!canStart} className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors">
                            Ich stimme zu und möchte teilnehmen
                        </button>
                    </div>
                </section>

                {/* 🚨 DEV CHEAT BUTTONS (Werden in PROD ignoriert) 🚨 */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-12 rounded-none border-2 border-red-500 bg-red-50 p-6 shadow-sm">
                        <h3 className="text-red-800 font-bold tracking-widest text-xs uppercase mb-4">Developer Controls (Einverständniserklärung überspringen, Variante wählen, statt Zufallszulosung)</h3>
                        <label
                            htmlFor="quick-survey-path"
                            className="mb-4 flex cursor-pointer items-center gap-3 border border-red-200 bg-white px-3 py-2 text-sm text-red-900"
                        >
                            <input
                                id="quick-survey-path"
                                type="checkbox"
                                checked={isQuickSurveyPathEnabled}
                                onChange={(event) => setIsQuickSurveyPathEnabled(event.target.checked)}
                                className="h-4 w-4 cursor-pointer border-red-300 text-red-700 focus:ring-red-500"
                            />
                            <span className="font-semibold">Fragebogen Tests (Quickpath)</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handleCheatStart('AVATAR')}
                                disabled={devStartLoadingGroup !== null}
                                className="flex-1 border-2 border-red-300 bg-white py-2 font-bold text-red-700 hover:bg-red-100"
                            >
                                {devStartLoadingGroup === "AVATAR"
                                    ? "Initialisiere AVATAR..."
                                    : `⏩ Mit Variante AVATAR starten${isQuickSurveyPathEnabled ? " (zum Fragebogen)" : ""}`}
                            </button>
                            <button
                                onClick={() => handleCheatStart('TERMINAL')}
                                disabled={devStartLoadingGroup !== null}
                                className="flex-1 border-2 border-red-300 bg-white py-2 font-bold text-red-700 hover:bg-red-100"
                            >
                                {devStartLoadingGroup === "TERMINAL"
                                    ? "Initialisiere TERMINAL..."
                                    : `⏩ Mit Variante TERMINAL starten${isQuickSurveyPathEnabled ? " (zum Fragebogen)" : ""}`}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
