// app/layout.tsx
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
        {/* antialiased macht die Schrift schön scharf, min-h-screen verhindert weiße Ränder unten */}
        <body className="antialiased min-h-screen bg-white">
        {children}
        </body>
        </html>
    );
}