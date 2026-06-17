// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (!prisma) return NextResponse.json({ error: 'DB Client missing' }, { status: 500 });

    try {
        const body = await request.json();
        const { email, wantsRaffle, wantsNewsletter } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email fehlt' }, { status: 400 });
        }

        // Check: Gibt es die Mail schon? (Keine doppelten Gutscheine abgreifen!)
        const existingLead = await prisma.participantLead.findUnique({
            where: { email }
        });

        if (existingLead) {
            return NextResponse.json({ message: 'Bereits registriert' }, { status: 200 });
        }

        // Neuen Lead in die isolierte Tabelle schreiben
        await prisma.participantLead.create({
            data: {
                email,
                wantsRaffle: wantsRaffle ?? false,
                wantsNewsletter: wantsNewsletter ?? false,
            }
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error('🚨 Fehler beim Lead-Speichern:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Lead' }, { status: 500 });
    }
}