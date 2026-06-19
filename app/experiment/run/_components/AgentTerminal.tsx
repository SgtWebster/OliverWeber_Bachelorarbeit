// app/experiment/run/_components/AgentTerminal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import type { AgentScript, AgentOption, AgentMessage } from "./AgentAida";

export default function AgentTerminal({ script }: { script: AgentScript }) {
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
        const typingDuration = Math.min(nextMsg.text.length * 30 + 400, 3000);

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
        <div className="flex flex-col h-full bg-slate-950 font-mono text-emerald-500 p-3 md:p-4 overflow-hidden">
            {/* Terminal Output - NO SCROLLBAR, letzte Nachricht sichtbar */}
            <div className="flex-grow overflow-hidden relative">
                <div className="h-full overflow-y-auto scroll-smooth scrollbar-hide space-y-2 md:space-y-3 text-xs md:text-sm lg:text-base leading-relaxed">

                    {visibleMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-2 md:gap-3">
                            <span className="opacity-50 shrink-0">[SYS]:</span>
                            <span>{msg.text}</span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-2 md:gap-3 text-emerald-700">
                            <span className="opacity-50 shrink-0">[SYS]:</span>
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">PROCESSING DATA</span>
                                <span className="w-3 h-3 md:w-4 md:h-4 border-2 md:border-[3px] border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            </div>
                        </div>
                    )}

                    {userReply && (
                        <div className="flex gap-2 md:gap-3 mt-1 md:mt-2 text-sky-400">
                            <span className="opacity-50 shrink-0 text-sky-600">operator@leitwarte:~$</span>
                            <span>{userReply}</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {showOptions && (
                <div className="mt-2 md:mt-3 border-t border-slate-800 pt-2 md:pt-3 grid gap-2 md:gap-3 shrink-0">
                    <div className="text-[10px] md:text-xs uppercase text-slate-500 mb-1 md:mb-2">AWAITING INPUT...</div>
                    {script.options?.map((opt, index) => (
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