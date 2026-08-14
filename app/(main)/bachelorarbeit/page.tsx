// app/(main)/bachelorarbeit/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

const title = 'Bachelorarbeit Oliver Weber';
const description =
    'Vielen Dank für die Teilnahme am Experiment zur Bachelorarbeit. Die Forschungsergebnisse werden in Kürze hier präsentiert.';

export const metadata: Metadata = {
    metadataBase: new URL('https://oliver-weber.at'),
    title,
    description,
    alternates: {
        canonical: '/bachelorarbeit',
    },
    openGraph: {
        title: 'Bachelorarbeit Oliver Weber',
        description,
        url: '/bachelorarbeit',
        siteName: title,
        locale: 'de_AT',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Bachelorarbeit Oliver Weber',
        description,
    },
};

export default function BachelorarbeitLandingPage() {
    return (
        <div className="min-h-[80vh] max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center">
            {/* Card Container mit responsivem Design & sichtbarem Glasturm-Bild */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/70 bg-slate-950 shadow-2xl flex flex-col md:flex-row md:min-h-[580px]">
                
                {/* Mobile Bild-Header: Glasturm oben prominent & scharf */}
                <div className="relative w-full h-56 sm:h-72 md:hidden overflow-hidden">
                    <img
                        src="/glasturm.jpg"
                        alt="Schieferkamm Mining Glasturm"
                        className="w-full h-full object-cover object-[center_30%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-right text-[11px] shadow-lg">
                        <p className="font-bold text-slate-200">Schieferkamm Facility</p>
                        <p className="text-slate-400">Zentraler Kontrollturm</p>
                    </div>
                </div>

                {/* Desktop Hintergrundbild: Glasturm */}
                <div className="hidden md:block absolute inset-0 md:left-1/4 overflow-hidden pointer-events-none">
                    <img
                        src="/glasturm.jpg"
                        alt="Schieferkamm Mining Glasturm"
                        className="w-full h-full object-cover object-[center_30%]"
                    />
                    {/* Horizontale Abdunklung von links nach rechts für optimalen Kontrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 md:via-slate-950/70 to-slate-950/15" />
                    {/* Vertikale Verläufe oben/unten zur weichen Einbettung */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 w-full md:w-3/5 p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center text-left">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 backdrop-blur-md shadow-md w-fit">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        MCI Innsbruck • Bachelorarbeit
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-sm">
                        Vielen Dank für deine Unterstützung!
                    </h1>

                    {/* Text */}
                    <div className="space-y-3 sm:space-y-4 text-slate-200 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base md:text-lg">
                        <p>
                            Die Datenerhebung für das Experiment im Rahmen meiner Bachelorarbeit im Studiengang{' '}
                            <strong className="text-white font-semibold">Digital Business & Software Engineering</strong> ist offiziell abgeschlossen.
                        </p>
                        <p className="text-slate-300">
                            Ein riesiges Dankeschön an alle Teilnehmerinnen und Teilnehmer, die sich die Zeit genommen und wertvolle Daten für die Forschung beigesteuert haben!
                        </p>
                    </div>

                    {/* Infobox: Forschungsergebnisse */}
                    <div className="w-full bg-slate-900/85 border border-slate-700/90 text-slate-200 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 shadow-xl backdrop-blur-md">
                        <div className="flex items-start gap-3.5 sm:gap-4">
                            <div className="p-2 sm:p-2.5 bg-teal-500/15 border border-teal-500/30 rounded-xl text-teal-300 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <div>
                                <strong className="block text-white font-bold text-sm sm:text-base mb-1">
                                    Forschungsergebnisse demnächst verfügbar
                                </strong>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    Die erhobenen Daten werden aktuell analysiert und aufbereitet. Die zentralen Erkenntnisse und Auswertungen der Arbeit werden demnächst direkt hier präsentiert.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm sm:text-base text-center"
                        >
                            Zur Startseite
                        </Link>
                    </div>
                </div>

                {/* Rechte Seite (Desktop): Ausblick auf den Turm mit Status-Plakette */}
                <div className="hidden md:flex md:w-2/5 p-8 relative z-10 flex-col justify-end items-end pointer-events-none">
                    <div className="bg-slate-950/70 border border-slate-700/80 backdrop-blur-md px-4 py-2.5 rounded-xl text-right text-xs shadow-lg">
                        <p className="font-bold text-slate-200">Ort des Experiments: Schieferkamm Facility</p>
                        <p className="text-slate-400">Der zentrale Kontrollturm</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
