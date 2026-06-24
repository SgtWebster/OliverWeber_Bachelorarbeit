import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-900 text-slate-300 border-t border-teal-900 py-4 sm:py-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-center md:justify-end items-center">
                <div className="flex gap-6 text-xs text-slate-500">
                    <Link href="/admin" aria-label="Admin Login" className="hover:text-teal-400 transition-colors">
                        Admin
                    </Link>
                    <Link href="/impressum" className="hover:text-teal-400 transition-colors">
                        Impressum
                    </Link>
                </div>
            </div>
        </footer>
    );
}
