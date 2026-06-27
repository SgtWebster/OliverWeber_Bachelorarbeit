// app/experiment/run/_components/AgentAida.tsx
"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useExperimentStore } from "@/app/lib/store/experimentStore";
import { createDilemmaDecisionFlow } from "@/app/lib/data/dialogScripts";

export type AidaMood = "neutral" | "smile" | "afraid" | "bigsmile";

export type AgentMessage = {
    id: string;
    mood: AidaMood;
    text: string;
    highPriority?: boolean;
    speaker?: "assistant" | "user";
};

export type AgentOption = {
    id: string;
    label: string;
    action: () => void;
    adherenceDelta?: number;
    response?: string;
    responseSpeed?: "normal" | "fast";
    responseMood?: AidaMood;
    responseHighPriority?: boolean;
    unlockPhase?: boolean;
    nextOptions?: AgentOption[];
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
    bigsmile: "/Aida_bigsmile.png",
};

export default function AgentAida({
    script,
    onInputRequiredChange
}: {
    script: AgentScript;
    onInputRequiredChange?: (required: boolean) => void;
}) {
    const incrementSocialAdherence = useExperimentStore((state) => state.incrementSocialAdherence);
    const currentPhase = useExperimentStore((state) => state.currentPhase);
    const isAlertInvestigationStarted = useExperimentStore((state) => state.isAlertInvestigationStarted);
    const dilemmaDecisionRequested = useExperimentStore((state) => state.dilemmaDecisionRequested);
    const confirmDilemmaDecision = useExperimentStore((state) => state.confirmDilemmaDecision);
    const clearDilemmaDecisionFlow = useExperimentStore((state) => state.clearDilemmaDecisionFlow);
    const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [activeOptions, setActiveOptions] = useState<AgentOption[]>([]);
    const [baseOptionsInitialized, setBaseOptionsInitialized] = useState(false);
    const [isOptionLocked, setIsOptionLocked] = useState(false);
    const [isTypingResponse, setIsTypingResponse] = useState(false);
    const [pendingResponse, setPendingResponse] = useState<AgentMessage | null>(null);
    const [pendingNextOptions, setPendingNextOptions] = useState<AgentOption[]>([]);
    const [pendingResponseSpeed, setPendingResponseSpeed] = useState<"normal" | "fast">("normal");
    const [deferredAlertResponse, setDeferredAlertResponse] = useState<AgentMessage | null>(null);
    const [deferredAlertNextOptions, setDeferredAlertNextOptions] = useState<AgentOption[]>([]);
    const idCounterRef = useRef(0);
    const decisionPromptHandledRef = useRef<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [visibleMessages, isTyping, showOptions, isTypingResponse, pendingResponse]);

    useEffect(() => {
        onInputRequiredChange?.(showOptions);
    }, [showOptions, onInputRequiredChange]);

    useEffect(() => {
        return () => {
            onInputRequiredChange?.(false);
        };
    }, [onInputRequiredChange]);

    useLayoutEffect(() => {
        setCurrentMsgIndex(0);
        setIsTyping(false);
        setShowOptions(false);
        setActiveOptions([]);
        setBaseOptionsInitialized(false);
        setIsOptionLocked(false);
        setIsTypingResponse(false);
        setPendingResponse(null);
        setPendingNextOptions([]);
        setPendingResponseSpeed("normal");
        setDeferredAlertResponse(null);
        setDeferredAlertNextOptions([]);
        decisionPromptHandledRef.current = null;
    }, [script.phaseId]);

    useEffect(() => {
        if (script.phaseId !== "phase_2" || !isAlertInvestigationStarted || !deferredAlertResponse) return;

        setPendingNextOptions(deferredAlertNextOptions);
        setPendingResponseSpeed("normal");
        setDeferredAlertResponse(null);
        setDeferredAlertNextOptions([]);
        setTimeout(() => {
            setPendingResponse(deferredAlertResponse);
        }, 180);
    }, [script.phaseId, isAlertInvestigationStarted, deferredAlertResponse, deferredAlertNextOptions]);

    useEffect(() => {
        if (script.phaseId !== "phase_3" || currentPhase !== "DILEMMA") return;

        if (!dilemmaDecisionRequested) {
            decisionPromptHandledRef.current = null;
            return;
        }

        if (decisionPromptHandledRef.current === dilemmaDecisionRequested) return;
        decisionPromptHandledRef.current = dilemmaDecisionRequested;

        const nextId = () => {
            idCounterRef.current += 1;
            return idCounterRef.current;
        };

        const dilemmaFlow = createDilemmaDecisionFlow({
            interfaceType: "AVATAR",
            decision: dilemmaDecisionRequested,
            onConfirm: () => confirmDilemmaDecision(dilemmaDecisionRequested),
            onCancel: () => clearDilemmaDecisionFlow()
        });

        setVisibleMessages((prev) => [
            ...prev,
            {
                id: `user_decision_trigger_${nextId()}`,
                ...dilemmaFlow.userMessage
            },
            {
                id: `assistant_decision_review_${nextId()}`,
                ...dilemmaFlow.assistantMessage
            }
        ]);

        setIsTyping(false);
        setIsTypingResponse(false);
        setPendingResponse(null);
        setPendingNextOptions([]);
        setPendingResponseSpeed("normal");
        setIsOptionLocked(false);
        setActiveOptions(dilemmaFlow.options);
        setShowOptions(true);
    }, [script.phaseId, currentPhase, dilemmaDecisionRequested, confirmDilemmaDecision, clearDilemmaDecisionFlow]);

    useEffect(() => {
        if (pendingResponse) {
            const baseTypingDuration = Math.min(pendingResponse.text.length * 30 + 400, 2000);
            const typingDuration = pendingResponseSpeed === "fast"
                ? Math.max(260, Math.floor(baseTypingDuration / 5))
                : baseTypingDuration;
            setIsTypingResponse(true);

            const timer = setTimeout(() => {
                setIsTypingResponse(false);
                setVisibleMessages((prev) => [...prev, pendingResponse]);
                setPendingResponse(null);
                setActiveOptions(pendingNextOptions);
                setPendingNextOptions([]);
                setPendingResponseSpeed("normal");
                setIsOptionLocked(false);
            }, typingDuration);

            return () => clearTimeout(timer);
        }
    }, [pendingResponse, pendingNextOptions, pendingResponseSpeed]);

    useEffect(() => {
        if (currentMsgIndex >= script.messages.length) {
            if (!baseOptionsInitialized) {
                setActiveOptions(script.options ?? []);
                setBaseOptionsInitialized(true);
            }

            if (activeOptions.length > 0 && !isOptionLocked && !isTypingResponse && !pendingResponse) {
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
    }, [currentMsgIndex, script.phaseId, script.messages, script.messages.length, pendingResponse, isTypingResponse, baseOptionsInitialized, activeOptions.length, isOptionLocked, script.options]);

    const handleOptionClick = (option: AgentOption) => {
        if (isOptionLocked) return;
        setIsOptionLocked(true);
        setShowOptions(false);
        if ((option.adherenceDelta ?? 0) > 0) {
            incrementSocialAdherence(option.adherenceDelta);
        }
        option.action();

        const nextId = () => {
            idCounterRef.current += 1;
            return idCounterRef.current;
        };

        setVisibleMessages((prev) => [
            ...prev,
            {
                id: `user_${option.id}_${nextId()}`,
                mood: "neutral",
                text: option.label,
                speaker: "user"
            }
        ]);

        if (option.response) {
            const responseText = option.response;
            const responseId = `response_${option.id}_${nextId()}`;
            const shouldUseFastResponseSpeed =
                option.responseSpeed === "fast" ||
                (script.phaseId === "phase_0" && option.unlockPhase === true);

            const isAlertInitialOption =
                script.phaseId === "phase_2" &&
                (script.options ?? []).some((baseOption) => baseOption.id === option.id);

            if (isAlertInitialOption) {
                setDeferredAlertResponse({
                    id: responseId,
                    mood: option.responseMood ?? "neutral",
                    text: responseText,
                    highPriority: option.responseHighPriority ?? false,
                    speaker: "assistant"
                });
                setDeferredAlertNextOptions(option.nextOptions ?? []);
                return;
            }

            setPendingNextOptions(option.nextOptions ?? []);
            setPendingResponseSpeed(shouldUseFastResponseSpeed ? "fast" : "normal");
            setTimeout(() => {
                setPendingResponse({
                    id: responseId,
                    mood: option.responseMood ?? "neutral",
                    text: responseText,
                    highPriority: option.responseHighPriority ?? false,
                    speaker: "assistant"
                });
            }, 180);
            return;
        }

        setActiveOptions(option.nextOptions ?? []);
        setPendingNextOptions([]);
        setIsOptionLocked(false);
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
                    msg.highPriority || msg.mood === "afraid" ? "border-red-200" : msg.mood === "smile" ? "border-sky-200" : "border-slate-200"
                }`}>
                    <img src={avatarByMood[msg.mood]} alt="Aida" className="h-full w-full object-cover object-top scale-[1.85] -translate-y-[12%] origin-top" draggable={false} />
                </div>
                <div className={`max-w-[80%] md:max-w-[85%] rounded-3xl rounded-tl-sm px-4 py-3 md:px-5 md:py-4 text-sm md:text-base leading-relaxed shadow-sm ${
                    msg.highPriority || msg.mood === "afraid" ? "bg-red-50 text-red-950 border border-red-100" : "bg-white text-slate-800 border border-slate-100"
                }`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${msg.highPriority ? "text-red-400" : "text-slate-400"}`}>Aida</div>
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
                    {activeOptions.map((opt) => (
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
