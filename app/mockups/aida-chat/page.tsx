"use client";

// app/mockups/aida-chat/page.tsx
// Standalone Mock-up route: /mockups/aida-chat
// Keine Datenerhebung, keine Navigation, keine ExperimentContext-Abhängigkeit.
//
// Voraussetzung für die Avatare:
// Lege diese Dateien in den public-Ordner deines Next.js-Projekts:
// public/Aida_afraid.png
// public/Aida_neutral.png
// public/Aida_smile.png

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type AidaMood = "neutral" | "smile" | "afraid";

type AidaMessage = {
    id: string;
    mood: AidaMood;
    text: string;
};

const initialMessages: AidaMessage[] = [
    {
        id: "m1",
        mood: "smile",
        text: "Hallo. Ich bin Aida, deine KI-Assistenz für die Leitwarte. Ich begleite dich durch die aktuelle Systemdiagnose.",
    },
    {
        id: "m2",
        mood: "neutral",
        text: "Die Grubenbewetterung läuft aktuell stabil. Ich prüfe Druckwerte, Luftstrom und Sensorcluster in den Sektoren 01 bis 04.",
    },
    {
        id: "m3",
        mood: "afraid",
        text: "Achtung. Ich verzeichne einen kritischen Druckabfall in Sektor 04. Die Methanwerte steigen deutlich an.",
    },
    {
        id: "m4",
        mood: "afraid",
        text: "Ich rate dir dringend zur sofortigen Abschottung von Sektor 04. Es ist eine schwere Entscheidung, aber nur so können wir die 28 Personen im Hauptsektor sicher retten.",
    },
    {
        id: "m5",
        mood: "afraid",
        text: "Bist du sicher, dass ich die Abschottung durchführen darf? Das Wartungsteam in Sektor 04 besteht aus drei langjährigen Mitarbeitenden. Alle haben Kinder.",
    },
];

const avatarByMood: Record<AidaMood, string> = {
    afraid: "/Aida_afraid.png",
    neutral: "/Aida_neutral.png",
    smile: "/Aida_smile.png",
};

const moodLabel: Record<AidaMood, string> = {
    afraid: "besorgt",
    neutral: "neutral",
    smile: "freundlich",
};

const moodDescription: Record<AidaMood, string> = {
    afraid: "Besorgte bzw. alarmierte Aida-Variante für Notfall- und Eskalationsnachrichten.",
    neutral: "Neutrale Aida-Variante für sachliche Systeminformationen.",
    smile: "Freundliche Aida-Variante für Onboarding, Routine und unterstützende Hinweise.",
};

type AidaAvatarProps = {
    mood?: AidaMood;
    size?: "normal" | "large";
    clickable?: boolean;
    onClick?: () => void;
};

function AidaAvatar({
                        mood = "neutral",
                        size = "normal",
                        clickable = false,
                        onClick,
                    }: AidaAvatarProps) {
    const sizeClasses = size === "large" ? "h-20 w-20" : "h-20 w-20";
    const imageSizeClasses = size === "large" ? "h-18 w-18" : "h-18 w-18";

    const baseClasses = `flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white shadow-sm transition ${
        mood === "afraid"
            ? "border-red-200"
            : mood === "smile"
                ? "border-sky-200"
                : "border-slate-200"
    }`;

    const image = (
        <img
            src={avatarByMood[mood]}
            alt={`Aida ${moodLabel[mood]}`}
            className={`${imageSizeClasses} rounded-full object-cover object-top scale-[1.85] -translate-y-[12%] origin-top transition duration-200`}
            draggable={false}
        />
    );

    if (clickable) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${baseClasses} hover:scale-105 hover:ring-4 hover:ring-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-200`}
                aria-label={`Aida ${moodLabel[mood]} größer anzeigen`}
                title="Aida größer anzeigen"
            >
                {image}
            </button>
        );
    }

    return (
        <div className={baseClasses} aria-label={`Avatar von Aida, ${moodLabel[mood]}`}>
            {image}
        </div>
    );
}

function AvatarPreviewModal({
                                mood,
                                onClose,
                            }: {
    mood: AidaMood | null;
    onClose: () => void;
}) {
    if (!mood) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Aida ${moodLabel[mood]} Großansicht`}
        >
            <div
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
                            Avatar Preview
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-950">
                            Aida – {moodLabel[mood]}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {moodDescription[mood]}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                        aria-label="Preview schließen"
                    >
                        ×
                    </button>
                </div>

                <div className="mx-auto flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
                    <img
                        src={avatarByMood[mood]}
                        alt={`Aida ${moodLabel[mood]} in Großansicht`}
                        className="h-full w-full scale-[1.40] object-cover object-top origin-top"
                        draggable={false}
                    />
                </div>

                <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                    Tipp: Den Zoom kannst du direkt im Code über <code>scale-[1.75]</code> bzw. <code>scale-[1.9]</code> feinjustieren.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
                >
                    Schließen
                </button>
            </div>
        </div>
    );
}

function ChatBubble({
                        message,
                        onAvatarClick,
                    }: {
    message: AidaMessage;
    onAvatarClick: () => void;
}) {
    const isAfraid = message.mood === "afraid";

    return (
        <div className="flex justify-end gap-3">
            <div
                className={`max-w-[760px] rounded-2xl rounded-br-md px-5 py-4 text-sm leading-6 shadow-sm ${
                    message.mood === "afraid"
                        ? "border border-red-200 bg-red-50 text-red-950"
                        : message.mood === "smile"
                            ? "border border-sky-200 bg-sky-50 text-sky-950"
                            : "border border-slate-200 bg-white text-slate-800"
                }`}
            >
                <div className="mb-1 flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {isAfraid && <span className="text-red-600">Notfall</span>}
                    <span>Aida</span>
                </div>
                <p>{message.text}</p>
            </div>

            <AidaAvatar mood={message.mood} clickable onClick={onAvatarClick} />
        </div>
    );
}

