// app/lib/db/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.PRISMA_PROD_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("Datenbank-URL fehlt! Setze DATABASE_URL oder PRISMA_PROD_URL in .env");
}

const prismaClientSingleton = () => {
    // PrismaPg Adapter mit Connection Pool Konfiguration
    const adapter = new PrismaPg({
        connectionString: databaseUrl,
        // Connection Pool wird über die Database URL als Query-Parameter konfiguriert
        // z.B: postgresql://user:password@host/db?schema=public&connect_timeout=10&pool_size=20
    });

    return new PrismaClient({
        adapter,
        // Logging nur bei non-production
        log: process.env.NODE_ENV !== "production" 
            ? ['warn', 'error'] 
            : ['error'],
    });
};

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

// Graceful Shutdown
if (typeof window === 'undefined') {
    process.on('SIGINT', async () => {
        console.log('[SHUTDOWN] Closing database connection...');
        await prisma.$disconnect();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('[SHUTDOWN] Closing database connection...');
        await prisma.$disconnect();
        process.exit(0);
    });
}
