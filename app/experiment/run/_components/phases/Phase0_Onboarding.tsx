// app/experiment/run/_components/phases/Phase0_Onboarding.tsx
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';
import { createExperimentSession, updateExperimentSession } from '@/app/lib/api/client';

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
        children: ReactNode;
        onNext: () => void;
        onPrev?: () => void;
        enableZoom?: boolean;
    };

    const StoryPage = ({ title, subTitle, image, children, onNext, onPrev, enableZoom = false }: StoryPageProps) => (
        <div className="min-h-[70dvh] flex items-center justify-center p-2 sm:p-4">
            <style>{`
                @keyframes zoomIn {
                    from {
                        transform: translateY(0) scale(1);
                        opacity: 0.9;
                    }
                    to {
                        transform: translateY(35%) scale(1.8);
                        opacity: 1;
                    }
                }
                .image-zoom {
                    animation: zoomIn 1.5s ease-out forwards;
                }
            `}</style>
            <div className="w-full max-w-5xl">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <p className="font-semibold">❌ Fehler:</p>
                        <p>{error}</p>
                    </div>
                )}
                <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
                    <div className="md:w-1/2 bg-slate-100 relative min-h-[220px] sm:min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden">
                        <img src={image} alt={title} className={`absolute inset-0 w-full h-full object-cover object-center ${enableZoom ? 'image-zoom' : ''}`} />
                    </div>
                    <div className="p-5 sm:p-8 md:p-12 flex-1 flex flex-col justify-between">
                        <div>
                            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-sky-700 mb-2">{subTitle}</p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">{title}</h1>
                            <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base">
                                {children}
                            </div>
                        </div>
                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
                            {onPrev ? (
                                <button onClick={onPrev} className="text-sm md:text-base font-semibold text-slate-500 hover:text-slate-800 transition">
                                    Zurück
                                </button>
                            ) : <div className="w-12 sm:w-16" />}
                            <button onClick={onNext} disabled={isLoading} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                                {isLoading ? 'Initialisiere...' : 'Weiter'}
                            </button>
                        </div>
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
            <StoryPage title="Lagezentrum & Aufgabenbereich" subTitle="Operator-Briefing" image="/images/onboarding/karte.png" onNext={() => setStoryStep(3)} onPrev={() => setStoryStep(1)} enableZoom={true}>
                <p>Als <strong>Operator</strong> in dieser Leitwarte überwachst du den laufenden Sicherheitsbetrieb der gesamten Anlage.</p>
                <p>Zu deinen Aufgaben gehören die Kontrolle der Grubenbewetterung (Lüftung), die Beobachtung von Gas- und Druckwerten sowie die Durchführung von Routinediagnosen.</p>
                <p className="border-l-4 border-amber-500 pl-4 bg-amber-50 py-3 rounded-r-lg">Im Störfall musst du die bereitgestellten Informationen bewerten und operative Entscheidungen treffen.</p>
            </StoryPage>
        );
    }

    if (storyStep === 3) {
        const isAvatar = group === 'AVATAR';
        return (
            <StoryPage
                title={isAvatar ? "KI-gestützte Assistenz: AIDA" : "Das taktische System-Terminal"}
                subTitle="Support durch das System"
                image={isAvatar ? "/images/onboarding/aida_vorstellung.png" : "/images/onboarding/leitstelle.png"}
                onNext={activateCommunication}
                onPrev={() => setStoryStep(2)}
            >
                <p>Die unterirdische Anlage ist zu komplex, um sie in einer Notfallsituation vollständig manuell zu überblicken. Daher steht dir das System zur Verfügung.</p>
                <p>Es bündelt Sensordaten aus der gesamten Mine, erkennt Anomalien, bewertet Risiken und berechnet Handlungsempfehlungen.</p>
                <p className="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-lg shadow-inner">
                    Das System ersetzt dich nicht, sondern unterstützt dich bei der Lageeinschätzung. <strong>Die finale operative Entscheidung bleibt jedoch beim menschlichen Operator – also bei dir.</strong>
                </p>
            </StoryPage>
        );
    }

    if (storyStep === 4 && currentPhase === 'ONBOARDING') {
        return (
            <div className="flex items-center justify-center w-full">
                <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg text-slate-800 max-w-2xl w-full">
                    
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <p className="font-semibold">❌ Fehler:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-sky-700">
                            Protokoll-Aktivierung
                        </p>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
                        Schichtübergabe
                    </h2>

                    <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base mb-8">
                        <p>Die sichere Verbindung zur Zentralinstanz ist hergestellt.</p>
                        <p>Bitte bestätige nun deine Bereitschaft über die KI-Kommunikation.</p>
                        <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm shadow-inner">
                            Das System startet im Anschluss das offizielle Schichtübergabe-Protokoll und übermittelt dir die aktuellen Sensordaten der Schieferkamm-Anlage.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {!isPhaseUnlocked ? (
                            <p className="text-sm md:text-base text-amber-600 animate-pulse font-bold flex items-center gap-2">
                                ⚠️ Warte auf Freigabe durch das Assistenzsystem.
                            </p>
                        ) : (
                            <p className="text-sm md:text-base text-emerald-600 font-bold flex items-center gap-2">
                                ✅ Übergabe bestätigt.
                            </p>
                        )}

                        <button
                            onClick={handleNextPhase}
                            disabled={!isPhaseUnlocked || isLoading}
                            className={`w-full sm:w-auto font-bold py-3 px-8 text-sm md:text-base rounded-xl transition-all shadow-md ${
                                isPhaseUnlocked
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? 'Lade Daten...' : 'Zum Leitwarten-Dashboard'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <div>Lade Systemumgebung...</div>;
}
