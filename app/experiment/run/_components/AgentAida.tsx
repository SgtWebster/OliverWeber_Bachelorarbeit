// app/experiment/run/_components/AgentAida.tsx
"use client";

import { useState, useEffect, useRef } from "react";

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
    phaseId: string;
    messages: AgentMessage[];
    options?: AgentOption[];
};

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

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [visibleMessages, isTyping, userReply, showOptions]);

    useEffect(() => {
        setVisibleMessages([]);
        setCurrentMsgIndex(0);
        setIsTyping(false);
        setShowOptions(false);
        setUserReply(null);
    }, [script.phaseId]);

    useEffect(() => {
        if (currentMsgIndex >= script.messages.length) {
            if (script.options && script.options.length > 0 && !userReply) {
                setShowOptions(true);
            }
            return;
        }

        const nextMsg = script.messages[currentMsgIndex];
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
        setUserReply(option.label);
        option.action();
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Chat Verlauf */}
            <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8">
                {visibleMessages.map((msg) => (
                    <div key={msg.id} className="flex justify-start gap-4">
                        <div className={`h-12 w-12 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-full border bg-white shadow-sm ${
                            msg.mood === "afraid" ? "border-red-200" : msg.mood === "smile" ? "border-sky-200" : "border-slate-200"
                        }`}>
                            <img src={avatarByMood[msg.mood]} alt="Aida" className="h-full w-full object-cover object-top scale-[1.85] -translate-y-[12%] origin-top" draggable={false} />
                        </div>
                        <div className={`max-w-[85%] rounded-3xl rounded-tl-sm px-5 py-4 md:px-6 md:py-5 text-base md:text-lg leading-relaxed shadow-sm ${
                            msg.mood === "afraid" ? "bg-red-50 text-red-950 border border-red-100" : "bg-white text-slate-800 border border-slate-100"
                        }`}>
                            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-1.5">Aida</div>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start gap-4 opacity-70">
                        <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-full border border-slate-200 bg-white" />
                        <div className="rounded-3xl rounded-tl-sm bg-white border border-slate-100 px-5 py-5 md:px-6 md:py-6 shadow-sm flex items-center gap-1.5">
                            <span className="h-2 w-2 md:h-2.5 md:w-2.5 animate-pulse rounded-full bg-slate-400" />
                            <span className="h-2 w-2 md:h-2.5 md:w-2.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                            <span className="h-2 w-2 md:h-2.5 md:w-2.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                {userReply && (
                    <div className="flex justify-end mt-6">
                        <div className="max-w-[85%] rounded-3xl rounded-tr-sm bg-sky-600 text-white px-5 py-4 md:px-6 md:py-5 text-base md:text-lg shadow-sm">
                            {userReply}
                        </div>
                    </div>
                )}

                <div className="h-8 shrink-0" />
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Response Buttons */}
            {showOptions && (
                <div className="p-4 md:p-6 bg-white border-t border-slate-100 grid gap-3 md:gap-4 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    {script.options?.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="w-full rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 md:py-5 text-base md:text-lg font-bold text-sky-800 transition hover:bg-sky-100 hover:border-sky-300"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}