// app/api/experiment/next-group/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';

/**
 * Maximal erlaubte Differenz zwischen den Gruppen, bevor der Zufall übersteuert wird.
 * Beispiel (THRESHOLD = 3):
 *   - Hat AVATAR 3 Zuweisungen mehr als TERMINAL  -> erzwinge TERMINAL
 *   - Hat TERMINAL 3 Zuweisungen mehr als AVATAR  -> erzwinge AVATAR
 */
const BALANCE_THRESHOLD = 3;

/**
 * GET /api/experiment/next-group
 *
 * Zufällige Gruppenzuweisung mit Ausgleichs-Sicherung ("biased coin" / Urnen-Modell).
 *
 * Grundsätzlich entscheidet ein 50/50-Münzwurf (Math.random) über AVATAR oder TERMINAL.
 * Um ein zu starkes Ungleichgewicht zu verhindern, wird der Zufall jedoch übersteuert,
 * sobald die Differenz zwischen den bereits vergebenen Gruppen den Schwellenwert erreicht:
 *   - AVATAR liegt um >= BALANCE_THRESHOLD vorne   -> TERMINAL wird erzwungen
 *   - TERMINAL liegt um >= BALANCE_THRESHOLD vorne -> AVATAR wird erzwungen
 *
 * Innerhalb des Schwellenwerts bleibt die Zuweisung echt zufällig, sodass keine
 * vorhersehbare Reihenfolge entsteht, die Gruppengrößen aber langfristig nahe 50/50 bleiben.
 */
export async function GET() {
    const requestId = generateRequestId();

    try {
        validatePrismaClient(prisma);

        const [avatarCount, terminalCount] = await Promise.all([
            prisma.participantSession.count({ where: { group: 'AVATAR' } }),
            prisma.participantSession.count({ where: { group: 'TERMINAL' } })
        ]);

        const difference = avatarCount - terminalCount;

        let group: 'AVATAR' | 'TERMINAL';
        let reason: 'random' | 'forced-balance';

        if (difference >= BALANCE_THRESHOLD) {
            // AVATAR ist zu weit vorne -> Ausgleich erzwingen
            group = 'TERMINAL';
            reason = 'forced-balance';
        } else if (difference <= -BALANCE_THRESHOLD) {
            // TERMINAL ist zu weit vorne -> Ausgleich erzwingen
            group = 'AVATAR';
            reason = 'forced-balance';
        } else {
            // Innerhalb des Schwellenwerts: echter 50/50-Zufall
            group = Math.random() < 0.5 ? 'AVATAR' : 'TERMINAL';
            reason = 'random';
        }

        const sessionCount = avatarCount + terminalCount;

        console.log(
            `[${requestId}] GET /api/experiment/next-group -> ${group} ` +
            `(${reason}; avatar=${avatarCount}, terminal=${terminalCount}, diff=${difference})`
        );

        return NextResponse.json(
            {
                success: true,
                data: { group, sessionCount, avatarCount, terminalCount, reason },
                requestId
            },
            { status: 200 }
        );
    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}
