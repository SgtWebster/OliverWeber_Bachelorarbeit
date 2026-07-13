import { ImageResponse } from 'next/og';

export const alt = 'Bachelorarbeit Oliver Weber – Forschungsprojekt Mensch & Maschine';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    padding: '64px',
                    color: '#0f172a',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            color: '#0369a1',
                            fontSize: 25,
                            fontWeight: 700,
                            letterSpacing: 3,
                            textTransform: 'uppercase',
                        }}
                    >
                        MCI Innsbruck · Bachelorarbeit
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                maxWidth: 780,
                                fontSize: 68,
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: -2,
                            }}
                        >
                            Forschungsprojekt: Mensch & Maschine
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                marginTop: 28,
                                color: '#475569',
                                fontSize: 31,
                            }}
                        >
                            Anonym teilnehmen und Forschung unterstützen
                        </div>
                    </div>
                    <div style={{ display: 'flex', color: '#334155', fontSize: 27, fontWeight: 700 }}>
                        Oliver Weber
                    </div>
                </div>
                <div
                    style={{
                        width: 270,
                        marginLeft: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 250,
                            height: 250,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            background: '#0f172a',
                            borderRadius: 36,
                            boxShadow: '0 24px 50px rgba(15, 23, 42, 0.2)',
                        }}
                    >
                        <div style={{ display: 'flex', fontSize: 25, fontWeight: 700 }}>GEWINNSPIEL</div>
                        <div style={{ display: 'flex', marginTop: 8, fontSize: 72, fontWeight: 800 }}>100 €</div>
                        <div style={{ display: 'flex', marginTop: 4, color: '#bae6fd', fontSize: 21 }}>
                            Gutschein-Gesamtwert
                        </div>
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
