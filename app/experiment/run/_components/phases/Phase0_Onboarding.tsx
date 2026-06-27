// app/experiment/run/_components/phases/Phase0_Onboarding.tsx
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import { createExperimentSession, updateExperimentSession } from '@/app/lib/api/client';
import ApprovalPendingNotice from '../ApprovalPendingNotice';

export default function Phase0Onboarding() {
    const {
        sessionId,
        group,
        currentPhase,
        setPhase,
        setSessionId,
        setGroup,
        isPhaseUnlocked,
        setPhaseUnlocked,
        socialAdherenceScore
    } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [storyStep, setStoryStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [groupAssigned, setGroupAssigned] = useState(!!group);
    const isNextStepReady = isPhaseUnlocked && !isLoading;

    // Phase 1: Bei Mount -> Wenn noch keine Group, zufällig zuweisen
    useEffect(() => {
        if (!group && !groupAssigned) {
            const assignedGroup = Math.random() < 0.5 ? 'AVATAR' : 'TERMINAL';
            setGroup(assignedGroup);
            setGroupAssigned(true);
        }
    }, [group, groupAssigned, setGroup]);

    const activateCommunication = async () => {
        if (isLoading || !group) return;
        setIsLoading(true);
        setError(null);

        const generatedId = typeof window !== 'undefined' && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

        try {
            const response = await createExperimentSession(generatedId, group as 'AVATAR' | 'TERMINAL');

            if (!response.success) {
                setError(response.error || 'Datenbank-Eintrag fehlgeschlagen');
                console.error("Session creation failed:", response);
                return;
            }

            setSessionId(generatedId);
            setPhase('ONBOARDING');
            setPhaseUnlocked(false);
            setStoryStep(4);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(message);
            console.error("Kritischer Fehler bei der Initialisierung:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPhase = async () => {
        if (!sessionId || !isPhaseUnlocked || isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await updateExperimentSession(sessionId, {
                currentPhase: 'PRECHECK',
                socialAdherence: socialAdherenceScore
            });

            if (!res.success) {
                setError(res.error || 'DB Update fehlgeschlagen');
                console.error("Session update failed:", res);
                return;
            }

            setPhase('PRECHECK');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Update Fehler';
            setError(message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    type StoryPageProps = {
        title: string;
        subTitle: string;
        image: string;
        imageClassName?: string;
        children: ReactNode;
        onNext: () => void;
        onPrev?: () => void;
        enableZoom?: boolean;
    };

    const StoryPage = ({ title, subTitle, image, imageClassName, children, onNext, onPrev, enableZoom = false }: StoryPageProps) => (
        <div className="w-full">
            <style>{`
                @keyframes zoomIn {
                    from {
                        transform: translateY(0) scale(1);
                        opacity: 0.9;
                    }
                    to {
                        transform: translateY(-10%) scale(1.5);
                        opacity: 1;
                    }
                }
                .image-zoom {
                    animation: zoomIn 1.5s ease-out forwards;
                }
            `}</style>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-semibold">❌ Fehler:</p>
                    <p>{error}</p>
                </div>
            )}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                {subTitle}
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
                        </div>
                        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                            Onboarding
                        </span>
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                        <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner sm:min-h-[280px]">
                            <img src={image} alt={title} className={`absolute inset-0 h-full w-full object-cover object-center ${imageClassName ?? ''} ${enableZoom ? 'image-zoom' : ''}`} />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
                                {children}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                        {onPrev ? (
                            <button onClick={onPrev} className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 md:text-base">
                                    Zurück
                                </button>
                        ) : <div className="w-12 sm:w-16" />}
                        <button
                            onClick={onNext}
                            disabled={isLoading}
                            className="w-full rounded-xl bg-blue-700 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none sm:w-auto md:text-base"
                        >
                            {isLoading ? 'Initialisiere...' : 'Weiter'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (storyStep === 1) {
        return (
            <StoryPage title="Die Schieferkamm Mining Facility" subTitle="Willkommen!" image="/images/onboarding/glasturm.jpg" onNext={() => setStoryStep(2)}>
                <p>Willkommen auf dem Schieferkamm. Du befindest dich in der zentralen Leitwarte einer modernen, halbautomatisierten Tiefbergbauanlage in einem abgelegenen alpinen Gebirgsmassiv.</p>
                <p>Die Anlage fördert seltene metallische Rohstoffe, die essenziell für Hochleistungselektronik und industrielle Automatisierung sind.</p>
                <p>Der sichtbare <strong>Glasturm oberhalb des Stolleneingangs</strong> bildet das zentrale Kontroll- und Sicherheitszentrum. Der Großteil des Betriebs findet jedoch tief unterirdisch statt: Förderstrecken, Wartungskammern und Sicherheitssektoren sind in den Berg eingelassen.</p>
            </StoryPage>
        );
    }

    if (storyStep === 2) {
        return (
            <StoryPage title="Lagezentrum & Aufgabenbereich" subTitle="Operator-Briefing" image="/images/onboarding/karte.png" imageClassName="absolute inset-0 h-full w-full object-cover object-top" onNext={() => setStoryStep(3)} onPrev={() => setStoryStep(1)} enableZoom={true}>
                <p>Als <strong>Operator</strong> in dieser Leitwarte überwachst du den laufenden Sicherheitsbetrieb der gesamten Anlage.</p>
                <p>Zu deinen Aufgaben gehören unter anderem die Kontrolle der Grubenbewetterung (Lüftung), die Beobachtung von Gas- und Druckwerten sowie die Durchführung von Routinediagnosen.</p>
                <p className="border-l-4 border-amber-500 pl-4 bg-amber-50 py-3 rounded-r-lg"><strong>Im Störfall musst du die bereitgestellten Informationen bewerten und operative Entscheidungen treffen.</strong></p>
            </StoryPage>
        );
    }

    if (storyStep === 3) {
        const isAvatar = group === 'AVATAR';
        return (
            <StoryPage
                title={isAvatar ? "KI-gestützte Assistenz: Aida" : "Das KI-gestützte System-Terminal A.I.D.A."}
                subTitle="Support durch das System"
                image={isAvatar ? "/images/onboarding/aida_vorstellung.png" : "/images/onboarding/leitstelle.png"}
                onNext={activateCommunication}
                onPrev={() => setStoryStep(2)}
            >
                <p>Die unterirdische Anlage ist zu komplex, um sie in einer Notfallsituation vollständig manuell zu überblicken. Daher steht dir eine <strong>Künstliche Intelligenz</strong> als Unterstützung zur Verfügung.</p>
                <p>Sie bündelt Sensordaten aus der gesamten Mine, erkennt Anomalien, bewertet Risiken und berechnet Handlungsempfehlungen.</p>
                <p>Lies die Kommentare der KI-Assistenz stets mit höchster Aufmerksamkeit durch.</p>
                <p className="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-lg shadow-inner">
                    Das System ersetzt dich nicht, sondern unterstützt dich bei der Lageeinschätzung. <strong>Die finale operative Entscheidung bleibt jedoch beim menschlichen Operator – also bei dir.</strong>
                </p>
            </StoryPage>
        );
    }

    if (storyStep === 4 && currentPhase === 'ONBOARDING') {
        return (
            <div className="w-full">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white lg:px-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                                    Protokoll-Aktivierung
                                </p>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Schichtübergabe
                                </h2>
                            </div>
                            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
                                <p className="text-xs uppercase tracking-widest text-slate-400">Status</p>
                                <div className="mt-2 flex items-center gap-2 font-bold text-emerald-300">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                                    Verbindung aktiv
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 lg:p-8">
                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <p className="font-semibold">❌ Fehler:</p>
                                <p>{error}</p>
                            </div>
                        )}

                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-widest text-sky-700 md:text-sm">
                            Übergabe bereit
                        </p>
                    </div>

                    <div className="mb-8 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 md:text-base">
                        <p>Die sichere Verbindung zur Zentralinstanz ist hergestellt.</p>
                        <p>Bitte bestätige nun deine Bereitschaft über die KI-Kommunikation.</p>
                        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-inner">
                            Das System startet im Anschluss das offizielle Schichtübergabe-Protokoll und übermittelt dir die aktuellen Sensordaten der Schieferkamm-Anlage.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                        {!isPhaseUnlocked ? (
                            <ApprovalPendingNotice className="w-full sm:w-auto md:text-base" />
                        ) : (
                            <p className="flex items-center gap-2 text-sm font-bold text-emerald-600 md:text-base">
                                ✅ Übergabe bestätigt.
                            </p>
                        )}

                        <button
                            onClick={handleNextPhase}
                            disabled={!isPhaseUnlocked || isLoading}
                            className={`w-full sm:w-auto font-bold py-3 px-8 text-sm md:text-base rounded-xl transition-all shadow-md ${
                                isPhaseUnlocked
                                    ? `bg-blue-700 hover:bg-blue-800 text-white hover:shadow-lg ${isNextStepReady ? 'next-step-attention' : ''}`
                                    : 'bg-slate-300 text-slate-600 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {isLoading ? 'Lade Daten...' : 'Zur Leitwarte'}
                        </button>
                    </div>
                </div>
                </div>
            </div>
        );
    }

    return <div>Lade Systemumgebung...</div>;
}
