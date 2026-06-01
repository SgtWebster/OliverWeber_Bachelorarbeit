import { NextResponse } from 'next/server';
import { Resend } from 'resend';


if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY fehlt in den Umgebungsvariablen!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        // 1. Basic Validation: Ist die Message da und ein String?
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return NextResponse.json(
                { error: 'Ungültige Nachricht' },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: 'Kontaktformular <contact@oliver-weber.at>',
            to: 'ulrich@oliver-weber.at',
            subject: 'Neue Nachricht von der Website',
            text: message,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // 2. Server-Logging für dich zum Debuggen
        console.error('Fehler in der Contact API:', error);

        return NextResponse.json(
            { error: 'Fehler beim Senden der Nachricht' },
            { status: 500 }
        );
    }
}