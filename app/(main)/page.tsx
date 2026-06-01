"use client";

import { useState } from "react";
import Link from "next/link";
import profileImage from "@/app/(main)/about/oliver_ulrich_weber_kl.jpg";

export default function Home() {
    // States für den Chat-Flow
    const [contactState, setContactState] = useState<'idle' | 'composing' | 'sending' | 'success'>('idle');
    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!message.trim()) return;
        setContactState('sending');

        try {

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });


            if (!response.ok) {
                throw new Error('Senden fehlgeschlagen');
            }
            // -------------------

            setContactState('success');

            setTimeout(() => {
                setContactState('idle');
                setMessage('');
            }, 5000);

        } catch (error) {
            console.error("Fehler beim Senden", error);
            setContactState('composing');
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-6">
            <section className="max-w-3xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 sm:p-12 shadow-sm text-center">

                <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    Oliver <span className="text-teal-300">Ulrich</span> Weber
                </h1>

                {/* Chat-Sprechblase (Dein Original-Code) */}
                <div className="mt-10 mx-auto max-w-xl flex items-start gap-4 text-left">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-teal-300 scale-[1.50] shrink-0 mt-1 overflow-hidden">
                        <img
                            src={profileImage.src}
                            alt="Oliver"
                            className="w-full h-full object-cover object-top scale-160 -translate-y-[-05%] -translate-x-[-5%]"
                        />
                    </div>
                    <div className="flex-1 relative bg-slate-800 border border-slate-700 p-4 sm:p-5 text-slate-300 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="absolute top-[-1px] -left-[10px] w-0 h-0 border-t-[0px] border-r-[10px] border-b-[10px] border-transparent border-r-slate-700"></div>
                        <div className="absolute top-[0px] -left-[8px] w-0 h-0 border-t-[0px] border-r-[9px] border-b-[9px] border-transparent border-r-slate-800"></div>
                        <p className="text-sm sm:text-base leading-relaxed text-pretty">
                            Moin moin und Servus!
                        </p>
                    </div>
                </div>

                {/* Dynamischer Interaktions-Bereich */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center items-center min-h-[52px]">

                    {/* ZUSTAND 1: Button */}
                    {contactState === 'idle' && (
                        <button
                            onClick={() => setContactState('composing')}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            Antworten
                        </button>
                    )}

                    {/* ZUSTAND 2: Eingabefeld (WhatsApp Style) */}
                    {contactState === 'composing' && (
                        <div className="flex w-full sm:w-[400px] items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-600 focus-within:border-teal-400 transition-colors shadow-inner">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Schreibe eine Nachricht..."
                                autoFocus
                                className="flex-1 bg-transparent text-slate-200 px-3 py-2 outline-none text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim()}
                                className="p-2 rounded-full bg-teal-500 text-slate-900 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 transition-colors shrink-0 flex items-center justify-center"
                            >
                                {/* Papierflieger Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* ZUSTAND 3: Spinner (Senden) */}
                    {contactState === 'sending' && (
                        <div className="flex items-center justify-center px-6 py-3">
                            <svg className="animate-spin h-6 w-6 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    {/* ZUSTAND 4: Erfolg */}
                    {contactState === 'success' && (
                        <div className="flex items-center gap-2 text-teal-400 font-medium px-6 py-3 animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Danke für deine Nachricht!
                        </div>
                    )}

                    {/* Der "Mehr über mich" Button bleibt immer da (optional kannst du ihn auch ausblenden, wenn getippt wird) */}
                    {contactState === 'idle' && (
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            Mehr über mich
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
}