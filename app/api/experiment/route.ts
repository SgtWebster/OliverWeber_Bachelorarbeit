// app/api/experiment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { CreateSessionSchema, UpdateSessionSchema } from '@/app/lib/db/validation';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';
const REQUEST_TIMEOUT = 10000; // 10 Sekunden

function detectDeviceMetadata(request: Request) {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() ?? '';
    const clientHintMobile = request.headers.get('sec-ch-ua-mobile');
    const clientHintPlatform = request.headers.get('sec-ch-ua-platform')?.replaceAll('"', '').toLowerCase() ?? '';

    const isTablet =
        /ipad|tablet/.test(userAgent) ||
        (/android/.test(userAgent) && !/mobile/.test(userAgent));
    const isMobile =
        clientHintMobile === '?1' ||
        /mobi|iphone|ipod|android/.test(userAgent);

    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let osGroup = 'Unknown';
    if (/windows/.test(clientHintPlatform) || /windows nt/.test(userAgent)) {
        osGroup = 'Windows';
    } else if (/ios/.test(clientHintPlatform) || /iphone|ipad|ipod/.test(userAgent)) {
        osGroup = 'iOS';
    } else if (/android/.test(clientHintPlatform) || /android/.test(userAgent)) {
        osGroup = 'Android';
    } else if (/macos|mac os/.test(clientHintPlatform) || /macintosh|mac os x/.test(userAgent)) {
        osGroup = 'macOS';
    } else if (/chrome os/.test(clientHintPlatform) || /cros/.test(userAgent)) {
        osGroup = 'ChromeOS';
    } else if (/linux/.test(clientHintPlatform) || /linux/.test(userAgent)) {
        osGroup = 'Linux';
    }

    return { deviceType, osGroup };
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
        const deviceMetadata = detectDeviceMetadata(request);
        const newSession = await prisma.participantSession.create({
            data: {
                id: validatedData.sessionId,
                group: validatedData.group,
                currentPhase: 'ONBOARDING',
                ...deviceMetadata,
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
        const normalizedUpdateFields = { ...updateFields };

        if (
            normalizedUpdateFields.totalTrust == null &&
            typeof normalizedUpdateFields.performanceTrust === 'number' &&
            typeof normalizedUpdateFields.moralTrust === 'number'
        ) {
            normalizedUpdateFields.totalTrust = parseFloat(
                ((normalizedUpdateFields.performanceTrust + normalizedUpdateFields.moralTrust) / 2).toFixed(2)
            );
        }

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
            data: normalizedUpdateFields,
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
