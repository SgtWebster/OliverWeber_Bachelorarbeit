import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-900 text-slate-300 py-8 mt-auto border-t border-teal-900">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright / Name */}
                <div className="text-sm font-medium">
                    &copy; {new Date().getFullYear()} Oliver Ulrich Weber
                </div>

                {/* Rechtliches */}
                <div className="flex gap-6 text-xs text-slate-500">
                    <Link href="/impressum" className="hover:text-teal-400 transition-colors">
                        Impressum
                    </Link>
                </div>
            </div>
        </footer>
    );
}