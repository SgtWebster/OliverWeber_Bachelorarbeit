// app/experiment/run/_components/AgentAida.tsx
"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

export type AidaMood = "neutral" | "smile" | "afraid";

export type AgentMessage = {
    id: string;
    mood: AidaMood;
    text: string;
    speaker?: "assistant" | "user";
};

export type AgentOption = {
    id: string;
    label: string;
    action: () => void;
    response?: string;
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
    const [hasAnsweredOptions, setHasAnsweredOptions] = useState(false);
    const [isTypingResponse, setIsTypingResponse] = useState(false);
    const [pendingResponse, setPendingResponse] = useState<AgentMessage | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [visibleMessages, isTyping, showOptions, isTypingResponse, pendingResponse]);

    useLayoutEffect(() => {
        setCurrentMsgIndex(0);
        setIsTyping(false);
        setShowOptions(false);
        setHasAnsweredOptions(false);
        setIsTypingResponse(false);
        setPendingResponse(null);
    }, [script.phaseId]);

    useEffect(() => {
        if (pendingResponse) {
            const typingDuration = Math.min(pendingResponse.text.length * 30 + 500, 3000);
            setIsTypingResponse(true);

            const timer = setTimeout(() => {
                setIsTypingResponse(false);
                setVisibleMessages((prev) => [...prev, pendingResponse]);
                setPendingResponse(null);
            }, typingDuration);

            return () => clearTimeout(timer);
        }
    }, [pendingResponse]);

    useEffect(() => {
        if (currentMsgIndex >= script.messages.length) {
            if (script.options && script.options.length > 0 && !hasAnsweredOptions && !isTypingResponse && !pendingResponse) {
                setShowOptions(true);
            } else {
                setShowOptions(false);
            }
            return;
        }

        const nextMsg = script.messages[currentMsgIndex];
        const typingDuration = Math.min(nextMsg.text.length * 30 + 500, 3000);

        setIsTyping(true);

        const timer = setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages((prev) => [
                ...prev,
                {
                    ...nextMsg,
                    id: `${script.phaseId}_${nextMsg.id}_${currentMsgIndex}`,
                    speaker: "assistant"
                }
            ]);
            setCurrentMsgIndex((prev) => prev + 1);
        }, typingDuration);

        return () => clearTimeout(timer);
    }, [currentMsgIndex, script.phaseId, script.messages.length, pendingResponse, isTypingResponse, hasAnsweredOptions]);

    const handleOptionClick = (option: AgentOption) => {
        if (hasAnsweredOptions) return;
        setHasAnsweredOptions(true);
        setShowOptions(false);
        option.action();

        setVisibleMessages((prev) => [
            ...prev,
            {
                id: `user_${option.id}_${Date.now()}`,
                mood: "neutral",
                text: option.label,
                speaker: "user"
            }
        ]);

        if (option.response) {
            const responseText = option.response;
            const responseId = `response_${option.id}_${Date.now()}`;
            setTimeout(() => {
                setPendingResponse({
                    id: responseId,
                    mood: "neutral",
                    text: responseText,
                    speaker: "assistant"
                });
            }, 180);
        }
    };

    const renderMessage = (msg: AgentMessage) => {
        if (msg.speaker === "user") {
            return (
                <div key={msg.id} className="flex justify-end mt-2 md:mt-3">
                    <div className="max-w-[80%] md:max-w-[85%] rounded-3xl rounded-tr-sm bg-sky-600 text-white px-4 py-3 md:px-5 md:py-4 text-sm md:text-base shadow-sm">
                        {msg.text}
                    </div>
                </div>
            );
        }

        return (
            <div key={msg.id} className="flex justify-start gap-3 md:gap-4">
                <div className={`h-10 w-10 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-full border bg-white shadow-sm ${
                    msg.mood === "afraid" ? "border-red-200" : msg.mood === "smile" ? "border-sky-200" : "border-slate-200"
                }`}>
                    <img src={avatarByMood[msg.mood]} alt="Aida" className="h-full w-full object-cover object-top scale-[1.85] -translate-y-[12%] origin-top" draggable={false} />
                </div>
                <div className={`max-w-[80%] md:max-w-[85%] rounded-3xl rounded-tl-sm px-4 py-3 md:px-5 md:py-4 text-sm md:text-base leading-relaxed shadow-sm ${
                    msg.mood === "afraid" ? "bg-red-50 text-red-950 border border-red-100" : "bg-white text-slate-800 border border-slate-100"
                }`}>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Aida</div>
                    {msg.text}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Chat Verlauf - NO SCROLLBAR, letzte Nachricht sichtbar */}
            <div className="flex-grow p-3 md:p-4 overflow-hidden relative">
                {/* Scrollable content, aber hidden scrollbar */}
                <div className="h-full overflow-y-auto scroll-smooth scrollbar-hide">
                    <div className="space-y-3 md:space-y-4">
                        {visibleMessages.map(renderMessage)}

                        {isTyping && (
                            <div className="flex justify-start gap-3 md:gap-4 opacity-70">
                                <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full border border-slate-200 bg-white" />
                                <div className="rounded-3xl rounded-tl-sm bg-white border border-slate-100 px-4 py-3 md:px-5 md:py-4 shadow-sm flex items-center gap-1.5">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        {isTypingResponse && (
                            <div className="flex justify-start gap-3 md:gap-4 opacity-70">
                                <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full border border-slate-200 bg-white" />
                                <div className="rounded-3xl rounded-tl-sm bg-white border border-slate-100 px-4 py-3 md:px-5 md:py-4 shadow-sm flex items-center gap-1.5">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Quick Response Buttons - reduzierter Padding auf Mobile */}
            {showOptions && (
                <div className="px-3 py-2 md:p-4 md:py-6 bg-white border-t border-slate-100 grid gap-2 md:gap-3 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    {script.options?.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="w-full rounded-lg md:rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 md:py-4 text-sm md:text-base font-bold text-sky-800 transition hover:bg-sky-100 hover:border-sky-300"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
