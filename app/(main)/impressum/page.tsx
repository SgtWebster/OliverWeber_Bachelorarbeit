// app/impressum/page.tsx

export const metadata = {
    title: "Impressum | Oliver Ulrich Weber",
    description: "Impressum (privat) – Kontakt- und Anbieterangaben.",
};

export default function ImpressumPage() {
    return (
        <div>
            {/* Header */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
                {/*<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">*/}
                {/*    <span className="h-2 w-2 rounded-full bg-teal-500" />*/}
                {/*    Impressum*/}
                {/*    <span className="text-slate-300">•</span>*/}
                {/*    privat*/}
                {/*</div>*/}

                <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Impressum
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                    Anbieterinformationen für diese private Website.
                </p>
            </section>

            {/* Content */}
            <section className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
                {/* Kontakt / Anbieter */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Kontakt</h2>
                    <p className="mt-2 text-sm text-slate-600">Die schnellste Kontaktmöglichkeit ist per E-Mail.</p>

                    <dl className="mt-5 space-y-4 text-sm">
                        <div>
                            <dt className="text-xs font-semibold text-slate-500">Name</dt>
                            <dd className="mt-1 text-slate-900">Oliver "Ulrich" Weber</dd>
                        </div>

                        <div>
                            <dt className="text-xs font-semibold text-slate-500">Anschrift</dt>
                            <dd className="mt-1 text-slate-900">
                                Steinweg 16/12
                                <br />
                                5071 Wals-Siezenheim
                                <br />
                                Österreich
                            </dd>
                        </div>

                        <div>
                            <dt className="text-xs font-semibold text-slate-500">E-Mail</dt>
                            <dd className="mt-1">
                                <a
                                    className="font-medium text-teal-700 hover:text-teal-800"
                                    href="mailto:ulrich@oliver-weber.at"
                                >
                                    ulrich@oliver-weber.at
                                </a>
                            </dd>
                        </div>

                        {/* optional */}
                        {/* <div>
              <dt className="text-xs font-semibold text-slate-500">Telefon (optional)</dt>
              <dd className="mt-1 text-slate-900">+43 …</dd>
            </div> */}
                    </dl>
                </div>

                {/* Zweck / Blattlinie */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Zweck der Website</h2>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm leading-relaxed text-slate-700">
                            Private Portfolio-Website zur Darstellung von Projekten, akademischen Inhalten und Kontaktmöglichkeiten.
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-slate-900">Hinweis</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Externe Links werden sorgfältig ausgewählt. Für Inhalte verlinkter Seiten sind ausschließlich deren Betreiber
                            verantwortlich.
                        </p>
                    </div>
                </div>
            </section>

            {/*/!* Minimaler Footer-Block (optional) *!/*/}
            {/*<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">*/}
            {/*    <h2 className="text-base font-semibold text-slate-900">Datenschutz</h2>*/}
            {/*    <p className="mt-2 text-sm text-slate-600">*/}
            {/*        Details findest du in der{" "}*/}
            {/*        <a className="font-medium text-teal-700 hover:text-teal-800" href="/datenschutz">*/}
            {/*            Datenschutzerklärung*/}
            {/*        </a>*/}
            {/*        .*/}
            {/*    </p>*/}
            {/*</section>*/}
        </div>
    );
}
