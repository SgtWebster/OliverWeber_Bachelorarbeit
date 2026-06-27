"use server";

import { redirect } from "next/navigation";
import { loginAsAdmin } from "@/app/lib/auth/admin";

export type AdminLoginState = {
    error: string | null;
};

export async function adminLoginAction(
    _prevState: AdminLoginState,
    formData: FormData,
): Promise<AdminLoginState> {
    const accessCode = formData.get("accessCode");
    if (typeof accessCode !== "string" || accessCode.trim().length === 0) {
        return { error: "Bitte gib einen Admin-Code ein." };
    }

    const isValid = await loginAsAdmin(accessCode);
    if (!isValid) {
        return { error: "Der eingegebene Admin-Code ist ungültig." };
    }

    redirect("/dashboard");
}
