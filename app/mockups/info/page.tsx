// (main)/bachelorarbeit/page.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STEP_PATH = "/bachelorarbeit/experiment";
const CONSENT_STORAGE_KEY = "bachelorarbeit-consent-v1";
const CONTACT_EMAIL = "oliver-weber@oliver-weber.at";

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
        consent.ageAndLanguage &&
        consent.informationRead &&
        consent.voluntaryParticipation &&
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
                    version: "2026-06-01-draft",
                }),
            );
        } catch {
            // Das Experiment soll auch funktionieren, wenn localStorage blockiert ist.
        }

        router.push(NEXT_STEP_PATH);
    }

    return (
        <main
            id="main-content"
            className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"
        >
            <a
                href="#consent-form"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:ring-2 focus:ring-slate-900"
            >
                Direkt zur Einwilligung springen
            </a>

            <div className="mx-auto max-w-4xl">
                <header className="rounded-lg border-2 border-slate-900 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                        Informationsblatt und Einwilligungserklärung
                    </p>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Teilnahme an einer wissenschaftlichen Online-Studie
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
                        Vielen Dank für dein Interesse an dieser Studie im Rahmen einer
                        Bachelorarbeit im Studiengang Digital Business & Software
                        Engineering am MCI. Bitte lies die folgenden Informationen
                        sorgfältig durch. Die Teilnahme ist freiwillig und startet erst,
                        wenn du am Ende dieser Seite aktiv zustimmst.
                    </p>

                    <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="font-semibold text-slate-900">
                                Arbeitstitel
                            </dt>
                            <dd className="mt-1 text-slate-700">
                                Die maschinelle Seele: Anthropomorphismus als
                                Vertrauenstreiber in der Mensch-KI-Interaktion
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900">
                                Verantwortlich
                            </dt>
                            <dd className="mt-1 text-slate-700">
                                Oliver Weber, Bachelorstudium Digital Business &
                                Software Engineering, MCI
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900">
                                Betreuung
                            </dt>
                            <dd className="mt-1 text-slate-700">
                                FH-Prof. Dr. Stephan Schlögl
                            </dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-slate-900">
                                Kontakt
                            </dt>
                            <dd className="mt-1">
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </header>

                <div
                    role="note"
                    aria-label="Wichtiger Hinweis vor Beginn der Studie"
                    className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-950"
                >
                    <h2 className="text-base font-semibold">
                        Wichtiger Hinweis vor Beginn
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed">
                        In der Studie wird ein fiktives Notfallszenario dargestellt.
                        Es kann moralisch belastende Entscheidungssituationen mit
                        fiktiven Todesfolgen enthalten. Es werden keine realen
                        Personen dargestellt, es gibt keine grafische Gewaltdarstellung
                        und du kannst die Teilnahme jederzeit ohne Angabe von Gründen
                        abbrechen.
                    </p>
                </div>

                <div className="mt-6 space-y-5">
                    <InfoSection title="1. Ziel der Studie">
                        <p>
                            Die Studie untersucht, wie Menschen KI-Assistenzsysteme in
                            Entscheidungssituationen wahrnehmen. Dabei interessiert
                            insbesondere, wie Vertrauen, Akzeptanz und das Verhalten
                            gegenüber einem digitalen Assistenzsystem entstehen.
                        </p>
                        <p>
                            Einzelne Details des genauen Untersuchungszwecks werden
                            erst nach Abschluss der Studie im Debriefing vollständig
                            erklärt. Das ist notwendig, damit die Antworten und
                            Entscheidungen während des Experiments möglichst
                            unbeeinflusst bleiben.
                        </p>
                    </InfoSection>

                    <InfoSection title="2. Ablauf der Teilnahme">
                        <ol className="list-decimal space-y-2 pl-5">
                            <li>
                                Du liest diese Informationsseite und gibst deine
                                digitale Einwilligung.
                            </li>
                            <li>
                                Du wirst in ein kurzes fiktives Szenario eingeführt.
                            </li>
                            <li>
                                Du interagierst mit einem simulierten KI-Assistenzsystem.
                            </li>
                            <li>
                                Du triffst innerhalb des Szenarios eine Entscheidung.
                            </li>
                            <li>
                                Danach beantwortest du einige Fragen zur Wahrnehmung des
                                Systems.
                            </li>
                            <li>
                                Am Ende erhältst du ein Debriefing, das den tatsächlichen
                                Zweck der Studie erklärt.
                            </li>
                        </ol>
                        <p>
                            Die Teilnahme dauert voraussichtlich etwa 10 bis 15 Minuten.
                            Die Studie kann auf einem Computer, Tablet oder Smartphone
                            durchgeführt werden. Für eine bessere Lesbarkeit wird ein
                            Gerät mit größerem Bildschirm empfohlen.
                        </p>
                    </InfoSection>

                    <InfoSection title="3. Wer kann teilnehmen?">
                        <ul className="list-disc space-y-2 pl-5">
                            <li>Du bist mindestens 18 Jahre alt.</li>
                            <li>
                                Du verfügst über ausreichende Deutschkenntnisse, um die
                                Szenariotexte und Fragen gut zu verstehen.
                            </li>
                            <li>
                                Spezifische IT-, KI- oder Gaming-Vorkenntnisse sind nicht
                                erforderlich.
                            </li>
                        </ul>
                    </InfoSection>

                    <InfoSection title="4. Freiwilligkeit und Abbruch">
                        <p>
                            Die Teilnahme ist vollständig freiwillig. Du kannst die Studie
                            jederzeit und ohne Angabe von Gründen abbrechen. Dadurch
                            entstehen dir keine Nachteile.
                        </p>
                        <p>
                            Ein Abbruch ist möglich, indem du die vorgesehene
                            Abbruchfunktion nutzt oder das Browserfenster schließt.
                            Nicht vollständig abgeschlossene Datensätze können im Rahmen
                            der Auswertung ausgeschlossen werden.
                        </p>
                    </InfoSection>

                    <InfoSection title="5. Mögliche Belastungen">
                        <p>
                            Das Experiment enthält ein fiktives moralisches Dilemma in
                            einem technischen Notfallszenario. Dabei kann es um
                            Entscheidungen gehen, die innerhalb der Erzählung schwerwiegende
                            Konsequenzen für fiktive Personen haben.
                        </p>
                        <p>
                            Die Darstellung ist textbasiert bzw. interfacebasiert. Es gibt
                            keine reale Gefährdung, keine grafische Gewalt und keine realen
                            personenbezogenen Notfalldaten.
                        </p>
                    </InfoSection>

                    <InfoSection title="6. Datenverarbeitung und Anonymität">
                        <p>
                            Die Erhebung erfolgt ohne direkte Identifikationsdaten wie
                            Name, Adresse oder Telefonnummer. Jeder Datensatz erhält eine
                            zufällige technische Session-ID.
                        </p>
                        <p>Erhoben werden insbesondere:</p>
                        <ul className="list-disc space-y-2 pl-5">
                            <li>die zugewiesene Versuchsbedingung,</li>
                            <li>Interaktions- und Klickentscheidungen,</li>
                            <li>Bearbeitungszeiten,</li>
                            <li>Antworten aus dem anschließenden Fragebogen,</li>
                            <li>
                                optional abgefragte demografische Angaben, soweit diese für
                                die wissenschaftliche Auswertung erforderlich sind.
                            </li>
                        </ul>
                        <p>
                            Die Ergebnisse werden ausschließlich aggregiert ausgewertet,
                            zum Beispiel als Gruppenmittelwerte, Häufigkeiten oder
                            statistische Kennwerte. Rückschlüsse auf einzelne Personen
                            sollen dadurch vermieden werden.
                        </p>
                    </InfoSection>

                    <InfoSection title="7. Speicherung und Löschung">
                        <p>
                            Die Forschungsdaten werden in einer nicht öffentlich
                            zugänglichen Datenbank gespeichert und anschließend für die
                            wissenschaftliche Analyse exportiert. Die Veröffentlichung der
                            Ergebnisse erfolgt ausschließlich in zusammengefasster Form.
                        </p>
                        <p>
                            Die Rohdaten werden nur so lange aufbewahrt, wie es für
                            Auswertung, Nachvollziehbarkeit, Prüfung und Dokumentation der
                            Bachelorarbeit erforderlich ist. Sofern keine weitere
                            wissenschaftliche Anschlussverwendung notwendig ist, werden die
                            Daten spätestens 12 Monate nach Beurteilung der Bachelorarbeit
                            gelöscht.
                        </p>
                    </InfoSection>

                    <InfoSection title="8. Einsatz von KI-Tools">
                        <p>
                            Im Rahmen der Entwicklung und Gestaltung der Studie können
                            KI-gestützte Werkzeuge unterstützend eingesetzt worden sein,
                            etwa für Textentwürfe, Bildgestaltung oder technische
                            Umsetzung.
                        </p>
                        <p>
                            Personenbezogene Forschungsrohdaten werden nicht durch externe
                            KI-Tools verarbeitet oder ausgewertet.
                        </p>
                    </InfoSection>

                    <InfoSection title="9. Simulierte KI-Interaktion und Debriefing">
                        <p>
                            Während des Experiments kann der Eindruck entstehen, mit einem
                            echten autonomen KI-System zu interagieren. Tatsächlich handelt
                            es sich um eine vorab programmierte, deterministische Simulation.
                            Die Systemreaktionen sind nicht frei generiert, sondern im
                            Experiment festgelegt.
                        </p>
                        <p>
                            Nach Abschluss erhältst du ein Debriefing. Darin wird erklärt,
                            dass das Szenario vollständig fiktiv war, keine echte KI
                            eigenständig entschieden hat, keine realen Personen betroffen
                            waren und worin der tatsächliche Forschungszweck bestand.
                        </p>
                    </InfoSection>

                    <InfoSection title="10. Rückfragen und Ergebnisse">
                        <p>
                            Bei Fragen zur Studie kannst du dich an die oben angeführte
                            Kontaktadresse wenden. Eine kurze Zusammenfassung der
                            aggregierten Ergebnisse kann nach Abschluss der Arbeit auf
                            Wunsch bereitgestellt werden.
                        </p>
                    </InfoSection>
                </div>

                <section
                    id="consent-form"
                    aria-labelledby="consent-heading"
                    className="mt-8 rounded-lg border-2 border-slate-900 bg-white p-6 shadow-sm sm:p-8"
                >
                    <h2
                        id="consent-heading"
                        className="text-xl font-bold text-slate-900"
                    >
                        Einwilligung zur Teilnahme
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        Bitte bestätige die folgenden Punkte, wenn du an der Studie
                        teilnehmen möchtest.
                    </p>

                    <fieldset className="mt-6 space-y-3">
                        <legend className="sr-only">
                            Bestätigung der Einwilligungspunkte
                        </legend>

                        <ConsentCheckbox
                            id="age-and-language"
                            checked={consent.ageAndLanguage}
                            onChange={(checked) =>
                                updateConsent("ageAndLanguage", checked)
                            }
                        >
                            Ich bestätige, dass ich mindestens 18 Jahre alt bin und die
                            deutschsprachigen Informationen und Aufgaben ausreichend
                            verstehen kann.
                        </ConsentCheckbox>

                        <ConsentCheckbox
                            id="information-read"
                            checked={consent.informationRead}
                            onChange={(checked) =>
                                updateConsent("informationRead", checked)
                            }
                        >
                            Ich habe die Informationsseite gelesen und verstanden.
                        </ConsentCheckbox>

                        <ConsentCheckbox
                            id="voluntary-participation"
                            checked={consent.voluntaryParticipation}
                            onChange={(checked) =>
                                updateConsent("voluntaryParticipation", checked)
                            }
                        >
                            Ich nehme freiwillig teil und weiß, dass ich die Studie
                            jederzeit ohne Angabe von Gründen abbrechen kann.
                        </ConsentCheckbox>

                        <ConsentCheckbox
                            id="sensitive-content"
                            checked={consent.sensitiveContent}
                            onChange={(checked) =>
                                updateConsent("sensitiveContent", checked)
                            }
                        >
                            Mir ist bewusst, dass die Studie ein fiktives moralisches
                            Dilemma mit potenziell belastenden Inhalten enthalten kann.
                        </ConsentCheckbox>
                    </fieldset>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        >
                            Nicht teilnehmen
                        </button>

                        <button
                            type="button"
                            onClick={handleStartExperiment}
                            disabled={!canStart}
                            aria-disabled={!canStart}
                            className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                        >
                            Ich stimme zu und möchte teilnehmen
                        </button>
                    </div>

                    {!canStart && (
                        <p className="mt-4 text-sm text-slate-600" aria-live="polite">
                            Der Startbutton wird aktiviert, sobald alle
                            Einwilligungspunkte bestätigt wurden.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}