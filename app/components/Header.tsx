// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/experiment", label: "Experiment" },
    { href: "/about", label: "Über mich" },
];

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
}

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const activeLabel = useMemo(() => {
        const hit = NAV.find((n) => isActive(pathname, n.href));
        return hit?.label ?? "Navigation";
    }, [pathname]);

    useEffect(() => {
        // close menu on route change
        setOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
          <span className="text-lg font-black tracking-tight text-white">
            oliver <span className="text-teal-300">ulrich</span> weber
          </span>
                    <span className="hidden text-xs text-slate-300/80 sm:inline">

          </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                    {NAV.map((item) => {
                        const active = isActive(pathname, item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "relative rounded-xl px-3 py-2 text-sm font-semibold transition",
                                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                                    active
                                        ? "text-white"
                                        : "text-slate-300 hover:text-white hover:bg-white/5",
                                ].join(" ")}
                            >
                                {item.label}
                                {active && (
                                    <span className="absolute inset-x-3 -bottom-[1px] h-px bg-gradient-to-r from-transparent via-teal-300/80 to-transparent" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                    >
                        <span className="text-slate-200">{activeLabel}</span>
                        <span className="text-slate-300">{open ? "×" : "≡"}</span>
                    </button>
                </div>
            </div>

            {/* Mobile panel */}
            {open && (
                <div
                    id="mobile-nav"
                    className="md:hidden border-t border-white/10 bg-slate-950/75 backdrop-blur-xl"
                >
                    <div className="mx-auto max-w-5xl px-5 py-3 sm:px-6 lg:px-8">
                        <div className="grid gap-1">
                            {NAV.map((item) => {
                                const active = isActive(pathname, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={[
                                            "rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                                            active
                                                ? "bg-white/10 text-white"
                                                : "text-slate-200 hover:bg-white/5 hover:text-white",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
