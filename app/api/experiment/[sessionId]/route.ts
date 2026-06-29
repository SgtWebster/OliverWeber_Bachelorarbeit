// app/api/experiment/[sessionId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/experiment/:sessionId - Hole Session-Status ab (für Session-Recovery)
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const requestId = generateRequestId();

    try {
        validatePrismaClient(prisma);

        const { sessionId } = await params;

        if (!sessionId) {
            return NextResponse.json(
                {
                    error: 'Session ID erforderlich',
                    code: 'MISSING_SESSION_ID',
                    requestId
                },
                { status: 400 }
            );
        }

        console.log(`[${requestId}] GET /api/experiment/${sessionId}`);

        const session = await prisma.participantSession.findUnique({
            where: { id: sessionId },
            select: {
                id: true,
                group: true,
                currentPhase: true,
                socialAdherence: true,
                compliance: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!session) {
            console.log(`[${requestId}] Session ${sessionId} not found`);
            return NextResponse.json(
                {
                    error: 'Session nicht gefunden',
                    code: 'SESSION_NOT_FOUND',
                    requestId
                },
                { status: 404 }
            );
        }

        console.log(`[${requestId}] ✅ Session loaded`);
        return NextResponse.json(
            {
                success: true,
                data: session,
                requestId
            },
            { status: 200 }
        );

    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}
