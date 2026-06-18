// app/experiment/run/_components/phases/Phase0_Onboarding.tsx
"use client";

import { useState, useEffect } from 'react';
import { useExperimentStore } from '@/app/lib/store/experimentStore';

export default function Phase0Onboarding() {
    const {
        sessionId,
        group,
        currentPhase,
        setPhase,
        setSessionId,
        setGroup,
        isPhaseUnlocked,
        setPhaseUnlocked
    } = useExperimentStore();

    const [isLoading, setIsLoading] = useState(false);
    const [storyStep, setStoryStep] = useState(1);

    useEffect(() => {
        if (!group) {
            setGroup(Math.random() < 0.5 ? 'AVATAR' : 'TERMINAL');
        }
    }, [group, setGroup]);

    const activateCommunication = async () => {
        if (isLoading || !group) return;
        setIsLoading(true);

        const generatedId = typeof window !== 'undefined' && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

        try {
            const response = await fetch('/api/experiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: generatedId, group: group }),
            });

            if (!response.ok) throw new Error('Datenbank-Eintrag fehlgeschlagen');

            setSessionId(generatedId);
            setPhase('ONBOARDING');
            setPhaseUnlocked(false);
            setStoryStep(4);
        } catch (err) {
            console.error("Kritischer Fehler bei der Initialisierung:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPhase = async () => {
        if (!sessionId || !isPhaseUnlocked || isLoading) return;
        setIsLoading(true);

        try {
            const res = await fetch('/api/experiment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, currentPhase: 'ROUTINE' }),
            });

            if (!res.ok) throw new Error('DB Update fehlgeschlagen');
            setPhase('ROUTINE');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const StoryPage = ({ title, subTitle, image, children, onNext, onPrev }: any) => (
        <div className="min-h-[70dvh] flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
                <div className="md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-slate-200">
                    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">
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
                        ) : <div></div>}
                        <button onClick={onNext} disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all">
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
            <StoryPage title="Lagezentrum & Aufgabenbereich" subTitle="Operator-Briefing" image="/images/onboarding/karte.png" onNext={() => setStoryStep(3)} onPrev={() => setStoryStep(1)}>
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
                        Schichtübergabe anfordern
                    </h2>

                    <div className="text-slate-600 space-y-4 leading-relaxed text-sm md:text-base mb-8">
                        <p>Die sichere Verbindung zur Zentralinstanz ist hergestellt.</p>
                        <p>Bitte richte deine Aufmerksamkeit nun auf das <strong className="text-slate-900">Assistenz-Panel auf der rechten Seite</strong>, um deine Identifikation zu bestätigen.</p>
                        <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm shadow-inner">
                            Das System startet im Anschluss das offizielle Schichtübergabe-Protokoll und übermittelt dir die aktuellen Sensordaten der Schieferkamm-Anlage.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {!isPhaseUnlocked ? (
                            <p className="text-sm md:text-base text-amber-600 animate-pulse font-bold flex items-center gap-2">
                                ⚠️ Warte auf Bestätigung...
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
                            {isLoading ? 'Lade Daten...' : 'Schicht antreten'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <div>Lade Systemumgebung...</div>;
}