import Link from "next/link";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 w-full bg-slate-900 text-slate-300 py-6 border-t border-teal-900">
            <div className="max-w-5xl mx-auto px-6 flex justify-center md:justify-end items-center">
                <div className="flex gap-6 text-xs text-slate-500">
                    <Link href="/impressum" className="hover:text-teal-400 transition-colors">
                        Impressum
                    </Link>
                </div>
            </div>
        </footer>
    );
}