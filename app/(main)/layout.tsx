// app/(main)/layout.tsx
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}