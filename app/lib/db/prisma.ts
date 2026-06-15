// app/lib/db/prisma.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.PRISMA_PROD_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("🚨 Datenbank-URL fehlt! Weder PRISMA_PROD_URL noch DATABASE_URL sind gesetzt.");
}

const adapter = new PrismaPg({
    connectionString,
});

const prismaClientSingleton = () => {
    return new PrismaClient({
        adapter,
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