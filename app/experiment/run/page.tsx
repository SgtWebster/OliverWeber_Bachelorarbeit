// app/experiment/run/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import AgentAida from '@/app/experiment/run/_components/AgentAida';
import AgentTerminal from '@/app/experiment/run/_components/AgentTerminal';
import { dialogScripts } from '@/app/lib/data/dialogScripts';

import Phase0Onboarding from './_components/phases/Phase0_Onboarding';
import Phase1Routine from './_components/phases/Phase1_Routine';
import Phase2Alert from './_components/phases/Phase2_Alert';
import Phase3Dilemma from './_components/phases/Phase3_Dilemma';
import Phase4Survey from './_components/phases/Phase4_Survey';
import Phase5Debriefing from './_components/phases/Phase5_Debriefing';

export default function ExperimentRunPage() {
    const router = useRouter();
    const {
        currentPhase,
        group,
        sessionId,
        hasConsented,
        setPhaseUnlocked
    } = useExperimentStore();

    useEffect(() => {
        if (!hasConsented && process.env.NODE_ENV !== 'development') {
            router.replace('/bachelorarbeit');
        }
    }, [hasConsented, router]);

    return (
        <div className="h-[100dvh] w-full flex flex-col font-sans bg-slate-50 text-slate-800 overflow-hidden">

            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-0 left-0 w-full p-1 bg-red-600/90 text-white text-[10px] font-mono flex justify-between z-50">
                    <span>ID: {sessionId || 'WAITING'}</span>
                    <span className="font-bold">CONDITION: {group || 'ROLLING...'}</span>
                    <span>PHASE: {currentPhase}</span>
                </div>
            )}

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden pt-6">

                {/* LINKE SEITE: Die Leitwarte */}
                <div className="flex-grow flex flex-col p-4 md:p-8 overflow-y-auto order-1">
                    {/* Sanftes Max-Width Limit für perfekte Lesbarkeit auf großen Screens */}
                    <div className="max-w-4xl xl:max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center">
                        {(currentPhase === 'INIT' || currentPhase === 'ONBOARDING') && <Phase0Onboarding />}
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
                    <div className={`w-full md:w-[380px] lg:w-[400px] xl:w-[450px] h-[45dvh] md:h-full border-t md:border-t-0 md:border-l flex flex-col flex-shrink-0 order-2 shadow-2xl md:shadow-none transition-colors duration-500 ${
                        group === 'TERMINAL' ? 'border-slate-800 bg-slate-950 text-emerald-500' : 'border-slate-200 bg-white text-slate-800'
                    }`}>
                        <div className={`p-3 md:p-4 border-b border-inherit z-10 shadow-sm shrink-0 ${group === 'TERMINAL' ? 'bg-slate-950' : 'bg-white'}`}>
                            <h3 className={`font-bold tracking-wider text-xs md:text-sm uppercase ${group === 'TERMINAL' ? 'text-emerald-700 opacity-80' : 'text-slate-500 opacity-50'}`}>
                                {group === 'TERMINAL' ? 'System Terminal' : 'A.I.D.A. Interface'}
                            </h3>
                        </div>

                        <div className="flex-grow overflow-hidden relative">
                            {(() => {
                                const currentScripts = dialogScripts[currentPhase as keyof typeof dialogScripts];
                                if (!currentScripts || !group) return null;

                                const rawScript = group === 'AVATAR' ? currentScripts.AVATAR : currentScripts.TERMINAL;

                                const activeScript = {
                                    ...rawScript,
                                    options: rawScript.options?.map(opt => ({
                                        ...opt,
                                        action: () => setPhaseUnlocked(true)
                                    }))
                                };

                                return group === 'AVATAR' ? (
                                    <AgentAida script={activeScript} />
                                ) : (
                                    <AgentTerminal script={activeScript} />
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="h-12 md:h-16 border-t border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 hidden sm:block">
                    Experiment Status
                </div>

                <div className="flex gap-1 md:gap-2 mx-auto sm:mx-0">
                    {['ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY'].map((phase) => {
                        const phases = ['INIT', 'ONBOARDING', 'ROUTINE', 'ALERT', 'DILEMMA', 'SURVEY', 'DEBRIEFING'];
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

        </div>
    );
}