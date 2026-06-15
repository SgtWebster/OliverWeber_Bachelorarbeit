// app/api/experiment/route.ts
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
// WICHTIG: Die geschweiften Klammern hier sind ein absolutes Muss!
import { prisma } from '@/app/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    console.log("--> [POST] /api/experiment aufgerufen");

    // Sicherheits-Check: Ist Prisma überhaupt geladen worden?
    if (!prisma) {
        console.error("🚨 FEHLER: Das 'prisma' Objekt ist undefined! Der Import ist fehlgeschlagen.");
        return NextResponse.json({ error: 'DB Client missing' }, { status: 500 });
    }

    try {
        const body = await request.json();
        console.log("--> Request Body erhalten:", body);

        const { sessionId, group } = body;
        if (!sessionId || !group) {
            console.error("🚨 FEHLER: sessionId oder group fehlen im Request!");
            return NextResponse.json({ error: 'Missing sessionId or group' }, { status: 400 });
        }

        console.log(`--> Versuche Datensatz für ID ${sessionId} in DB zu schreiben...`);

        const newSession = await prisma.participantSession.create({
            data: {
                id: sessionId,
                group: group,
                currentPhase: 'ONBOARDING',
            },
        });

        console.log("--> ✅ ERFOLG! Datensatz in Neon gespeichert:", newSession);
        return NextResponse.json(newSession, { status: 201 });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('🚨 Prisma Fehler beim POST:', error.code, error.message);
            return NextResponse.json(
                { error: 'Datenbankfehler beim Erstellen', code: error.code },
                { status: 500 }
            );
        }

        console.error('🚨 KRITISCHER DATENBANK-FEHLER BEIM POST:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Erstellen' }, { status: 500 });
    }
}

// Wir loggen den PATCH-Endpunkt direkt mit
export async function PATCH(request: Request) {
    console.log("--> [PATCH] /api/experiment aufgerufen");

    if (!prisma) return NextResponse.json({ error: 'DB Client missing' }, { status: 500 });

    try {
        const body = await request.json();
        console.log("--> PATCH Request Body:", body);

        const { sessionId, currentPhase, socialAdherence, compliance } = body;
        if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

        const updateData: any = {};
        if (currentPhase) updateData.currentPhase = currentPhase;
        if (socialAdherence !== undefined) updateData.socialAdherence = socialAdherence;
        if (compliance !== undefined) updateData.compliance = compliance;

        const updatedSession = await prisma.participantSession.update({
            where: { id: sessionId },
            data: updateData,
        });

        console.log("--> ✅ ERFOLG! Update gespeichert:", updatedSession);
        return NextResponse.json(updatedSession, { status: 200 });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('🚨 Prisma Fehler beim PATCH:', error.code, error.message);
            return NextResponse.json(
                { error: 'Datenbankfehler beim Update', code: error.code },
                { status: 500 }
            );
        }

        console.error('🚨 KRITISCHER DATENBANK-FEHLER BEIM PATCH:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Update' }, { status: 500 });
    }
}
