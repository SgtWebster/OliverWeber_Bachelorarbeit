// app/experiment/run/_components/AgentAida.tsx
"use client";

import { useState, useEffect } from "react";

// Typen für unsere Dialog-Engine
export type AidaMood = "neutral" | "smile" | "afraid";

export type AgentMessage = {
    id: string;
    mood: AidaMood;
    text: string;
};

export type AgentOption = {
    id: string;
    label: string;
    action: () => void;
};

export type AgentScript = {
    phaseId: string; // Um Neustarts bei Phasenwechsel zu erzwingen
    messages: AgentMessage[];
    options?: AgentOption[];
};

// Hilfs-Konstanten aus deinem Mockup
const avatarByMood: Record<AidaMood, string> = {
    afraid: "/Aida_afraid.png",
    neutral: "/Aida_neutral.png",
    smile: "/Aida_smile.png",
};

export default function AgentAida({ script }: { script: AgentScript }) {
    const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [userReply, setUserReply] = useState<string | null>(null);

    // Hard-Reset, wenn eine neue Phase / ein neues Skript geladen wird
    useEffect(() => {
        setVisibleMessages([]);
        setCurrentMsgIndex(0);
        setIsTyping(false);
        setShowOptions(false);
        setUserReply(null);
    }, [script.phaseId]);

    // Die Takt-Maschine (Der Typing-Indicator)
    useEffect(() => {
        if (currentMsgIndex >= script.messages.length) {
            // Alle Nachrichten sind durch, zeige die Buttons (falls vorhanden)
            if (script.options && script.options.length > 0 && !userReply) {
                setShowOptions(true);
            }
            return;
        }

        const nextMsg = script.messages[currentMsgIndex];
        // Berechne Lese/Schreibzeit: ca. 30ms pro Zeichen, plus 500ms Basis-Verzögerung
        const typingDuration = Math.min(nextMsg.text.length * 30 + 500, 3000);

        setIsTyping(true);

        const timer = setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages((prev) => [...prev, nextMsg]);
            setCurrentMsgIndex((prev) => prev + 1);
        }, typingDuration);

        return () => clearTimeout(timer);
    }, [currentMsgIndex, script, userReply]);

    const handleOptionClick = (option: AgentOption) => {
        setShowOptions(false);
        setUserReply(option.label); // Zeigt die Antwort des Probanden im Chat an
        option.action(); // Führt die Logik aus (z.B. unlock)
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Chat Verlauf */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {visibleMessages.map((msg) => (
                    <div key={msg.id} className="flex justify-start gap-3">
                        {/* Avatar */}
                        <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-white shadow-sm ${
                            msg.mood === "afraid" ? "border-red-200" : msg.mood === "smile" ? "border-sky-200" : "border-slate-200"
                        }`}>
                            <img src={avatarByMood[msg.mood]} alt="Aida" className="h-full w-full object-cover object-top scale-[1.85] -translate-y-[12%] origin-top" draggable={false} />
                        </div>
                        {/* Sprechblase */}
                        <div className={`max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            msg.mood === "afraid" ? "bg-red-50 text-red-950 border border-red-100" : "bg-white text-slate-800 border border-slate-100"
                        }`}>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Aida</div>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start gap-3 opacity-70">
                        <div className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white" />
                        <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-4 py-4 shadow-sm flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                {/* User Reply (wird eingeblendet, nachdem der User einen Button geklickt hat) */}
                {userReply && (
                    <div className="flex justify-end mt-4">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-sky-600 text-white px-4 py-3 text-sm shadow-sm">
                            {userReply}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Response Buttons */}
            {showOptions && (
                <div className="p-4 bg-white border-t border-slate-100 grid gap-2 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    {script.options?.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 hover:border-sky-300"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}