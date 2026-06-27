// app/api/experiment/next-group/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/experiment/next-group
 *
 * Deterministische, abwechselnde Gruppenzuweisung ("Block-Randomisierung" mit Blockgröße 1).
 * Statt einer zufälligen Münzwurf-Zuweisung (Math.random) wird die nächste Gruppe
 * anhand der Anzahl bereits angelegter Sessions bestimmt:
 *   - gerade Anzahl (0, 2, 4, ...) -> AVATAR
 *   - ungerade Anzahl (1, 3, 5, ...) -> TERMINAL
 *
 * Dadurch erhält jeder zweite Proband AVATAR und jeder andere TERMINAL,
 * was bei wachsender Stichprobe exakt 50 % je Variable ergibt.
 */
export async function GET() {
    const requestId = generateRequestId();

    try {
        validatePrismaClient(prisma);

        const sessionCount = await prisma.participantSession.count();
        const group = sessionCount % 2 === 0 ? 'AVATAR' : 'TERMINAL';

        console.log(`[${requestId}] GET /api/experiment/next-group -> ${group} (count=${sessionCount})`);

        return NextResponse.json(
            {
                success: true,
                data: { group, sessionCount },
                requestId
            },
            { status: 200 }
        );
    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}
