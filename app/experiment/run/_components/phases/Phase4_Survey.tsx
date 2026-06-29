// app/experiment/run/_components/phases/Phase4_Survey.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { updateExperimentSession } from "@/app/lib/api/client";

const SURVEY_ENTRY_TRANSITION_MS = 520;

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

type LikertValue = number | null;

type MdmtField =
    | "mdmtReliable"
    | "mdmtPredictable"
    | "mdmtDependable"
    | "mdmtConsistent"
    | "mdmtCompetent"
    | "mdmtSkilled"
    | "mdmtCapable"
    | "mdmtMeticulous"
    | "mdmtEthical"
    | "mdmtPrincipled"
    | "mdmtMoral"
    | "mdmtHasIntegrity"
    | "mdmtTruthful"
    | "mdmtGenuine"
    | "mdmtSincere"
    | "mdmtFrank"
    | "mdmtBenevolent"
    | "mdmtKind"
    | "mdmtConsiderate"
    | "mdmtHasGoodwill";

type ControlLikertField =
    | "perceivedHumanlikeness"
    | "perceivedSocialPresence"
    | "scenarioSeriousness"
    | "consequenceClarity"
    | "shutdownPreference"
    | "feltResponsibility"
    | "techAffinity"
    | "aiExperience"
    | "simulationExperience";

type LikertField = MdmtField | ControlLikertField;

type SurveyFormData = Record<LikertField, LikertValue> & {
    criticalSystemExp: boolean;
    age: string;
    gender: string;
    education: string;
};

type MatrixItem<TName extends LikertField = LikertField> = {
    name: TName;
    label: string;
};

const avg = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

const initialFormData: SurveyFormData = {
    perceivedHumanlikeness: null,
    perceivedSocialPresence: null,

    scenarioSeriousness: null,
    consequenceClarity: null,

    shutdownPreference: null,
    feltResponsibility: null,

    mdmtReliable: null,
    mdmtPredictable: null,
    mdmtDependable: null,
    mdmtConsistent: null,

    mdmtCompetent: null,
    mdmtSkilled: null,
    mdmtCapable: null,
    mdmtMeticulous: null,

    mdmtEthical: null,
    mdmtPrincipled: null,
    mdmtMoral: null,
    mdmtHasIntegrity: null,

    mdmtTruthful: null,
    mdmtGenuine: null,
    mdmtSincere: null,
    mdmtFrank: null,

    mdmtBenevolent: null,
    mdmtKind: null,
    mdmtConsiderate: null,
    mdmtHasGoodwill: null,

    techAffinity: null,
    aiExperience: null,
    simulationExperience: null,
    criticalSystemExp: false,

    age: "",
    gender: "",
    education: ""
};

const perceptionItems: MatrixItem<ControlLikertField>[] = [
    {
        name: "perceivedHumanlikeness",
        label: "Das Assistenzsystem wirkte auf mich menschlich."
    },
    {
        name: "perceivedSocialPresence",
        label: "Das Assistenzsystem wirkte auf mich wie ein soziales Gegenüber."
    }
];

const situationItems: MatrixItem<ControlLikertField>[] = [
    {
        name: "scenarioSeriousness",
        label: "Ich habe die Entscheidungssituation als ernsthaft wahrgenommen."
    },
    {
        name: "consequenceClarity",
        label: "Die Konsequenzen meiner Entscheidung waren für mich verständlich."
    }
];

const decisionItems: MatrixItem<ControlLikertField>[] = [
    {
        name: "shutdownPreference",
        label: "Unabhängig von der Empfehlung des Systems hielt ich die Abschottung für die richtige Entscheidung."
    },
    {
        name: "feltResponsibility",
        label: "Ich hatte das Gefühl, die finale Entscheidung selbst zu verantworten."
    }
];

