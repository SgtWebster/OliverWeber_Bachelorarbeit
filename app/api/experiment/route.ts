// app/api/experiment/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { CreateSessionSchema, UpdateSessionSchema } from '@/app/lib/db/validation';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';
const REQUEST_TIMEOUT = 10000; // 10 Sekunden

/**
 * GET /api/experiment/:sessionId - Hole Session-Status ab
 */
export async function GET(request: NextRequest) {
    const requestId = generateRequestId();
    
    try {
        validatePrismaClient(prisma);

        // Extrahiere sessionId aus URL
        const pathname = request.nextUrl.pathname;
        const sessionId = pathname.replace('/api/experiment/', '');

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

        // Hole Session aus DB
        const session = await prisma.participantSession.findUnique({
            where: { id: sessionId },
            select: {
                id: true,
                group: true,
                currentPhase: true,
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

export async function POST(request: Request) {
    const requestId = generateRequestId();
    console.log(`[${requestId}] POST /api/experiment`);

    try {
        // Validiere Prisma Client
        validatePrismaClient(prisma);

        // Parse und Validiere Request Body mit Timeout
        const bodyPromise = request.json();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        );
        
        const body = await Promise.race([bodyPromise, timeoutPromise]);
        const validatedData = CreateSessionSchema.parse(body);

        // Prüfe: Session existiert nicht bereits
        const existingSession = await prisma.participantSession.findUnique({
            where: { id: validatedData.sessionId },
            select: { id: true }
        });

        if (existingSession) {
            console.warn(`[${requestId}] Session ${validatedData.sessionId} already exists`);
            return NextResponse.json(
                { 
                    error: 'Session existiert bereits', 
                    code: 'SESSION_EXISTS',
                    requestId 
                }, 
                { status: 409 }
            );
        }

        // Erstelle neue Session
        const newSession = await prisma.participantSession.create({
            data: {
                id: validatedData.sessionId,
                group: validatedData.group,
                currentPhase: 'ONBOARDING',
            },
        });

        console.log(`[${requestId}] ✅ Session ${validatedData.sessionId} created`);
        return NextResponse.json(
            { 
                success: true, 
                data: newSession,
                requestId
            }, 
            { status: 201 }
        );

    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}

export async function PATCH(request: Request) {
    const requestId = generateRequestId();
    console.log(`[${requestId}] PATCH /api/experiment`);

    try {
        // Validiere Prisma Client
        validatePrismaClient(prisma);

        // Parse und Validiere Request Body mit Timeout
        const bodyPromise = request.json();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        );
        
        const body = await Promise.race([bodyPromise, timeoutPromise]);
        const validatedData = UpdateSessionSchema.parse(body);

        const { sessionId, ...updateFields } = validatedData;

        // Prüfe: Session existiert
        const existingSession = await prisma.participantSession.findUnique({
            where: { id: sessionId },
            select: { id: true, updatedAt: true }
        });

        if (!existingSession) {
            console.warn(`[${requestId}] Session ${sessionId} not found`);
            return NextResponse.json(
                { 
                    error: 'Session nicht gefunden', 
                    code: 'SESSION_NOT_FOUND',
                    requestId 
                }, 
                { status: 404 }
            );
        }

        // Update mit typisierten Feldern
        const updatedSession = await prisma.participantSession.update({
            where: { id: sessionId },
            data: updateFields,
        });

        console.log(`[${requestId}] ✅ Session ${sessionId} updated`);
        return NextResponse.json(
            { 
                success: true,
                data: updatedSession,
                requestId
            }, 
            { status: 200 }
        );

    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}