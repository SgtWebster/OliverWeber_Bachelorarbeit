// app/(main)/layout.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
                    <div className="py-10 sm:py-14">{children}</div>
                </div>
            </main>
            <Footer />
        </div>
    );
}