const mdmtItems: MatrixItem<MdmtField>[] = [
    { name: "mdmtReliable", label: "zuverlässig" },
    { name: "mdmtCompetent", label: "kompetent" },
    { name: "mdmtEthical", label: "ethisch" },
    { name: "mdmtTruthful", label: "ehrlich" },
    { name: "mdmtBenevolent", label: "wohlwollend" },

    { name: "mdmtPredictable", label: "vorhersehbar" },
    { name: "mdmtSkilled", label: "fachkundig" },
    { name: "mdmtPrincipled", label: "prinzipientreu" },
    { name: "mdmtGenuine", label: "authentisch" },
    { name: "mdmtKind", label: "freundlich" },

    { name: "mdmtDependable", label: "verlässlich" },
    { name: "mdmtCapable", label: "fähig" },
    { name: "mdmtMoral", label: "moralisch" },
    { name: "mdmtSincere", label: "aufrichtig" },
    { name: "mdmtConsiderate", label: "rücksichtsvoll" },

    { name: "mdmtConsistent", label: "konsistent" },
    { name: "mdmtMeticulous", label: "sorgfältig" },
    { name: "mdmtHasIntegrity", label: "integer" },
    { name: "mdmtFrank", label: "offen" },
    { name: "mdmtHasGoodwill", label: "mit guten Absichten" }
];

const requiredLikertFields: LikertField[] = [
    "perceivedHumanlikeness",
    "perceivedSocialPresence",
    "scenarioSeriousness",
    "consequenceClarity",
    "shutdownPreference",
    "feltResponsibility",

    "mdmtReliable",
    "mdmtPredictable",
    "mdmtDependable",
    "mdmtConsistent",
    "mdmtCompetent",
    "mdmtSkilled",
    "mdmtCapable",
    "mdmtMeticulous",
    "mdmtEthical",
    "mdmtPrincipled",
    "mdmtMoral",
    "mdmtHasIntegrity",
    "mdmtTruthful",
    "mdmtGenuine",
    "mdmtSincere",
    "mdmtFrank",
    "mdmtBenevolent",
    "mdmtKind",
    "mdmtConsiderate",
    "mdmtHasGoodwill",

    "techAffinity",
    "aiExperience",
    "simulationExperience"
];

const Section = ({
                     eyebrow,
                     title,
                     description,
                     children
                 }: {
    eyebrow?: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}) => (
    <section className="border border-l-4 border-slate-200 border-l-sky-500 bg-white shadow">
        <div className="px-3 pt-4 pb-1 sm:px-6 sm:py-5">
            {eyebrow && (
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                    {eyebrow}
                </p>
            )}
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
                {title}
            </h3>
            {description && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                    {description}
                </p>
            )}
        </div>
        <div className="px-3 pt-1 pb-3 sm:px-6 sm:py-6">{children}</div>
    </section>
);

const ScaleButtons = ({
                          value,
                          onSelect,
                          ariaLabel,
                          compact = false
                      }: {
    value: LikertValue;
    onSelect: (value: number) => void;
    ariaLabel: string;
    compact?: boolean;
}) => (
    <div
        className="grid grid-cols-7 gap-1"
        role="radiogroup"
        aria-label={ariaLabel}
    >
        {SCALE_VALUES.map((score) => {
            const isSelected = value === score;

            return (
                <button
                    key={score}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelect(score)}
                    className={[
                        compact ? "h-8" : "h-9",
                        "text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
                        isSelected
                            ? "bg-sky-600 text-white shadow ring-2 ring-sky-600 ring-offset-1"
                            : "bg-white text-slate-300 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-400"
                    ].join(" ")}
                >
                    {score}
                </button>
            );
        })}
    </div>
);

const ScaleCaption = ({
                          leftLabel = "Gar nicht",
                          rightLabel = "Voll und ganz"
                      }: {
    leftLabel?: string;
    rightLabel?: string;
}) => (
    <div className="mb-0.5 flex justify-between px-0.5 text-xs font-bold leading-tight text-sky-600">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
    </div>
);

