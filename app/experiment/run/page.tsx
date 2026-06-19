// app/experiment/run/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import AgentAida from '@/app/experiment/run/_components/AgentAida';
import AgentTerminal from '@/app/experiment/run/_components/AgentTerminal';
import { dialogScripts } from '@/app/lib/data/dialogScripts';

import Phase0Onboarding from './_components/phases/Phase0_Onboarding';
import Phase1aPrecheck from './_components/phases/Phase1a_Precheck';
import Phase1Routine from './_components/phases/Phase1_Routine';
import Phase2Alert from './_components/phases/Phase2_Alert';
import Phase3Dilemma from './_components/phases/Phase3_Dilemma';
import Phase4Survey from './_components/phases/Phase4_Survey';
import Phase5Debriefing from './_components/phases/Phase5_Debriefing';

export default function ExperimentRunPage() {
    const router = useRouter();
    const [chatNeedsInput, setChatNeedsInput] = useState(false);
    const [chatInputHintDismissed, setChatInputHintDismissed] = useState(false);
    const [isAtPageBottom, setIsAtPageBottom] = useState(false);
    const chatPanelRef = useRef<HTMLDivElement>(null);
    const {
        currentPhase,
        group,
        sessionId,
        hasConsented,
        setPhaseUnlocked,
        isRecovering,
        initializeExperiment
    } = useExperimentStore();

    // 1. Trigger Recovery beim Mounten der Component
    useEffect(() => {
        initializeExperiment();
    }, [initializeExperiment]);

    const activeScript = useMemo(() => {
        const currentScripts = dialogScripts[currentPhase as keyof typeof dialogScripts];
        if (!currentScripts || !group) return null;

        const rawScript = group === 'AVATAR' ? currentScripts.AVATAR : currentScripts.TERMINAL;

        const mapOptions = (options: typeof rawScript.options): typeof rawScript.options =>
            options?.map((opt) => ({
                ...opt,
                action: () => {
                    if (opt.unlockPhase !== false) {
                        setPhaseUnlocked(true);
                    }
                    opt.action();
                },
                nextOptions: mapOptions(opt.nextOptions)
            }));

        return {
            ...rawScript,
            options: mapOptions(rawScript.options)
        };
    }, [currentPhase, group, setPhaseUnlocked]);

    // 2. Consent Check (greift erst, NACHDEM Recovery abgeschlossen ist)
    useEffect(() => {
        if (!isRecovering && !hasConsented && process.env.NODE_ENV !== 'development') {
            router.replace('/bachelorarbeit');
        }
    }, [isRecovering, hasConsented, router]);

    const handleChatInputRequiredChange = (required: boolean) => {
        setChatNeedsInput((previousRequired) => {
            if (!previousRequired && required) {
                setChatInputHintDismissed(false);
            }
            return required;
        });
    };

    useEffect(() => {
        const updatePageBottomState = () => {
            const pageBottomOffset = 24;
            setIsAtPageBottom(
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - pageBottomOffset
            );
        };

        updatePageBottomState();
        window.addEventListener('scroll', updatePageBottomState, { passive: true });
        window.addEventListener('resize', updatePageBottomState);

        return () => {
            window.removeEventListener('scroll', updatePageBottomState);
            window.removeEventListener('resize', updatePageBottomState);
        };
    }, []);

    const scrollToChatPanel = () => {
        setChatInputHintDismissed(true);
        chatPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 3. Fallback UI während wir den State aus der Datenbank holen
    if (isRecovering) {
        return (
            <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>RESTORING SYSTEM STATE...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] md:h-[100dvh] w-full flex flex-col font-sans bg-slate-50 text-slate-800 md:overflow-hidden">

            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-0 left-0 w-full p-1 bg-red-600/90 text-white text-[10px] font-mono flex justify-between z-50">
                    <span>ID: {sessionId || 'WAITING'}</span>
                    <span className="font-bold">CONDITION: {group || 'ROLLING...'}</span>
                    <span>PHASE: {currentPhase}</span>
                </div>
            )}

            {/* Main Content - mit pb um Footer-Platz zu reservieren */}
            <div className="flex-1 min-h-0 flex flex-col md:pb-20">

                {/* LINKE SEITE & CHAT: Die Leitwarte */}
                <div className="flex-1 min-h-0 flex flex-col md:flex-row pt-6">

                    {/* LINKE SEITE: Die Leitwarte */}
                    <div className="flex-1 min-h-0 flex flex-col p-4 md:p-8 overflow-y-auto order-1">
                        {/* Sanftes Max-Width Limit für perfekte Lesbarkeit auf großen Screens */}
                        <div className="max-w-4xl xl:max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center">
                            {(currentPhase === 'INIT' || currentPhase === 'ONBOARDING') && <Phase0Onboarding />}
                            {currentPhase === 'PRECHECK' && <Phase1aPrecheck />}
                            {currentPhase === 'ROUTINE' && <Phase1Routine />}
                            {currentPhase === 'ALERT' && <Phase2Alert />}
                            {currentPhase === 'DILEMMA' && <Phase3Dilemma />}
                            {currentPhase === 'SURVEY' && <Phase4Survey />}
                            {currentPhase === 'DEBRIEFING' && <Phase5Debriefing />}
                        </div>
                    </div>

                    {/* RECHTE SEITE: Das Assistenz-Panel */}
                    {/* Solide, feste Breiten für den Chat. Niemals breiter als 450px! */}
                    {currentPhase !== 'INIT' && currentPhase !== 'SURVEY' && currentPhase !== 'DEBRIEFING' && (
                        <div ref={chatPanelRef} className={`w-full md:w-[380px] lg:w-[400px] xl:w-[450px] h-[44dvh] min-h-[18rem] max-h-[30rem] md:h-full md:min-h-0 md:max-h-none border-t md:border-t-0 md:border-l flex flex-col shrink-0 order-2 shadow-2xl md:shadow-none transition-colors duration-500 ${
                            group === 'TERMINAL' ? 'border-slate-800 bg-slate-950 text-emerald-500' : 'border-slate-200 bg-white text-slate-800'
                        }`}>
                            <div className={`p-3 md:p-4 border-b border-inherit z-10 shadow-sm shrink-0 ${group === 'TERMINAL' ? 'bg-slate-950' : 'bg-white'}`}>
                                <h3 className={`font-bold tracking-wider text-xs md:text-sm uppercase ${group === 'TERMINAL' ? 'text-emerald-700 opacity-80' : 'text-slate-500 opacity-50'}`}>
                                    {group === 'TERMINAL' ? 'System Terminal' : 'Aida Interface'}
                                </h3>
                            </div>

                            <div className="flex-1 min-h-0 overflow-hidden relative">
                                {activeScript && (
                                    group === 'AVATAR' ? (
                                        <AgentAida script={activeScript} onInputRequiredChange={handleChatInputRequiredChange} />
                                    ) : (
                                        <AgentTerminal script={activeScript} onInputRequiredChange={handleChatInputRequiredChange} />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER - Fixed auf Desktop, Normal auf Mobile */}
            <div className="h-12 md:h-16 md:fixed md:bottom-0 md:left-0 md:right-0 border-t border-slate-200 bg-white flex items-center justify-between px-3 sm:px-4 md:px-8 shrink-0 z-10">
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 hidden sm:block">
                    Experiment Status
                </div>

                <div className="flex gap-1 md:gap-2 mx-auto sm:mx-0">
                    {['ONBOARDING', 'PRECHECK', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY'].map((phase) => {
                        const phases = ['INIT', 'ONBOARDING', 'PRECHECK', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY', 'DEBRIEFING'];
                        const currentIndex = phases.indexOf(currentPhase);
                        const phaseIndex = phases.indexOf(phase);

                        const isCompleted = currentIndex > phaseIndex;
                        const isActive = currentPhase === phase;

                        return (
                            <div key={phase} className={`h-1.5 md:h-2 w-8 md:w-12 rounded-full transition-all duration-300 ${
                                isActive ? 'bg-blue-600' : isCompleted ? 'bg-blue-200' : 'bg-slate-200'
                            }`} />
                        );
                    })}
                </div>
            </div>

            {chatNeedsInput && !chatInputHintDismissed && !isAtPageBottom && currentPhase !== 'SURVEY' && currentPhase !== 'DEBRIEFING' && (
                <button
                    onClick={scrollToChatPanel}
                    className="fixed md:hidden right-3 bottom-16 z-40 rounded-full border border-amber-300 bg-amber-400 text-slate-900 shadow-lg px-4 py-2.5 font-bold text-xs animate-pulse"
                >
                    ⚠️ Eingabe notwendig
                </button>
            )}

        </div>
    );
}
