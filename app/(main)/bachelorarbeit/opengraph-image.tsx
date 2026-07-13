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
                    flexDirection: 'column',
                    color: '#0f172a',
                    background: '#f8fafc',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <div
                    style={{
                        height: 72,
                        padding: '0 56px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#ffffff',
                        background: '#020617',
                        fontSize: 27,
                        fontWeight: 800,
                        letterSpacing: -0.5,
                    }}
                >
                    oliver <span style={{ margin: '0 7px', color: '#5eead4' }}>ulrich</span> weber
                </div>

                <div style={{ flex: 1, display: 'flex', padding: '34px 46px 38px' }}>
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            overflow: 'hidden',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: 24,
                            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)',
                        }}
                    >
                        <div
                            style={{
                                width: '66%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '38px 44px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    color: '#0369a1',
                                    fontSize: 18,
                                    fontWeight: 800,
                                    letterSpacing: 2.5,
                                    textTransform: 'uppercase',
                                }}
                            >
                                MCI Innsbruck · Bachelorarbeit
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    marginTop: 12,
                                    fontSize: 48,
                                    fontWeight: 800,
                                    lineHeight: 1.08,
                                    letterSpacing: -1.4,
                                }}
                            >
                                Forschungsprojekt
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    marginTop: 17,
                                    color: '#475569',
                                    fontSize: 22,
                                    lineHeight: 1.35,
                                }}
                            >
                                Wenige Minuten, komplett anonym – unterstütze mich bei meiner Bachelorarbeit.
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: 20,
                                    padding: '14px 18px',
                                    color: '#065f46',
                                    background: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: 12,
                                    fontSize: 19,
                                }}
                            >
                                <span style={{ marginRight: 10, fontWeight: 800 }}>Zu gewinnen:</span>
                                1x 50€ & 2x 50€ Amazon-Gutscheine
                            </div>

                            <div
                                style={{
                                    alignSelf: 'flex-start',
                                    display: 'flex',
                                    marginTop: 20,
                                    padding: '13px 24px',
                                    color: '#ffffff',
                                    background: '#0f172a',
                                    borderRadius: 10,
                                    fontSize: 19,
                                    fontWeight: 700,
                                }}
                            >
                                Jetzt am Experiment teilnehmen
                            </div>
                        </div>

                        <div
                            style={{
                                width: '34%',
                                display: 'flex',
                                overflow: 'hidden',
                                background: '#f1f5f9',
                                borderLeft: '1px solid #cbd5e1',
                            }}
                        >
                            {/* ImageResponse benötigt hier ein natives img-Element. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://oliver-weber.at/gutscheine.png"
                                alt=""
                                width="376"
                                height="486"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
