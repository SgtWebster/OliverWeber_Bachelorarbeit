// app/api/experiment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

export const dynamic = 'force-dynamic'; // Prevents static evaluation during build

// 1. NEUE SESSION ANLEGEN
export async function POST(request: Request) {
    try {
        const { sessionId, group } = await request.json();

        if (!sessionId || !group) {
            return NextResponse.json({ error: 'Missing sessionId or group' }, { status: 400 });
        }

        const newSession = await prisma.participantSession.create({
            data: {
                id: sessionId,
                group: group,
                currentPhase: 'ONBOARDING',
            },
        });

        return NextResponse.json(newSession, { status: 201 });
    } catch (error) {
        console.error('Fehler beim DB-POST:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Erstellen' }, { status: 500 });
    }
}

// 2. EXISTIERENDE SESSION AKTUALISIEREN
export async function PATCH(request: Request) {
    try {
        const { sessionId, currentPhase, socialAdherence, compliance } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // Wir bauen dynamisch nur die Felder zusammen, die auch wirklich mitgeschickt wurden
        const updateData: any = {};
        if (currentPhase) updateData.currentPhase = currentPhase;
        if (socialAdherence !== undefined) updateData.socialAdherence = socialAdherence;
        if (compliance !== undefined) updateData.compliance = compliance;

        const updatedSession = await prisma.participantSession.update({
            where: { id: sessionId },
            data: updateData,
        });

        return NextResponse.json(updatedSession, { status: 200 });
    } catch (error) {
        console.error('Fehler beim DB-PATCH:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Update' }, { status: 500 });
    }
}
