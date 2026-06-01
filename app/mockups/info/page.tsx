// (main)/bachelorarbeit/page.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STEP_PATH = "/bachelorarbeit";
const CONSENT_STORAGE_KEY = "bachelorarbeit-consent-v1";
const CONTACT_EMAIL = "o.weber@mci4me.at";

type ConsentState = {
    ageAndLanguage: boolean;
    informationRead: boolean;
    voluntaryParticipation: boolean;
    sensitiveContent: boolean;
};

type InfoSectionProps = {
    title: string;
    children: ReactNode;
};

function InfoSection({ title, children }: InfoSectionProps) {
    return (
        <section className="border border-slate-200 rounded-lg p-5 bg-white">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <div className="mt-3 text-slate-700 leading-relaxed space-y-3">
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
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left cursor-pointer hover:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2"
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-400 text-slate-900 focus:ring-slate-900"
            />
            <span className="text-sm leading-relaxed text-slate-800">
                {children}
            </span>
        </label>
    );
}

export default function BachelorarbeitConsentPage() {
    const router = useRouter();

    const [consent, setConsent] = useState<ConsentState>({
        ageAndLanguage: false,
        informationRead: false,
        voluntaryParticipation: false,
        sensitiveContent: false,
    });

    const canStart =
        // consent.ageAndLanguage &&
        consent.informationRead &&
        // consent.voluntaryParticipation &&
        consent.sensitiveContent;

    function updateConsent(key: keyof ConsentState, value: boolean) {
        setConsent((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function handleStartExperiment() {
        if (!canStart) {
            return;
        }

        try {
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

        router.push(NEXT_STEP_PATH);
    }

    return (
        <main
            id="main-content"
            className="min-h-screen bg-slate-50 px-4 py-1 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-4xl">
                <header className="rounded-lg border-2 border-slate-900 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                        Informationsblatt und Einwilligungserklärung
                    </p>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Teilnahme an einer wissenschaftlichen Online-Studie
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
                        Vielen Dank für dein Interesse. Diese Studie findet im Rahmen meiner Bachelorarbeit im Studiengang Digital Business & Software Engineering am MCI statt. Die Teilnahme ist freiwillig und startet erst nach deiner aktiven Zustimmung am Ende der Seite.
                    </p>

                    <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
                        {/*<div>*/}
                        {/*    <dt className="font-semibold text-slate-900">Arbeitstitel</dt>*/}
                        {/*    <dd className="mt-1 text-slate-700">*/}
                        {/*        Die maschinelle Seele: Anthropomorphismus als Vertrauenstreiber in der Mensch-KI-Interaktion*/}
                        {/*    </dd>*/}
                        {/*</div>*/}
                        <div>
                            <dt className="font-semibold text-slate-900">Verantwortlich</dt>
                            <dd className="mt-1 text-slate-700">Oliver Weber</dd>
                        </div>
                        {/*<div>*/}
                        {/*    <dt className="font-semibold text-slate-900">Betreuung</dt>*/}
                        {/*    <dd className="mt-1 text-slate-700">FH-Prof. Dr. Stephan Schlögl</dd>*/}
                        {/*</div>*/}
                        <div>
                            <dt className="font-semibold text-slate-900">Kontakt</dt>
                            <dd className="mt-1">
                                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-slate-900 underline">
                                    {CONTACT_EMAIL}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </header>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-xl bg-white border border-slate-200 p-4 text-sm font-semibold text-slate-700 shadow-sm">
                    <span className="flex items-center gap-1.5">⏱️ ca. 10–15 Min.</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">🔒 Anonym & Freiwillig</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">↩️ Jederzeit abbrechbar</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">🔣 Vollständig auf Deutsch</span>
                </div>

                <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-950">
                    <h2 className="text-base font-semibold">Wichtiger Hinweis zu den Inhalten</h2>
                    <p className="mt-2 text-sm leading-relaxed">
                        In diesem Experiment wirst du mit einer fiktiven moralischen Entscheidungssituation konfrontiert, die unter Umständen als psychisch belastend empfunden werden können. Wenn du dich unwohl fühlst, kannst du die Teilnahme jederzeit und kommentarlos abbrechen.
                    </p>
                </div>

                <div className="mt-6 space-y-5">
                    <InfoSection title="1. Ziel und Ablauf">
                        <p>
                            In dieser Studie (Dauer ca. 10-15 Minuten) nimmst du an einem interaktiven Szenario teil, bei dem du Unterstützung von einem KI-System erhältst. Wir untersuchen dabei die Interaktion mit dem System und deine Entscheidungen dabei, die du triffst.
                        </p>
                        <p>
                            Um deine Entscheidungen nicht zu beeinflussen, erfolgt die vollständige Aufklärung über den genauen Untersuchungszweck erst im letzten Teil der Studie.
                        </p>
                    </InfoSection>

                    <InfoSection title="2. Freiwilligkeit und Abbruch">
                        <p>
                            Die Teilnahme ist komplett freiwillig. Du kannst das Experiment jederzeit ohne Angabe von Gründen und ohne Nachteile abbrechen (z. B. durch Schließen des Browserfensters).
                        </p>
                    </InfoSection>

                    <InfoSection title="3. Datenschutz und Anonymität">
                        <p>
                            Es werden keine direkten Identifikationsdaten (wie Name oder Telefonnummer) erhoben. Jeder Datensatz erhält eine zufällige Session-ID. Alle Daten werden ausschließlich für wissenschaftliche Zwecke aggregiert ausgewertet, sicher gespeichert und spätestens 12 Monate nach Beurteilung der Arbeit gelöscht.
                        </p>
                    </InfoSection>
                </div>

                <section className="mt-8 rounded-lg border-2 border-slate-900 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900">Einwilligung zur Teilnahme</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        Bitte bestätige die folgenden Punkte, um an der Studie teilzunehmen.
                    </p>

                    <fieldset className="mt-6 space-y-3">
                        {/*<ConsentCheckbox id="age-and-language" checked={consent.ageAndLanguage} onChange={(c) => updateConsent("ageAndLanguage", c)}>*/}
                        {/*    Ich bin mindestens 18 Jahre alt und verstehe die deutschsprachigen Texte ausreichend.*/}
                        {/*</ConsentCheckbox>*/}
                        <ConsentCheckbox id="information-read" checked={consent.informationRead} onChange={(c) => updateConsent("informationRead", c)}>
                            Ich habe die Informationen gelesen und verstanden.
                        </ConsentCheckbox>
                        {/*<ConsentCheckbox id="voluntary-participation" checked={consent.voluntaryParticipation} onChange={(c) => updateConsent("voluntaryParticipation", c)}>*/}
                        {/*    Ich nehme freiwillig teil und weiß, dass ich jederzeit abbrechen kann.*/}
                        {/*</ConsentCheckbox>*/}
                        <ConsentCheckbox id="sensitive-content" checked={consent.sensitiveContent} onChange={(c) => updateConsent("sensitiveContent", c)}>
                            Ich bestätige, dass ich mindestens 18 Jahre alt bi.
                        </ConsentCheckbox>
                    </fieldset>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button type="button" onClick={() => router.push("/")} className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                            Nicht teilnehmen
                        </button>
                        <button type="button" onClick={handleStartExperiment} disabled={!canStart} className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-600">
                            Ich stimme zu und möchte teilnehmen
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}