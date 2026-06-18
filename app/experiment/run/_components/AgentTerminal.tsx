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
        <div className="flex flex-col h-full bg-slate-950 font-mono text-emerald-500 p-4 md:p-6 overflow-hidden">
            <div className="flex-grow overflow-y-auto space-y-3 md:space-y-4 text-sm md:text-base 2xl:text-lg leading-relaxed">

                {visibleMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 md:gap-4">
                        <span className="opacity-50 shrink-0">[SYS]:</span>
                        <span>{msg.text}</span>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 md:gap-4 text-emerald-700">
                        <span className="opacity-50 shrink-0">[SYS]:</span>
                        <div className="flex items-center gap-3">
                            <span className="animate-pulse">PROCESSING DATA</span>
                            <span className="w-4 h-4 md:w-5 md:h-5 border-[3px] border-emerald-700 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>
                )}

                {userReply && (
                    <div className="flex gap-3 md:gap-4 mt-8 text-sky-400">
                        <span className="opacity-50 shrink-0 text-sky-600">operator@leitwarte:~$</span>
                        <span>{userReply}</span>
                    </div>
                )}

                <div className="h-8 md:h-12 shrink-0" />
                <div ref={messagesEndRef} />
            </div>

            {showOptions && (
                <div className="mt-4 md:mt-6 border-t border-slate-800 pt-4 md:pt-6 grid gap-3 md:gap-4 shrink-0">
                    <div className="text-xs md:text-sm uppercase text-slate-500 mb-2 md:mb-3">AWAITING INPUT...</div>
                    {script.options?.map((opt, index) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="text-left w-full hover:bg-slate-900 hover:text-emerald-300 p-4 md:p-5 border border-slate-800 rounded-lg transition-colors text-sm md:text-base 2xl:text-lg flex gap-3 md:gap-4 font-bold"
                        >
                            <span className="opacity-50">[{index + 1}]</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}