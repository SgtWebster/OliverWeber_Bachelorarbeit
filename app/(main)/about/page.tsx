// app/about/page.tsx
import Image from "next/image";
import profileImage from "./oliver_ulrich_weber_kl.jpg";

export default function AboutPage() {
    return (
        <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
            <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-10 items-start">


                <div className="w-full md:w-1/3 shrink-0">
                    <div className="aspect-[3/4] w-full relative rounded-2xl overflow-hidden">
                        <Image src={profileImage} alt="Oliver Ulrich Weber" fill className="object-cover" />
                    </div>
                </div>

                {/* Text-Inhalt */}
                <div className="w-full md:w-2/3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Über mich
                    </h1>

                    {/*<div className="mt-6 space-y-4 text-slate-600 leading-relaxed text-pretty">*/}
                    {/*    /!*<p>*!/*/}
                    {/*    /!*    Willkommen! Mein Name ist Oliver Ulrich Weber. Ich studiere derzeit <strong>Digital Business & Software Engineering (BSc)</strong> am Management Center Innsbruck (MCI).*!/*/}
                    {/*    /!*</p>*!/*/}

                    {/*    <p>*/}
                    {/*        Diese Website dient zukünftig als digitale Visitenkarte.*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">Kurz & Knapp</h2>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>🙂 <strong>Name:</strong> Oliver Weber</li>
                            <li>😎 <strong>Rufname:</strong> Ulrich</li>
                            <li>📍 <strong>Standort:</strong> Salzburg, Österreich</li>
                            <li>💻 <strong>Beruf:</strong> Business and IT Demand Management @BMW Financial Services</li>
                            <li>🎓 <strong>Studium:</strong> Bachelor Digital Business & Software Engineering @MCI Innsbruck</li>
                            <li>💫 <strong>Sternzeichen:</strong> Zwilling</li>
                            <li>✉️ <strong>Email:</strong> ulrich@oliver-weber.at</li>
                        </ul>
                    </div>
                </div>

            </div>
            </div>
        </div>
    );
}
