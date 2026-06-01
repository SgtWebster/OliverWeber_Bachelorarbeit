import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Oliver Ulrich Weber",
    description: "Portfolio & Thesis Platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="de">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        <Header />

        {/* pb-28 ist der Puffer für den festgenagelten Footer */}
        <main className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8 pt-10 pb-28 sm:pt-14">
            {children}
        </main>

        <Footer />
        </body>
        </html>
    );
}