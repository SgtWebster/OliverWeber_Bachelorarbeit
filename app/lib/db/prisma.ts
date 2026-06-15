import { PrismaClient } from "@prisma/client";

// Der clevere Trick: Wir überschreiben einfach die Standard-Variable,
// BEVOR Prisma überhaupt auf die Idee kommt, sie zu lesen!
if (process.env.PRISMA_PROD_URL) {
    process.env.DATABASE_URL = process.env.PRISMA_PROD_URL;
}

if (!process.env.DATABASE_URL) {
    console.error("🚨 KRITISCHER FEHLER: Keine Datenbank-URL gefunden!");
    throw new Error("Datenbank-URL fehlt!");
}

console.log("✅ DB-URL vorbereitet. Initialisiere reinen Prisma Client...");

const prismaClientSingleton = () => {
    // Absolut nackt! Prisma holt sich die URL jetzt automatisch aus process.env.DATABASE_URL
    return new PrismaClient();
};

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}