"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLoginAction, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { error: null };

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
            {pending ? (
                <>
                    <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900"
                    />
                    Anmeldung läuft…
                </>
            ) : (
                "Einloggen"
            )}
        </button>
    );
}

export default function AdminLoginForm() {
    const [state, formAction] = useActionState(adminLoginAction, initialState);

    return (
        <form action={formAction} className="mt-6 flex flex-col gap-4">
            <input
                name="accessCode"
                type="password"
                required
                autoComplete="off"
                placeholder="Admin-Code"
                aria-invalid={state.error ? true : undefined}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-teal-400 aria-[invalid=true]:border-red-400"
            />

            {state.error ? (
                <p role="alert" className="text-sm text-red-400">
                    {state.error}
                </p>
            ) : null}

            <SubmitButton />
        </form>
    );
}