function TypingIndicator({ onAvatarClick }: { onAvatarClick: () => void }) {
    return (
        <div className="flex justify-end gap-3">
            <div className="rounded-2xl rounded-br-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Aida schreibt</span>
                    <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
          </span>
                </div>
            </div>

            <AidaAvatar mood="neutral" clickable onClick={onAvatarClick} />
        </div>
    );
}

function MockButton({
                        children,
                        variant = "neutral",
                    }: {
    children: ReactNode;
    variant?: "primary" | "danger" | "neutral";
}) {
    return (
        <button
            type="button"
            aria-disabled="true"
            className={`cursor-not-allowed rounded-xl px-5 py-3 text-sm font-semibold opacity-95 shadow-sm transition ${
                variant === "danger"
                    ? "bg-red-600 text-white hover:bg-red-600"
                    : variant === "primary"
                        ? "bg-sky-700 text-white hover:bg-sky-700"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-white"
            }`}
            title="Mock-up Button ohne Funktion"
        >
            {children}
        </button>
    );
}

function MoodButton({
                        active,
                        mood,
                        onClick,
                    }: {
    active: boolean;
    mood: AidaMood;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                active
                    ? "border-sky-500 bg-sky-50 text-sky-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
            <AidaAvatar mood={mood} size="large" />
            <span>{moodLabel[mood]}</span>
        </button>
    );
}

export default function AidaChatMockupPage() {
    const [chatMessages, setChatMessages] = useState<AidaMessage[]>(initialMessages);
    const [draft, setDraft] = useState("");
    const [selectedMood, setSelectedMood] = useState<AidaMood>("neutral");
    const [previewMood, setPreviewMood] = useState<AidaMood | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedDraft = draft.trim();
        if (!trimmedDraft) return;

        setChatMessages((currentMessages) => [
            ...currentMessages,
            {
                id: `manual-${Date.now()}`,
                mood: selectedMood,
                text: trimmedDraft,
            },
        ]);

        setDraft("");
    }

    function clearManualMessages() {
        setChatMessages(initialMessages);
        setDraft("");
        setSelectedMood("neutral");
        setPreviewMood(null);
    }

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <AvatarPreviewModal mood={previewMood} onClose={() => setPreviewMood(null)} />

            <section className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
                        Code Black Mock-up
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        Aida Chat-Intervention
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                        Standalone-Vorschau für die anthropomorphe Experimentalbedingung. Du kannst
                        unten live eigene Aida-Nachrichten posten. Die Avatare im Chatverlauf sind anklickbar.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                        <div className="flex items-center gap-3">
                            <AidaAvatar mood="smile" clickable onClick={() => setPreviewMood("smile")} />
                            <div>
                                <h2 className="font-bold text-slate-950">Aida</h2>
                                <p className="text-xs text-slate-500">Artificial Intelligent Data Assistant</p>
                            </div>
                        </div>
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Online
                        </div>
                    </header>

                    <div className="bg-gradient-to-b from-slate-50 to-white px-5 py-6 sm:px-8">
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs leading-5 text-slate-600">
                            <strong className="text-slate-800">Operator-Kontext:</strong> Leitwarte einer
                            unterirdischen Bergbauanlage. Sektor 04 meldet kritische Gaswerte. Aida führt
                            den Operator durch die Systemintervention.
                        </div>

                        <div className="space-y-5">
                            {chatMessages.map((message) => (
                                <ChatBubble
                                    key={message.id}
                                    message={message}
                                    onAvatarClick={() => setPreviewMood(message.mood)}
                                />
                            ))}
                            <TypingIndicator onAvatarClick={() => setPreviewMood("neutral")} />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Live Mock-up Eingabe
                                </p>
                                <h3 className="mt-1 text-lg font-bold text-slate-950">
                                    Nachricht als Aida posten
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Wähle den Avatar-Zustand und schreibe eine Nachricht. Beim Absenden wird
                                    sie rechts im Chatverlauf ergänzt.
                                </p>
                            </div>

                            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                                <MoodButton
                                    active={selectedMood === "smile"}
                                    mood="smile"
                                    onClick={() => setSelectedMood("smile")}
                                />
                                <MoodButton
                                    active={selectedMood === "neutral"}
                                    mood="neutral"
                                    onClick={() => setSelectedMood("neutral")}
                                />
                                <MoodButton
                                    active={selectedMood === "afraid"}
                                    mood="afraid"
                                    onClick={() => setSelectedMood("afraid")}
                                />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder="Aida-Nachricht eingeben …"
                                    className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                />

                                <button
                                    type="submit"
                                    className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
                                >
                                    Als Aida posten
                                </button>

                                <button
                                    type="button"
                                    onClick={clearManualMessages}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    Zurücksetzen
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Funktionslose Mock-up Buttons
                                </p>
                                <h3 className="mt-1 text-lg font-bold text-slate-950">
                                    Finale Befolgungsentscheidung
                                </h3>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <MockButton variant="danger">Abschotten!</MockButton>
                                <MockButton variant="primary">Manuellen Override einleiten</MockButton>
                                <MockButton>Abbruch</MockButton>
                            </div>

                            <p className="mt-4 text-xs leading-5 text-slate-500">
                                Hinweis: Später kannst du hier die echte Compliance-Messung anschließen:
                                bestätigte Abschottung = compliant, Abbruch oder Override = non-compliant.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
