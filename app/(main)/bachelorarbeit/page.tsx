// app/(main)/bachelorarbeit/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

const title = 'Bachelorarbeit Oliver Weber';
const description =
    'Nimm am Experiment zu meiner Bachelorarbeit teil';

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
        <div className="min-h-[70vh] max-w-5xl mx-auto px-4 py-16 flex items-center justify-center text-slate-800">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">

                {/* LINKE SEITE: Text & Call-to-Action */}
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-2">MCI Innsbruck • Bachelorarbeit</p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Forschungsprojekt: Mensch & Maschine
                    </h1>


                    <div className="space-y-4 text-slate-600 mb-8 leading-relaxed">
                        <p>
                            Hallo! Ich schreibe aktuell meine Bachelorarbeit im Studiengang Digital Business & Software Engineering und brauche deine Unterstützung.
                        </p>
                        <p>
                            Für das finale Experiment meiner Arbeit suche ich Freiwillige. Die Teilnahme dauert nur wenige Minuten, ist komplett anonym und hilft mir extrem bei meinem Abschluss.
                        </p>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-xl mt-6 shadow-sm">
                            <strong className="block mb-2 text-emerald-800 text-lg">🎁 Als Dankeschön:</strong>
                            Unter allen Teilnehmenden verlose ich am Ende <strong>1x 50,- Euro und 2x 25,- Euro Amazon Gutscheine</strong>.
                            Die Teilnahme am Gewinnspiel ist völlig freiwillig und wird strikt von deinen Testdaten getrennt.
                        </div>
                    </div>

                    <Link
                        href="/experiment"
                        className="inline-block text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        Zum Experiment & Teilnahmebedingungen
                    </Link>
                </div>

                {/* RECHTE SEITE: Das Hochformat-Foto */}
                <div className="md:w-2/5 bg-slate-100 relative min-h-[300px] md:min-h-full border-t md:border-t-0 md:border-l border-slate-200">
                    <img
                        src="/gutscheine.png"
                        alt="Ulrich mit Amazon Gutscheinen"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

            </div>
        </div>
    );
}