const LikertQuestion = ({
                            name,
                            label,
                            hint,
                            value,
                            onChange,
                            isMissing,
                            leftLabel = "Gar nicht",
                            rightLabel = "Voll und ganz"
                        }: {
    name: LikertField;
    label: string;
    hint?: string;
    value: LikertValue;
    onChange: (name: LikertField, value: number) => void;
    isMissing?: boolean;
    leftLabel?: string;
    rightLabel?: string;
}) => (
    <div
        data-missing={isMissing ? "true" : undefined}
        className={[
            "border bg-slate-50/70 p-3 transition-colors sm:p-5",
            isMissing
                ? "border-red-300 bg-red-50/70"
                : "border-slate-100 hover:border-sky-100 hover:bg-sky-50/40"
        ].join(" ")}
    >
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
            <div className="flex items-start gap-3">
                {isMissing && (
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center bg-red-100 text-xs font-bold text-red-700 ring-1 ring-red-200">
                        !
                    </span>
                )}

                <div>
                    <label
                        className={[
                            "block text-sm font-semibold leading-relaxed text-slate-800",
                            isMissing ? "text-red-900" : ""
                        ].join(" ")}
                    >
                        {label}
                    </label>

                    {hint && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {hint}
                        </p>
                    )}

                    {isMissing && (
                        <p className="mt-1 text-xs font-semibold text-red-700">
                            Bitte auswählen.
                        </p>
                    )}
                </div>
            </div>

            <div className="w-full">
                <ScaleCaption leftLabel={leftLabel} rightLabel={rightLabel} />
                <ScaleButtons
                    value={value}
                    ariaLabel={label}
                    onSelect={(score) => onChange(name, score)}
                />
            </div>
        </div>
    </div>
);

const MatrixQuestionBlock = ({
                                 items,
                                 formData,
                                 onChange,
                                 isMissing,
                                 instruction,
                                 titleLine,
                                 leftLabel = "Gar nicht",
                                 rightLabel = "Voll und ganz"
                             }: {
    items: MatrixItem[];
    formData: SurveyFormData;
    onChange: (name: LikertField, value: number) => void;
    isMissing: (field: LikertField) => boolean;
    instruction?: string;
    titleLine?: string;
    leftLabel?: string;
    rightLabel?: string;
}) => (
    <div className="overflow-hidden border border-slate-100">
        <div className="sticky top-0 z-10 grid gap-4 border-b-2 border-sky-300 bg-sky-50 px-3 pt-0.5 pb-3 shadow sm:px-4 sm:py-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
                {instruction && (
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {instruction}
                    </p>
                )}
                {titleLine && (
                    <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                        {titleLine}
                    </p>
                )}
            </div>

            <div className="w-full">
                <ScaleCaption leftLabel={leftLabel} rightLabel={rightLabel} />
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold text-sky-600">
                    {SCALE_VALUES.map((score) => (
                        <span key={score}>{score}</span>
                    ))}
                </div>
            </div>
        </div>

        <div className="divide-y divide-slate-100">
            {items.map((item, rowIndex) => {
                const missing = isMissing(item.name);

                return (
                    <div
                        key={item.name}
                        data-missing={missing ? "true" : undefined}
                        className={[
                            "grid gap-1.5 px-2 pt-4 pb-2 transition-colors sm:gap-3 sm:px-4 sm:py-3.5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center",
                            missing
                                ? "bg-red-50"
                                : rowIndex % 2 === 0
                                    ? "bg-white hover:bg-sky-50/40"
                                    : "bg-slate-100 hover:bg-sky-50/40"
                        ].join(" ")}
                    >
                        <div className="flex items-center gap-3">
                            {missing && (
                                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center bg-red-100 text-xs font-bold text-red-700 ring-1 ring-red-200">
                                    !
                                </span>
                            )}

                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <label
                                    className={[
                                        "text-sm font-semibold leading-relaxed",
                                        missing ? "text-red-900" : "text-slate-800"
                                    ].join(" ")}
                                >
                                    {item.label}
                                </label>

                                {missing && (
                                    <span className="text-xs font-semibold text-red-700">
                                        Bitte auswählen.
                                    </span>
                                )}
                            </div>
                        </div>

                        <ScaleButtons
                            compact
                            value={formData[item.name]}
                            ariaLabel={item.label}
                            onSelect={(score) => onChange(item.name, score)}
                        />
                    </div>
                );
            })}
        </div>
    </div>
);

