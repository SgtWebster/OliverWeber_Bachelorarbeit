// (main)/steel/page.tsx
"use client";

export default function SteelPage() {
    return (
        <div className="w-full flex-grow flex items-center justify-center px-4 py-12 md:py-24">
            {/* Der Container passt sich jetzt automatisch perfekt an die Textmenge an */}
            <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Linke Spalte: Textbereich (Dieser bestimmt jetzt als "Chef" die Höhe!) */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <span
                            className="text-xs font-mono uppercase tracking-widest font-semibold"
                            style={{ color: '#ef4444' }}
                        >
                            Der Äußerste Rand
                        </span>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-neutral-50 bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
                            Das Sandnest
                        </h1>
                    </div>

                    <div className="w-20 h-1 rounded" style={{ backgroundColor: '#ef4444' }}></div>

                    <div className="prose prose-invert max-w-none text-neutral-400 font-sans leading-relaxed space-y-4 text-sm md:text-base">
                        <p>
                            Am Rande der zivilisierten Welt, isoliert im unerbittlichen Ascheland, verrottet der Vorposten <strong style={{ color: '#ef4444' }} className="font-semibold">Sandnest</strong>.
                            Die Vorräte der ausgemergelten „Sandratten“ schwinden, das Funkgerät schweigt seit Wochen, und der nach Essig stinkende Kranke Wind treibt
                            die Gefolgschaft unaufhaltsam in den fleischverfaulenden Wahnsinn.
                        </p>
                        <p>
                            Im Schatten des sogenannten <strong style={{ color: '#ef4444' }} className="font-semibold">»Dorns«</strong> – dem gigantischen Hauptturm des Nests –
                            klammern sich die Wachposten an ihre Kupferrevolver. Von hier oben starren sie in die flirrende Ödnis, stets in der Furcht vor dem, was der Sturm als Nächstes ausspuckt.
                            Hier draußen weicht die Schwäche des Fleisches dem unerbittlichen Gesetz des Großen Mechanikers.
                        </p>
                        <p>
                            Doch als der letzte Kurier im Asche-Nebel verschwindet und unerklärliche Wahnvorstellungen die Mannschaft zersetzen,
                            beginnt die bröckelnde Fassade des Kollektivs zu reißen. Hinter dem schützenden Draht warten grauenhafte Asche-Schleicher,
                            während im Inneren der Kampf gegen den <strong style={{ color: '#ef4444' }} className="font-semibold">eigenen Verfall</strong> tobt.
                        </p>
                    </div>
                </div>

                {/* Rechte Spalte: Bildbereich */}
                {/* WICHTIG: min-h-[300px] für Mobile, md:min-h-0 für Desktop */}
                <div className="flex-1 relative bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 min-h-[300px] md:min-h-0">
                    {/* WICHTIG: Das Bild hat jetzt "absolute inset-0". Dadurch erzwingt es keine eigene Höhe mehr! */}
                    <img
                        src="/steel_photo.png"
                        alt="Vorposten Sandnest"
                        className="absolute object-top inset-0 w-full h-full object-cover opacity-80 contrast-125 brightness-90"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-900 via-transparent to-transparent pointer-events-none" />
                </div>

            </div>
        </div>
    );
}