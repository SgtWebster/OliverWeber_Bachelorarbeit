import { redirect } from "next/navigation";
import { hasAdminAccess, logoutAdmin } from "@/app/lib/auth/admin";
import { prisma } from "@/app/lib/db/prisma";

const genderLabels: Record<string, string> = {
    m: "Männlich",
    w: "Weiblich",
    d: "Divers",
    x: "Keine Angabe",
};

const educationLabels: Record<string, string> = {
    kein_abschluss: "Kein Abschluss",
    pflichtschule: "Pflichtschule",
    lehre: "Lehre / Fachschule",
    meister: "Meister / Werkmeister",
    matura: "Matura / Abitur",
    bachelor: "Bachelor",
    master: "Master / Magister",
    promotion: "Promotion",
    anderer: "Anderer Abschluss",
};

const toNumber = (value: number | null | undefined) => (value == null ? 0 : value);
const format1 = (value: number) => value.toFixed(1);
const formatInt = (value: number) => new Intl.NumberFormat("de-AT").format(value);
const formatPercent = (value: number) => `${Math.round(value)}%`;
const formatDateTime = (value: Date) =>
    new Intl.DateTimeFormat("de-AT", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(value);
const formatNullableNumber = (value: number | null | undefined, digits = 1) =>
    value == null ? "-" : value.toFixed(digits);

type StatusTone = "good" | "neutral" | "critical";

function statusClasses(tone: StatusTone) {
    if (tone === "good") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (tone === "critical") {
        return "border-rose-200 bg-rose-50 text-rose-700";
    }
    return "border-amber-200 bg-amber-50 text-amber-700";
}

function ratioTone(value: number, good: number, neutral: number): StatusTone {
    if (value >= good) return "good";
    if (value >= neutral) return "neutral";
    return "critical";
}

export default async function DashboardPage() {
    if (!(await hasAdminAccess())) {
        redirect("/admin");
    }

    const completeSessionWhere = {
        currentPhase: "DEBRIEFING",
        socialAdherence: { not: null },
        compliance: { not: null },
        performanceTrust: { not: null },
        moralTrust: { not: null },
        perceivedHumanlikeness: { not: null },
        mReliable: { not: null },
        mCapable: { not: null },
        mCompetent: { not: null },
        mMeticulous: { not: null },
        mEthical: { not: null },
        mRespectable: { not: null },
        mSincere: { not: null },
        mBenevolent: { not: null },
        techAffinity: { not: null },
        aiExperience: { not: null },
        criticalSystemExp: { not: null },
        age: { not: null },
        AND: [
            { gender: { not: null } },
            { gender: { not: "" } },
            { education: { not: null } },
            { education: { not: "" } },
        ],
    };

    const [
        totalSessions,
        completeSessions,
        averages,
        genderDistribution,
        educationDistribution,
        criticalExperienceDistribution,
        ageRows,
        phaseDistribution,
        groupDistribution,
        latestSession,
        allRows,
    ] = await Promise.all([
        prisma.participantSession.count(),
        prisma.participantSession.count({ where: completeSessionWhere }),
        prisma.participantSession.aggregate({
            where: completeSessionWhere,
            _avg: {
                socialAdherence: true,
                compliance: true,
                performanceTrust: true,
                moralTrust: true,
                perceivedHumanlikeness: true,
                mReliable: true,
                mCapable: true,
                mCompetent: true,
                mMeticulous: true,
                mEthical: true,
                mRespectable: true,
                mSincere: true,
                mBenevolent: true,
                techAffinity: true,
                aiExperience: true,
                age: true,
            },
        }),
        prisma.participantSession.groupBy({
            by: ["gender"],
            where: completeSessionWhere,
            _count: { _all: true },
            orderBy: { _count: { gender: "desc" } },
        }),
        prisma.participantSession.groupBy({
            by: ["education"],
            where: completeSessionWhere,
            _count: { _all: true },
            orderBy: { _count: { education: "desc" } },
        }),
        prisma.participantSession.groupBy({
            by: ["criticalSystemExp"],
            where: completeSessionWhere,
            _count: { _all: true },
        }),
        prisma.participantSession.findMany({
            where: completeSessionWhere,
            select: { age: true },
        }),
        prisma.participantSession.groupBy({
            by: ["currentPhase"],
            _count: { _all: true },
            orderBy: { _count: { currentPhase: "desc" } },
        }),
        prisma.participantSession.groupBy({
            by: ["group"],
            where: completeSessionWhere,
            _count: { _all: true },
            orderBy: { _count: { group: "desc" } },
        }),
        prisma.participantSession.findFirst({
            orderBy: { updatedAt: "desc" },
            select: { updatedAt: true },
        }),
        prisma.participantSession.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                group: true,
                currentPhase: true,
                socialAdherence: true,
                compliance: true,
                mReliable: true,
                mCapable: true,
                mCompetent: true,
                mMeticulous: true,
                mEthical: true,
                mRespectable: true,
                mSincere: true,
                mBenevolent: true,
                performanceTrust: true,
                moralTrust: true,
                perceivedHumanlikeness: true,
                techAffinity: true,
                aiExperience: true,
                criticalSystemExp: true,
                age: true,
                gender: true,
                education: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
    ]);

    const completionRate = totalSessions > 0 ? (completeSessions / totalSessions) * 100 : 0;
    const incompleteSessions = totalSessions - completeSessions;
    const avgPerformanceTrust = toNumber(averages._avg.performanceTrust);
    const avgMoralTrust = toNumber(averages._avg.moralTrust);
    const complianceRate = toNumber(averages._avg.compliance) * 100;
    const avgHumanlikeness = toNumber(averages._avg.perceivedHumanlikeness);
    const avgSocialAdherence = toNumber(averages._avg.socialAdherence);
    const averageAge = toNumber(averages._avg.age);
    const avgTechAffinity = toNumber(averages._avg.techAffinity);
    const avgAiExperience = toNumber(averages._avg.aiExperience);

    const ageValues = ageRows.map((entry) => entry.age).filter((age): age is number => age != null);
    const ageBuckets = [
        { label: "18–24", count: ageValues.filter((age) => age >= 18 && age <= 24).length },
        { label: "25–34", count: ageValues.filter((age) => age >= 25 && age <= 34).length },
        { label: "35–44", count: ageValues.filter((age) => age >= 35 && age <= 44).length },
        { label: "45+", count: ageValues.filter((age) => age >= 45).length },
    ];

    const qualityTone = ratioTone(completionRate, 80, 65);
    const complianceTone = ratioTone(complianceRate, 75, 60);
    const trustTone = ratioTone(((avgPerformanceTrust + avgMoralTrust) / 2) * 14.2857, 70, 55);

    const alerts: string[] = [];
    if (completionRate < 70) alerts.push("Vollständigkeitsquote unter 70%: zusätzliche Nachvervollständigung priorisieren.");
    if (incompleteSessions > 0) alerts.push(`${incompleteSessions} Datensätze sind unvollständig und beeinflussen Zwischenanalysen.`);
    if (alerts.length === 0) alerts.push("Keine kritischen Auffälligkeiten: Monitoring auf aktuellem Kurs.");

    const phaseMax = Math.max(1, ...phaseDistribution.map((item) => item._count._all));
    const groupMax = Math.max(1, ...groupDistribution.map((item) => item._count._all));

    async function handleLogout() {
        "use server";
        await logoutAdmin();
        redirect("/");
    }

    return (
        <section className="min-h-[72vh] bg-slate-100 px-5 py-8 xl:px-8 2xl:px-10">
            <div className="mx-auto w-full max-w-[1700px] rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                <header className="border-b border-slate-200 bg-slate-950 px-8 py-7 text-white 2xl:px-10">
                    <div className="flex items-end justify-between gap-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Was gibts neues?</p>
                            <h1 className="mt-2 text-4xl font-black tracking-tight">Experiment Control Dashboard</h1>
                            {/*<p className="mt-2 max-w-4xl text-sm text-slate-300">*/}
                            {/*    Desktop-optimiert für schnelle Lageeinschätzung, Treiberanalyse und konkrete nächste Maßnahmen.*/}
                            {/*</p>*/}
                        </div>
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-400">Letzte Datenaktualisierung</p>
                            <p className="mt-1 text-sm font-semibold text-slate-100">
                                {latestSession?.updatedAt ? formatDateTime(latestSession.updatedAt) : "Keine Daten"}
                            </p>
                        </div>
                    </div>
                </header>

                {/*<div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-8 py-3 backdrop-blur 2xl:px-10">*/}
                {/*    <div className="grid grid-cols-4 gap-3 text-xs">*/}
                {/*        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">*/}
                {/*            <p className="font-semibold text-slate-500">Zeitraum</p>*/}
                {/*            <p className="mt-0.5 font-bold text-slate-800">Gesamtdatenstand</p>*/}
                {/*        </div>*/}
                {/*        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">*/}
                {/*            <p className="font-semibold text-slate-500">Analysefokus</p>*/}
                {/*            <p className="mt-0.5 font-bold text-slate-800">Zwischenstand & Datengüte</p>*/}
                {/*        </div>*/}
                {/*        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">*/}
                {/*            <p className="font-semibold text-slate-500">Segmente</p>*/}
                {/*            <p className="mt-0.5 font-bold text-slate-800">Geschlecht, Alter, Bildung, Gruppe</p>*/}
                {/*        </div>*/}
                {/*        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">*/}
                {/*            <p className="font-semibold text-slate-500">Mode</p>*/}
                {/*            <p className="mt-0.5 font-bold text-slate-800">Desktop / FullHD+</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="px-8 py-7 2xl:px-10">
                    <section className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Teilnehmer gesamt</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{formatInt(totalSessions)}</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Vollständigkeit</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{formatPercent(completionRate)}</p>
                            <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusClasses(qualityTone)}`}>
                                Qualität
                            </span>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Compliance</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{formatPercent(complianceRate)}</p>
                            <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusClasses(complianceTone)}`}>
                                vs Ziel 75%
                            </span>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Social Adherence</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{format1(avgSocialAdherence)}</p>
                            <p className="mt-1 text-xs text-slate-600">nur vollständige Datensätze</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trust (Leistung)</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{format1(avgPerformanceTrust)}</p>
                            <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusClasses(trustTone)}`}>
                                Skala 1–7
                            </span>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trust (Moral)</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{format1(avgMoralTrust)}</p>
                            <p className="mt-1 text-xs text-slate-600">Humanlikeness: {format1(avgHumanlikeness)}</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Technikaffinität (Ø)</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{format1(avgTechAffinity)}</p>
                            <p className="mt-1 text-xs text-slate-600">Skala 1–7</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">KI-Erfahrung (Ø)</p>
                            <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{format1(avgAiExperience)}</p>
                            <p className="mt-1 text-xs text-slate-600">Skala 1–7</p>
                        </article>
                    </section>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
                        <div className="space-y-6">
                            <section className="grid gap-6 xl:grid-cols-2">
                                <article className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-base font-black text-slate-900">Ursachen: Funnel & Prozessstatus</h2>
                                    <div className="mt-4 space-y-3 text-sm">
                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="font-semibold text-slate-700">Gesamte Sessions</span>
                                                <span className="font-bold text-slate-900">{formatInt(totalSessions)}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200">
                                                <div className="h-2 rounded-full bg-slate-500" style={{ width: "100%" }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="font-semibold text-slate-700">Vollständige Datensätze</span>
                                                <span className="font-bold text-slate-900">{formatInt(completeSessions)}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200">
                                                <div
                                                    className="h-2 rounded-full bg-emerald-500"
                                                    style={{ width: `${Math.max(0, completionRate)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="font-semibold text-slate-700">Unvollständig</span>
                                                <span className="font-bold text-slate-900">{formatInt(incompleteSessions)}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200">
                                                <div
                                                    className="h-2 rounded-full bg-amber-500"
                                                    style={{ width: `${Math.max(0, 100 - completionRate)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 space-y-2">
                                        {phaseDistribution.map((item) => (
                                            <div key={item.currentPhase}>
                                                <div className="mb-1 flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-slate-700">{item.currentPhase}</span>
                                                    <span className="font-bold text-slate-900">{item._count._all}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-200">
                                                    <div
                                                        className="h-2 rounded-full bg-indigo-500"
                                                        style={{ width: `${(item._count._all / phaseMax) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                <article className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-base font-black text-slate-900">Treiber: Segment-Übersicht</h2>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Gruppenverteilung (vollständig)</p>
                                            <div className="space-y-2">
                                                {groupDistribution.map((item) => (
                                                    <div key={item.group}>
                                                        <div className="mb-1 flex items-center justify-between text-xs">
                                                            <span className="font-semibold text-slate-700">{item.group}</span>
                                                            <span className="font-bold text-slate-900">{item._count._all}</span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-slate-200">
                                                            <div
                                                                className="h-2 rounded-full bg-cyan-600"
                                                                style={{ width: `${(item._count._all / groupMax) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Ø Alter</p>
                                                <p className="mt-1 text-2xl font-black text-slate-900">{format1(averageAge)}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Kritische Erfahrung (Ja)</p>
                                                <p className="mt-1 text-2xl font-black text-slate-900">
                                                    {criticalExperienceDistribution.find((item) => item.criticalSystemExp)?._count._all ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h2 className="text-base font-black text-slate-900">Detailansicht: alle Sessions & alle Experimentfelder</h2>
                                <p className="mt-1 text-xs text-slate-500">Vollständige Rohdatenansicht ohne Leads, sortiert nach Erstellzeit.</p>
                                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="min-w-full text-xs">
                                        <thead className="bg-slate-100 text-slate-700">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-bold">id</th>
                                                <th className="px-3 py-2 text-left font-bold">group</th>
                                                <th className="px-3 py-2 text-left font-bold">phase</th>
                                                <th className="px-3 py-2 text-right font-bold">social</th>
                                                <th className="px-3 py-2 text-right font-bold">compliance</th>
                                                <th className="px-3 py-2 text-right font-bold">mRel</th>
                                                <th className="px-3 py-2 text-right font-bold">mCap</th>
                                                <th className="px-3 py-2 text-right font-bold">mCom</th>
                                                <th className="px-3 py-2 text-right font-bold">mMet</th>
                                                <th className="px-3 py-2 text-right font-bold">mEth</th>
                                                <th className="px-3 py-2 text-right font-bold">mRes</th>
                                                <th className="px-3 py-2 text-right font-bold">mSin</th>
                                                <th className="px-3 py-2 text-right font-bold">mBen</th>
                                                <th className="px-3 py-2 text-right font-bold">pTrust</th>
                                                <th className="px-3 py-2 text-right font-bold">mTrust</th>
                                                <th className="px-3 py-2 text-right font-bold">human</th>
                                                <th className="px-3 py-2 text-right font-bold">tech</th>
                                                <th className="px-3 py-2 text-right font-bold">aiExp</th>
                                                <th className="px-3 py-2 text-left font-bold">criticalExp</th>
                                                <th className="px-3 py-2 text-right font-bold">age</th>
                                                <th className="px-3 py-2 text-left font-bold">gender</th>
                                                <th className="px-3 py-2 text-left font-bold">education</th>
                                                <th className="px-3 py-2 text-left font-bold">createdAt</th>
                                                <th className="px-3 py-2 text-left font-bold">updatedAt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allRows.map((row) => (
                                                <tr key={row.id} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60">
                                                    <td className="px-3 py-2 font-mono text-[11px] text-slate-700">{row.id}</td>
                                                    <td className="px-3 py-2">{row.group}</td>
                                                    <td className="px-3 py-2">{row.currentPhase}</td>
                                                    <td className="px-3 py-2 text-right">{row.socialAdherence ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.compliance ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mReliable ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mCapable ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mCompetent ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mMeticulous ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mEthical ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mRespectable ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mSincere ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.mBenevolent ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(row.performanceTrust)}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(row.moralTrust)}</td>
                                                    <td className="px-3 py-2 text-right">{row.perceivedHumanlikeness ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.techAffinity ?? "-"}</td>
                                                    <td className="px-3 py-2 text-right">{row.aiExperience ?? "-"}</td>
                                                    <td className="px-3 py-2">{row.criticalSystemExp == null ? "-" : row.criticalSystemExp ? "Ja" : "Nein"}</td>
                                                    <td className="px-3 py-2 text-right">{row.age ?? "-"}</td>
                                                    <td className="px-3 py-2">{genderLabels[row.gender ?? ""] ?? row.gender ?? "-"}</td>
                                                    <td className="px-3 py-2">{educationLabels[row.education ?? ""] ?? row.education ?? "-"}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(row.updatedAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h2 className="text-base font-black text-slate-900">Was ist jetzt wichtig?</h2>
                                <div className="mt-3 space-y-2">
                                    {alerts.map((alert, index) => (
                                        <div key={`${alert}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                                            {alert}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h2 className="text-base font-black text-slate-900">Demographie-Snapshot</h2>
                                <div className="mt-3 space-y-4">
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Geschlecht</p>
                                        <div className="space-y-2">
                                            {genderDistribution.map((item) => {
                                                const count = item._count._all;
                                                const percent = completeSessions > 0 ? (count / completeSessions) * 100 : 0;
                                                return (
                                                    <div key={item.gender ?? "unknown"}>
                                                        <div className="mb-1 flex items-center justify-between text-xs">
                                                            <span className="font-semibold text-slate-700">{genderLabels[item.gender ?? ""] ?? item.gender ?? "Unbekannt"}</span>
                                                            <span className="font-bold text-slate-900">{count}</span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-slate-200">
                                                            <div className="h-2 rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Altersverteilung</p>
                                        <div className="space-y-2">
                                            {ageBuckets.map((bucket) => {
                                                const percent = completeSessions > 0 ? (bucket.count / completeSessions) * 100 : 0;
                                                return (
                                                    <div key={bucket.label}>
                                                        <div className="mb-1 flex items-center justify-between text-xs">
                                                            <span className="font-semibold text-slate-700">{bucket.label}</span>
                                                            <span className="font-bold text-slate-900">{bucket.count}</span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-slate-200">
                                                            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h2 className="text-base font-black text-slate-900">Bildung (vollständig)</h2>
                                <div className="mt-3 space-y-2">
                                    {educationDistribution.map((item) => {
                                        const count = item._count._all;
                                        const percent = completeSessions > 0 ? (count / completeSessions) * 100 : 0;
                                        return (
                                            <div key={item.education ?? "unknown"}>
                                                <div className="mb-1 flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-slate-700">
                                                        {educationLabels[item.education ?? ""] ?? item.education ?? "Unbekannt"}
                                                    </span>
                                                    <span className="font-bold text-slate-900">{count}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-200">
                                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <form action={handleLogout}>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                                >
                                    Admin-Logout
                                </button>
                            </form>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}
