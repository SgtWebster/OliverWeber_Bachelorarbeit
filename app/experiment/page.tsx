// app/experiment/page.tsx
"use client";

export default function ExperimentDisclaimerPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Einverständniserklärung</h1>
            
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 text-slate-300 space-y-4 leading-relaxed">
                <p>
                    Herzlich willkommen. Bevor das Experiment beginnt, bitten wir dich, die folgenden Hinweise aufmerksam zu lesen.
                </p>
                <p>
                    <strong>Ablauf und Zweck:</strong><br />
                    [Hier kommt die genaue Beschreibung des Versuchszwecks hin. Platzhalter für Instruktionen.]
                </p>
                <p>
                    <strong>Datenschutz:</strong><br />
                    Alle erhobenen Daten werden streng vertraulich und vollständig anonymisiert behandelt. Es ist kein Rückschluss auf deine Person möglich.
                </p>
                <p>
                    <strong>Freiwilligkeit:</strong><br />
                    Die Teilnahme ist absolut freiwillig. Du kannst das Experiment jederzeit ohne Angabe von Gründen abbrechen.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-8 border-t border-slate-800">
                <button 
                    disabled
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors opacity-50 cursor-not-allowed"
                >
                    Ich stimme zu und möchte beginnen
                </button>
                <p className="text-sm text-slate-500">
                    (Funktion vorübergehend deaktiviert)
                </p>
            </div>
        </div>
    );
}