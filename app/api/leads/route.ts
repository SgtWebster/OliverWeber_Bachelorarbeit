// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { CreateLeadSchema } from '@/app/lib/db/validation';
import { handleError, generateRequestId, validatePrismaClient } from '@/app/lib/db/errors';

export const dynamic = 'force-dynamic';
const REQUEST_TIMEOUT = 10000; // 10 Sekunden

export async function POST(request: Request) {
    const requestId = generateRequestId();
    console.log(`[${requestId}] POST /api/leads`);

    try {
        // Validiere Prisma Client
        validatePrismaClient(prisma);

        // Parse und Validiere Request Body mit Timeout
        const bodyPromise = request.json();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        );
        
        const body = await Promise.race([bodyPromise, timeoutPromise]);
        const validatedData = CreateLeadSchema.parse(body);

        // Prüfe: Gibt es die Mail schon? (Keine doppelten Einträge)
        const existingLead = await prisma.participantLead.findUnique({
            where: { email: validatedData.email },
            select: { id: true, createdAt: true }
        });

        if (existingLead) {
            console.log(`[${requestId}] Lead ${validatedData.email} already exists`);
            return NextResponse.json(
                { 
                    success: true,
                    message: 'Email bereits registriert',
                    code: 'ALREADY_REGISTERED',
                    requestId
                }, 
                { status: 200 }
            );
        }

        // Neuer Lead erstellen
        const newLead = await prisma.participantLead.create({
            data: {
                email: validatedData.email,
                wantsRaffle: validatedData.wantsRaffle,
                wantsNewsletter: validatedData.wantsNewsletter,
            }
        });

        console.log(`[${requestId}] ✅ Lead ${validatedData.email} created`);
        return NextResponse.json(
            { 
                success: true,
                data: { id: newLead.id },
                requestId
            }, 
            { status: 201 }
        );

    } catch (error) {
        const { status, body } = handleError(error, requestId);
        return NextResponse.json(body, { status });
    }
}