// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        await resend.emails.send({
            from: 'Kontaktformular <contact@oliver-weber.at>', // Oder deine verifizierte Domain
            to: 'ulrich@oliver-weber.at',
            subject: 'Neue Nachricht von der Website',
            text: message,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 });
    }
}