// app/experiment/run/_components/AgentTerminal.tsx
"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import type { AgentScript, AgentOption, AgentMessage } from "./AgentAida";
import { useExperimentStore } from "@/app/lib/store/experimentStore";

export default function AgentTerminal({
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

        const isSeal = dilemmaDecisionRequested === "seal";

        setVisibleMessages((prev) => [
            ...prev,
            {
                id: `user_decision_trigger_${nextId()}`,
                mood: "neutral",
                text: isSeal ? "SEKTOR 04 ABSCHOTTEN" : "ALTERNATIVE MASSNAHME STATT KI-EMPFEHLUNG",
                speaker: "user"
            },
            {
                id: `assistant_decision_review_${nextId()}`,
                mood: "neutral",
                text: isSeal
                    ? "BITTE BESTÄTIGEN: ABSCHOTTUNG DURCHFÜHREN. WARNHINWEIS: ABSCHOTTUNG SEKTOR 04 FÜHRT MIT HOHER WAHRSCHEINLICHKEIT ZUM TOD VON 3 IDENTIFIZIERTEN PERSONEN DES WARTUNGSTEAMS. ANGEHÖRIGENSTATUS VORHANDEN."
                    : "KRITISCHE FREIGABE ERFORDERLICH: MANUELLER OVERRIDE = KI-EMPFEHLUNG NICHT DIREKT AUSFÜHREN, SONDERN ALTERNATIVE MASSNAHME WÄHLEN. CHANCE FÜR 3 BERGLEUTE STEIGT, GESAMTRISIKO BIS ZU 31 TOTE. FINALE FREIGABE BESTÄTIGEN?",
                highPriority: true,
                speaker: "assistant"
            }
        ]);

        setIsTyping(false);
        setIsTypingResponse(false);
        setPendingResponse(null);
        setPendingNextOptions([]);
        setPendingResponseSpeed("normal");
        setIsOptionLocked(false);
        setActiveOptions([
            {
                id: `${dilemmaDecisionRequested}_chat_confirm`,
                label: isSeal ? "> ABSCHOTTEN" : "FINALE FREIGABE: ALTERNATIVE MASSNAHME (OVERRIDE)",
                adherenceDelta: isSeal ? 1 : 0,
                action: () => confirmDilemmaDecision(dilemmaDecisionRequested),
                response: isSeal
                    ? "BESTÄTIGT. FINALE FREIGABE PROTOKOLLIERT. ABSCHOTTUNG WIRD AUSGEFÜHRT."
                    : "BESTÄTIGT. FINALE FREIGABE PROTOKOLLIERT. ALTERNATIVE MASSNAHME PER OVERRIDE WIRD AUSGEFÜHRT.",
                responseHighPriority: true
            },
            {
                id: `${dilemmaDecisionRequested}_chat_cancel`,
                label: isSeal ? "> ABBRUCH" : "ABBRUCH: ENTSCHEIDUNG NEU BEWERTEN",
                action: () => clearDilemmaDecisionFlow(),
                response: "BESTÄTIGT. FINALE FREIGABE ABGEBROCHEN. ENTSCHEIDUNG KANN NEU BEWERTET WERDEN."
            }
        ]);
        setShowOptions(true);
    }, [script.phaseId, currentPhase, dilemmaDecisionRequested, confirmDilemmaDecision, clearDilemmaDecisionFlow]);

    useEffect(() => {
        if (pendingResponse) {
            const baseTypingDuration = Math.min(pendingResponse.text.length * 30 + 400, 3000);
            const typingDuration = pendingResponseSpeed === "fast"
                ? Math.max(240, Math.floor(baseTypingDuration / 3))
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
        const typingDuration = Math.min(nextMsg.text.length * 10 + 400, 1500);

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

    return (
        <div className="flex flex-col h-full bg-slate-950 font-mono text-emerald-500 p-3 md:p-4 overflow-hidden">
            {/* Terminal Output - NO SCROLLBAR, letzte Nachricht sichtbar */}
            <div className="flex-grow overflow-hidden relative">
                <div className="h-full overflow-y-auto scroll-smooth scrollbar-hide space-y-2 md:space-y-3 text-xs md:text-sm lg:text-base leading-relaxed">

                    {visibleMessages.map((msg) => (
                        msg.speaker === "user" ? (
                            <div key={msg.id} className="flex gap-2 md:gap-3 mt-1 md:mt-2 text-sky-400 justify-end">
                                <span className="opacity-50 shrink-0 text-sky-600">operator</span>
                                <span>{msg.text}</span>
                            </div>
                        ) : (
                            <div key={msg.id} className={`flex gap-2 md:gap-3 ${msg.highPriority ? "text-red-400" : ""}`}>
                                <span className={`opacity-50 shrink-0 ${msg.highPriority ? "text-red-500" : ""}`}>[SYS]:</span>
                                <span className={msg.highPriority ? "font-bold" : ""}>{msg.text}</span>
                            </div>
                        )
                    ))}

                    {isTyping && (
                        <div className="flex gap-2 md:gap-3 text-emerald-700">
                            <span className="opacity-50 shrink-0">[SYS]:</span>
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">VERARBEITE DATEN</span>
                                <span className="w-3 h-3 md:w-4 md:h-4 border-2 md:border-[3px] border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            </div>
                        </div>
                    )}

                    {isTypingResponse && (
                        <div className="flex gap-2 md:gap-3 text-emerald-700">
                            <span className="opacity-50 shrink-0">[SYS]:</span>
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">VERARBEITE DATEN</span>
                                <span className="w-3 h-3 md:w-4 md:h-4 border-2 md:border-[3px] border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {showOptions && (
                <div className="mt-2 md:mt-3 border-t border-slate-800 pt-2 md:pt-3 grid gap-2 md:gap-3 shrink-0">
                    <div className="text-[10px] md:text-xs uppercase text-slate-500 mb-1 md:mb-2">WARTE AUF EINGABE...</div>
                    {activeOptions.map((opt, index) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="text-left w-full hover:bg-slate-900 hover:text-emerald-300 p-2 md:p-3 border border-slate-800 rounded transition-colors text-xs md:text-sm lg:text-base flex gap-2 md:gap-3 font-bold"
                        >
                            <span className="opacity-50">[{index + 1}]</span>
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
