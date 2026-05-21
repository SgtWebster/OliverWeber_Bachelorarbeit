// app/page.tsx
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-6">
            <section className="max-w-3xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 sm:p-12 shadow-sm text-center">
                {/*<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 mb-6">*/}
                {/*    <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />*/}
                {/*    Welcome!*/}
                {/*</div>*/}

                <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    Oliver <span className="text-teal-300">Ulrich</span> Weber
                </h1>

                {/*<p className="mt-6 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg max-w-xl mx-auto">*/}
                {/*    Hallo! Ich bin Oliver. Aktuell baue ich diese Seite als zentralen Hub für meine zukünftigen Projekte und meine Bachelorarbeit am MCI Innsbruck auf.*/}
                {/*</p>*/}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <a
                        href="mailto:ulrich@oliver-weber.at"
                        className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                        Kontakt aufnehmen
                    </a>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Mehr über mich
                    </Link>
                </div>
            </section>
        </div>
    );
}