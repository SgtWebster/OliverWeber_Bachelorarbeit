import AdminLoginForm from "./AdminLoginForm";

export default function AdminEntryPage() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-white">Admin-Zugang</h1>
                <p className="mt-2 text-sm text-slate-300">
                    Gib deinen Admin-Code ein, um ins Dashboard zu gelangen.
                </p>

                <AdminLoginForm />
            </div>
        </section>
    );
}
