// app/experiment/layout.tsx
"use client";

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 relative z-50 pb-16 flex flex-col">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}