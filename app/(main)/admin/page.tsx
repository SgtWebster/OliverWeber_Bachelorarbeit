import { redirect } from "next/navigation";
import { loginAsAdmin } from "@/app/lib/auth/admin";

export default function AdminEntryPage() {
    async function handleAdminLogin(formData: FormData) {
        "use server";

        const accessCode = formData.get("accessCode");
        if (typeof accessCode !== "string") {
            return;
        }

        const isValid = await loginAsAdmin(accessCode);
        if (!isValid) {
            return;
        }

        redirect("/dashboard");
    }

    return (
        <section className="flex min-h-[70vh] items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-white">Admin-Zugang</h1>
                <p className="mt-2 text-sm text-slate-300">
                    Gib deinen Admin-Code ein, um ins Dashboard zu gelangen.
                </p>

                <form action={handleAdminLogin} className="mt-6 flex flex-col gap-4">
                    <input
                        name="accessCode"
                        type="password"
                        required
                        autoComplete="off"
                        placeholder="Admin-Code"
                        className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-teal-400"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
                    >
                        Einloggen
                    </button>
                </form>
            </div>
        </section>
    );
}
