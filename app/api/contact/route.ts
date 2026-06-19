import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateRequestId, handleError, ApiError } from '@/app/lib/db/errors';
import { z } from 'zod';

if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY fehlt in den Umgebungsvariablen!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactMessageSchema = z.object({
    message: z.string()
        .min(1, 'Nachricht erforderlich')
        .max(5000, 'Nachricht zu lang (Max. 5000 Zeichen)')
        .trim()
}).strict();

export async function POST(request: Request) {
    const requestId = generateRequestId();
    console.log(`[${requestId}] POST /api/contact`);

    try {
        const body = await request.json();
        const validatedData = ContactMessageSchema.parse(body);
        const { message } = validatedData;

        await resend.emails.send({
            from: 'Kontaktformular <contact@oliver-weber.at>',
            to: 'ulrich@oliver-weber.at',
            subject: 'Neue Nachricht von der Website',
            text: message,
        });

        console.log(`[${requestId}] ✅ Contact message sent`);
        return NextResponse.json(
            { 
                success: true,
                message: 'Nachricht erfolgreich versendet',
                requestId
            },
            { status: 200 }
        );
    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}