// (main)/bachelorarbeit/page.tsx
"use client";

import Link from "next/link";

export default function ComingSoonPage() {
    return (
        <div className="min-h-[70vh] max-w-3xl mx-auto px-4 py-16 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg border-2 border-slate-900 shadow-sm text-center w-full">
                <h1 className="text-2xl font-bold text-slate-800">
                    Bachelorarbeit ist in Arbeit
                </h1>
                <p className="text-slate-700 mt-2">
                    ... bald ist es soweit ...
                </p>
                <div className="mt-8">
                    <Link 
                        href="/mockups/info" 
                        className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        Zum Info Mockup
                    </Link>
                </div>
            </div>
        </div>
    );
}