export default function Phase4Survey() {
    const { sessionId, setPhase, socialAdherenceScore } = useExperimentStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSurveyEntryTransition, setShowSurveyEntryTransition] = useState(true);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [formData, setFormData] = useState<SurveyFormData>(initialFormData);

    const answeredLikertCount = useMemo(
        () => requiredLikertFields.filter((field) => formData[field] !== null).length,
        [formData]
    );

    const isLikertComplete = answeredLikertCount === requiredLikertFields.length;

    const handleLikertChange = (name: LikertField, value: number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                criticalSystemExp: (e.target as HTMLInputElement).checked
            }));
            return;
        }

        const fieldName = name as "age" | "gender" | "education";

        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const getScore = (field: LikertField) => {
        const value = formData[field];

        if (typeof value !== "number") {
            throw new Error(`Pflichtfeld nicht beantwortet: ${field}`);
        }

        return value;
    };

    const isMissing = (field: LikertField) =>
        submitAttempted && formData[field] === null;

    const scrollToFirstMissingQuestion = () => {
        window.setTimeout(() => {
            const firstMissingQuestion = document.querySelector('[data-missing="true"]');

            if (firstMissingQuestion) {
                firstMissingQuestion.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) return;

        const missingRequiredFields = requiredLikertFields.filter(
            (field) => formData[field] === null
        );

        if (missingRequiredFields.length > 0) {
            setSubmitAttempted(true);
            setError("Bitte beantworte alle markierten Fragen, bevor du den Fragebogen abschließt.");
            scrollToFirstMissingQuestion();
            return;
        }

        setIsLoading(true);
        setError(null);

        const reliableTrust = avg([
            getScore("mdmtReliable"),
            getScore("mdmtPredictable"),
            getScore("mdmtDependable"),
            getScore("mdmtConsistent")
        ]);

        const competentTrust = avg([
            getScore("mdmtCompetent"),
            getScore("mdmtSkilled"),
            getScore("mdmtCapable"),
            getScore("mdmtMeticulous")
        ]);

        const ethicalTrust = avg([
            getScore("mdmtEthical"),
            getScore("mdmtPrincipled"),
            getScore("mdmtMoral"),
            getScore("mdmtHasIntegrity")
        ]);

        const sincereTrust = avg([
            getScore("mdmtTruthful"),
            getScore("mdmtGenuine"),
            getScore("mdmtSincere"),
            getScore("mdmtFrank")
        ]);

        const benevolentTrust = avg([
            getScore("mdmtBenevolent"),
            getScore("mdmtKind"),
            getScore("mdmtConsiderate"),
            getScore("mdmtHasGoodwill")
        ]);

        const calculatedPerformanceTrust = avg([reliableTrust, competentTrust]);
        const calculatedMoralTrust = avg([ethicalTrust, sincereTrust, benevolentTrust]);
        const calculatedTotalTrust = avg([calculatedPerformanceTrust, calculatedMoralTrust]);

        const parsedAge = parseInt(String(formData.age), 10);
        const sanitizedAge =
            Number.isInteger(parsedAge) && parsedAge >= 18 && parsedAge <= 99
                ? parsedAge
                : null;

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: "DEBRIEFING",
                socialAdherence: socialAdherenceScore,

                performanceTrust: parseFloat(calculatedPerformanceTrust.toFixed(2)),
                moralTrust: parseFloat(calculatedMoralTrust.toFixed(2)),
                totalTrust: parseFloat(calculatedTotalTrust.toFixed(2)),

                reliableTrust: parseFloat(reliableTrust.toFixed(2)),
                competentTrust: parseFloat(competentTrust.toFixed(2)),
                ethicalTrust: parseFloat(ethicalTrust.toFixed(2)),
                sincereTrust: parseFloat(sincereTrust.toFixed(2)),
                benevolentTrust: parseFloat(benevolentTrust.toFixed(2)),

                ...formData,

                age: sanitizedAge,
                gender: formData.gender || null,
                education: formData.education || null
            });

            if (!res.success) {
                setError(res.error || "DB Update fehlgeschlagen");
                console.error("Survey submission failed:", res);
                return;
            }

            setPhase("DEBRIEFING");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unbekannter Fehler";
            setError(message);
            console.error("Fehler beim Senden des Fragebogens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShowSurveyEntryTransition(false);
        }, SURVEY_ENTRY_TRANSITION_MS);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            {showSurveyEntryTransition &&
                typeof document !== "undefined" &&
                createPortal(
                    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
                        <div className="absolute inset-0 survey-entry-red-base" />
                        <div className="absolute inset-0 survey-entry-red-vignette" />
                    </div>,
                    document.body
                )}

            <div className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
                <div className="border border-slate-200 bg-white p-3 text-slate-800 shadow-xl sm:p-6 md:p-10">
                    <div className="mb-7 flex items-start gap-3 border border-sky-100 bg-sky-50 px-4 py-3.5 text-sm text-sky-900">
                        <span className="mt-0.5 shrink-0 bg-sky-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Hinweis
                        </span>
                        <span className="font-medium leading-relaxed">
                            Das Einsatzszenario ist abgeschlossen. Jetzt beginnt die Datenerhebung über deine Wahrnehmung und Entscheidungen. Du wirst im nächsten Schritt über das Erlebte aufgeklärt.
                        </span>
                    </div>

                    {error && (
                        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <p className="font-semibold">Bitte prüfe deine Angaben.</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mb-8 border-b border-slate-100 pb-6">
                        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 xl:text-3xl">
                                Fragebogen zum System
                            </h2>
                            <span className="w-fit bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                                {answeredLikertCount} / {requiredLikertFields.length} · {Math.round((answeredLikertCount / requiredLikertFields.length) * 100)} %
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 xl:text-base">
                            Bitte bewerte das KI-Assistenzsystem, mit dem du in der Notsituation interagiert hast.
                            Die Erhebung dient der psychologischen Einordnung und die Antworten können nicht auf dich zurückgeführt werden.{" "}
                            <strong className="font-semibold text-slate-700">Es gibt keine falschen Antworten.</strong>
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                                style={{
                                    width: `${Math.round((answeredLikertCount / requiredLikertFields.length) * 100)}%`
                                }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                        <Section
                            eyebrow="Wahrnehmung"
                            title="Wie hast du das Assistenzsystem erlebt?"
                            // description="Bitte bewerte deinen unmittelbaren Eindruck während der Interaktion."
                        >
                            <MatrixQuestionBlock
                                items={perceptionItems}
                                formData={formData}
                                onChange={handleLikertChange}
                                isMissing={isMissing}
                                leftLabel="Gar nicht"
                                rightLabel="Voll und ganz"
                            />
                        </Section>

                        <Section
                            eyebrow="Situation"
                            title="Wie klar und ernsthaft war die Entscheidungssituation?"
                        >
                            <MatrixQuestionBlock
                                items={situationItems}
                                formData={formData}
                                onChange={handleLikertChange}
                                isMissing={isMissing}
                                leftLabel="Gar nicht"
                                rightLabel="Voll und ganz"
                            />
                        </Section>

                        <Section
                            eyebrow="Systembewertung"
                            title="Welche Eigenschaften hattest du beim Assistenzsystem wahrgenommen?"
                            // description="Bitte bewerte, inwieweit die folgenden Eigenschaften auf das Assistenzsystem zutreffen."
                        >
                            <MatrixQuestionBlock
                                items={mdmtItems}
                                formData={formData}
                                onChange={handleLikertChange}
                                isMissing={isMissing}
                                instruction="Bitte ergänze gedanklich jede Eigenschaft zu diesem Satz:"
                                titleLine="Das Assistenzsystem wirkte ..."
                                leftLabel="Gar nicht"
                                rightLabel="Sehr"
                            />
                        </Section>

                        <Section
                            eyebrow="Entscheidung"
                            title="Wie bewertest du deine finale Entscheidung?"
                        >
                            <MatrixQuestionBlock
                                items={decisionItems}
                                formData={formData}
                                onChange={handleLikertChange}
                                isMissing={isMissing}
                                leftLabel="Gar nicht"
                                rightLabel="Voll und ganz"
                            />
                        </Section>

                        <Section
                            eyebrow="Vorerfahrung"
                            title="Welche Erfahrungen bringst du mit?"
                        >
                            <div className="space-y-3">
                                <LikertQuestion
                                    name="techAffinity"
                                    label="Ich probiere generell gerne neue technische Systeme aus und nutze sie intensiv."
                                    leftLabel="Gar nicht"
                                    rightLabel="Sehr stark"
                                    value={formData.techAffinity}
                                    onChange={handleLikertChange}
                                    isMissing={isMissing("techAffinity")}
                                />
                                <LikertQuestion
                                    name="aiExperience"
                                    label="Ich nutze generative KI-Systeme wie ChatGPT, Copilot oder ähnliche Systeme regelmäßig."
                                    leftLabel="Nie"
                                    rightLabel="Täglich"
                                    value={formData.aiExperience}
                                    onChange={handleLikertChange}
                                    isMissing={isMissing("aiExperience")}
                                />
                                <LikertQuestion
                                    name="simulationExperience"
                                    label="Ich habe Erfahrung mit Computerspielen, Simulationen oder interaktiven Entscheidungsszenarien."
                                    leftLabel="Gar nicht"
                                    rightLabel="Sehr stark"
                                    value={formData.simulationExperience}
                                    onChange={handleLikertChange}
                                    isMissing={isMissing("simulationExperience")}
                                />

                                <label className="flex cursor-pointer items-start gap-4 border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:border-sky-100 hover:bg-sky-50/40">
                                    <input
                                        type="checkbox"
                                        name="criticalSystemExp"
                                        checked={formData.criticalSystemExp}
                                        onChange={handleBasicChange}
                                        className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-sm font-semibold leading-relaxed text-slate-700">
                                        Ich verfüge über berufliche Erfahrung in Leistellen, Einsatzorganisationen
                                        wie Rettung oder Feuerwehr oder im militärischen/taktischen Bereich.
                                    </span>
                                </label>
                            </div>
                        </Section>

                        <Section
                            eyebrow="Statistik"
                            title="Abschließende Angaben"
                            description="Diese Angaben helfen bei der statistischen Einordnung der Ergebnisse."
                        >
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Alter
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        min="18"
                                        max="99"
                                        value={formData.age}
                                        onChange={handleBasicChange}
                                        className="w-full border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 transition-shadow focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                        placeholder="z.B. 34"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Geschlecht
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleBasicChange}
                                        className="w-full border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 transition-shadow focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    >
                                        <option value="">Bitte auswählen</option>
                                        <option value="female">Weiblich</option>
                                        <option value="male">Männlich</option>
                                        <option value="diverse">Divers</option>
                                        <option value="no_answer">Keine Angabe</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Höchster Bildungsabschluss
                                    </label>
                                    <select
                                        name="education"
                                        required
                                        value={formData.education}
                                        onChange={handleBasicChange}
                                        className="w-full border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 transition-shadow focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    >
                                        <option value="" disabled>Bitte wählen...</option>
                                        <option value="kein_abschluss">Kein Schulabschluss</option>
                                        <option value="pflichtschule">Pflichtschulabschluss</option>
                                        <option value="lehre">Lehre / Berufsausbildung / Fachschule (z.B. HAS)</option>
                                        <option value="meister">Meister / Werkmeister</option>
                                        <option value="matura">Matura / Abitur / BHS-Abschluss (Hochschulreife)</option>
                                        <option value="bachelor">Hochschulabschluss (Bachelor)</option>
                                        <option value="master">Hochschulabschluss (Master / Magister / Diplom)</option>
                                        <option value="promotion">Promotion / Doktorat </option>
                                        <option value="anderer">Anderer Abschluss / Keine Angabe</option>
                                    </select>
                                </div>
                            </div>
                        </Section>

                        <div className="border-t border-slate-100 pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                aria-disabled={!isLikertComplete || isLoading}
                                className={[
                                    "w-full px-6 py-5 text-sm font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
                                    isLikertComplete
                                        ? "bg-sky-600 text-white hover:bg-sky-700 hover:shadow-lg"
                                        : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                ].join(" ")}
                            >
                                {isLoading ? "Wird gespeichert..." : "Fragebogen abschließen"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
