// app/experiment/run/_components/AgentTerminal.tsx
"use client";

import { useState, useEffect } from "react";
import type { AgentScript, AgentOption, AgentMessage } from "./AgentAida";

export default function AgentTerminal({ script }: { script: AgentScript }) {
    const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [userReply, setUserReply] = useState<string | null>(null);

    // Hard-Reset beim Phasenwechsel
    useEffect(() => {
        setVisibleMessages([]);
        setCurrentMsgIndex(0);
        setIsTyping(false);
        setShowOptions(false);
        setUserReply(null);
    }, [script.phaseId]);

    // Die Takt-Maschine (EXAKT dieselbe Taktung wie Aida für Daten-Validität!)
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
        <div className="flex flex-col h-full bg-slate-950 font-mono text-emerald-500 p-4 overflow-hidden">
            <div className="flex-grow overflow-y-auto space-y-2 text-xs leading-relaxed">

                {/* Boot Sequence / Header */}
                <div className="opacity-50 mb-4">
                    <p>SYSTEM TERMINAL v2.4.1</p>
                    <p>SECURE CONNECTION ESTABLISHED.</p>
                    <p>--------------------------------</p>
                </div>

                {/* Nachrichten rendern (Ignoriert den 'mood' komplett) */}
                {visibleMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                        <span className="opacity-50 shrink-0">[SYS]:</span>
                        <span>{msg.text}</span>
                    </div>
                ))}

                {/* Typing Indicator (Terminal Load-Spinner) */}
                {isTyping && (
                    <div className="flex gap-3 text-emerald-700">
                        <span className="opacity-50 shrink-0">[SYS]:</span>
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse">PROCESSING DATA</span>
                            {/* Ein rotierender CSS-Halbkreis, der wie ein Ladesymbol wirkt */}
                            <span className="w-3 h-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>
                )}

                {/* User Reply */}
                {userReply && (
                    <div className="flex gap-3 mt-6 text-sky-400">
                        <span className="opacity-50 shrink-0 text-sky-600">operator@leitwarte:~$</span>
                        <span>{userReply}</span>
                    </div>
                )}
            </div>

            {/* Quick Response Buttons als Terminal-Inputs */}
            {showOptions && (
                <div className="mt-4 border-t border-slate-800 pt-4 grid gap-2">
                    <div className="text-[10px] uppercase text-slate-500 mb-2">AWAITING INPUT...</div>
                    {script.options?.map((opt, index) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="text-left w-full hover:bg-slate-900 hover:text-emerald-300 p-2 border border-slate-800 rounded transition-colors text-xs flex gap-3"
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