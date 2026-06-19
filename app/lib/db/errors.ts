import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Strukturierte Error-Klasse für API-Responses
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Konvertiert verschiedene Error-Typen zu strukturierten Responses
 */
export function handleError(error: unknown, requestId: string) {
  console.error(`[${requestId}] Error:`, error);

  // Zod Validation Fehler
  if (error instanceof ZodError) {
    const formatted = (error as any).errors?.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];
    return {
      status: 400,
      body: {
        error: 'Validierungsfehler',
        code: 'VALIDATION_ERROR',
        details: formatted,
        requestId
      }
    };
  }

  // Prisma Unique Constraint Fehler
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = (error.meta as any)?.target;
      const field = target?.[0] || 'Feld';
      return {
        status: 409,
        body: {
          error: `Ein Eintrag mit diesem ${field} existiert bereits`,
          code: 'DUPLICATE_ENTRY',
          requestId
        }
      };
    }

    // Record nicht gefunden
    if (error.code === 'P2025') {
      return {
        status: 404,
        body: {
          error: 'Datensatz nicht gefunden',
          code: 'NOT_FOUND',
          requestId
        }
      };
    }

    // Andere Prisma Fehler
    return {
      status: 500,
      body: {
        error: 'Datenbankfehler',
        code: `PRISMA_${error.code}`,
        requestId
      }
    };
  }

  // Prisma Connection Fehler
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(`[${requestId}] Database connection error`);
    return {
      status: 503,
      body: {
        error: 'Datenbankverbindung nicht verfügbar',
        code: 'DB_CONNECTION_ERROR',
        requestId
      }
    };
  }

  // Prisma Validation Fehler
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error(`[${requestId}] Prisma validation error:`, (error as any).message);
    return {
      status: 500,
      body: {
        error: 'Datenbankfehler',
        code: 'DB_VALIDATION_ERROR',
        requestId
      }
    };
  }

  // Custom ApiError
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: {
        error: error.message,
        code: error.errorCode,
        details: error.details,
        requestId
      }
    };
  }

  // JSON Parse Fehler
  if (error instanceof SyntaxError) {
    return {
      status: 400,
      body: {
        error: 'Ungültiges JSON Format',
        code: 'INVALID_JSON',
        requestId
      }
    };
  }

  // Generic Error
  return {
    status: 500,
    body: {
      error: 'Interner Serverfehler',
      code: 'INTERNAL_ERROR',
      requestId
    }
  };
}

/**
 * Generiert eine eindeutige Request-ID für Tracking
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validiert, dass prisma Client verfügbar ist
 */
export function validatePrismaClient(prisma: any): void {
  if (!prisma) {
    throw new ApiError(503, 'DB_CLIENT_UNAVAILABLE', 'Datenbankverbindung nicht initialisiert');
  }
}
