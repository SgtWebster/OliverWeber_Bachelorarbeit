import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_session";

function getAdminCode(): string | null {
    return process.env.ADMIN_ACCESS_CODE ?? null;
}

function buildSessionToken(adminCode: string): string {
    return createHash("sha256").update(`admin:${adminCode}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
    const bufferA = Buffer.from(a, "utf8");
    const bufferB = Buffer.from(b, "utf8");
    if (bufferA.length !== bufferB.length) {
        return false;
    }
    return timingSafeEqual(bufferA, bufferB);
}

export async function loginAsAdmin(inputCode: string): Promise<boolean> {
    const adminCode = getAdminCode();
    if (!adminCode) {
        return false;
    }
    const normalizedInput = inputCode.trim();
    if (!safeEqual(normalizedInput, adminCode)) {
        return false;
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, buildSessionToken(adminCode), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
    });

    return true;
}

export async function logoutAdmin(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function hasAdminAccess(): Promise<boolean> {
    const cookieStore = await cookies();
    const adminCode = getAdminCode();
    if (!adminCode) {
        return false;
    }
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!sessionToken) {
        return false;
    }

    const expectedToken = buildSessionToken(adminCode);
    return safeEqual(sessionToken, expectedToken);
}
