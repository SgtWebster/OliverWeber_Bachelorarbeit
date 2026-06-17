// app/api/experiment/route.ts
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/app/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    console.log("--> [POST] /api/experiment aufgerufen");

    if (!prisma) {
        console.error("🚨 FEHLER: Das 'prisma' Objekt ist undefined!");
        return NextResponse.json({ error: 'DB Client missing' }, { status: 500 });
    }

    try {
        const body = await request.json();

        const { sessionId, group } = body;
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

        console.log("--> ✅ ERFOLG! Datensatz in DB erstellt.");
        return NextResponse.json(newSession, { status: 201 });

    } catch (error) {
        console.error('🚨 KRITISCHER DATENBANK-FEHLER BEIM POST:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Erstellen' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    console.log("--> [PATCH] /api/experiment aufgerufen");

    if (!prisma) return NextResponse.json({ error: 'DB Client missing' }, { status: 500 });

    try {
        const body = await request.json();

        // sessionId abtrennen, der Rest sind potenzielle Update-Felder
        const { sessionId, ...updateFields } = body;
        if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

        // DYNAMISCHE ALLOWLIST: Nur diese Felder dürfen in die DB geschrieben werden!
        const allowedFields = [
            'currentPhase', 'socialAdherence', 'compliance',
            'mReliable', 'mCapable', 'mCompetent', 'mMeticulous',
            'mEthical', 'mRespectable', 'mSincere', 'mBenevolent',
            'performanceTrust', 'moralTrust', 'perceivedHumanlikeness',
            'age', 'gender', 'education', 'techAffinity', 'aiExperience', 'criticalSystemExp'
        ];

        const updateData: any = {};

        // Wir iterieren über die Allowlist und packen nur mitgeschickte Werte ins Update
        for (const key of allowedFields) {
            if (updateFields[key] !== undefined) {
                updateData[key] = updateFields[key];
            }
        }

        const updatedSession = await prisma.participantSession.update({
            where: { id: sessionId },
            data: updateData,
        });

        console.log("--> ✅ ERFOLG! Update gespeichert in Phase:", updateData.currentPhase || "Unverändert");
        return NextResponse.json(updatedSession, { status: 200 });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error('🚨 Prisma Fehler beim PATCH:', error.code, error.message);
            return NextResponse.json({ error: 'Datenbankfehler beim Update', code: error.code }, { status: 500 });
        }
        console.error('🚨 KRITISCHER DATENBANK-FEHLER BEIM PATCH:', error);
        return NextResponse.json({ error: 'Datenbankfehler beim Update' }, { status: 500 });
    }
}