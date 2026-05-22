// app/page.tsx
import Link from "next/link";
import profileImage from "@/app/(main)/about/oliver_ulrich_weber_kl.jpg";
// Falls du Next.js Image nutzt, importiere es: import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-6">
            <section className="max-w-3xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 sm:p-12 shadow-sm text-center">

                <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    Oliver <span className="text-teal-300">Ulrich</span> Weber
                </h1>

                {/* Chat-Sprechblase */}
                <div className="mt-10 mx-auto max-w-xl flex items-start gap-4 text-left">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-teal-300 scale-[1.50] shrink-0 mt-1 overflow-hidden">
                        <img
                            src={profileImage.src}
                            alt="Oliver"
                            className="w-full h-full object-cover object-top  scale-160 -translate-y-[-05%] -translate-x-[-5%]"
                        />
                    </div>
                    <div className="flex-1 relative bg-slate-800 border border-slate-700 p-4 sm:p-5 text-slate-300 rounded-2xl rounded-tl-none shadow-sm">
                        {/* Äußeres Dreieck für den Rahmen */}
                        <div className="absolute top-[-1px] -left-[10px] w-0 h-0 border-t-[0px] border-r-[10px] border-b-[10px] border-transparent border-r-slate-700"></div>

                        {/* Inneres Dreieck für die Hintergrundfarbe (überdeckt einen Teil des äußeren Dreiecks) */}
                        <div className="absolute top-[0px] -left-[8px] w-0 h-0 border-t-[0px] border-r-[9px] border-b-[9px] border-transparent border-r-slate-800"></div>

                        <p className="text-sm sm:text-base leading-relaxed text-pretty">
                            Moin moin und Servus!
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
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
