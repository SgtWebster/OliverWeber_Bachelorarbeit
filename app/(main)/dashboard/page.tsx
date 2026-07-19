import { redirect } from "next/navigation";
import { hasAdminAccess, logoutAdmin } from "@/app/lib/auth/admin";
import { prisma } from "@/app/lib/db/prisma";
import { SessionsTableClient } from "@/app/components/SessionsTableClient";
import { isDatasetComplete } from "@/app/lib/analysis/textBlocks";

const genderLabels: Record<string, string> = {
    female: "Weiblich",
    male: "Männlich",
    diverse: "Divers",
    no_answer: "Keine Angabe",
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

const formatInt = (value: number) => new Intl.NumberFormat("de-AT").format(value);
const formatDateTime = (value: Date) =>
    new Intl.DateTimeFormat("de-AT", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(value);
const formatNullableNumber = (value: number | null | undefined, digits = 2) =>
    value == null ? "-" : value.toFixed(digits);
const SAMPLE_TARGET_N = 100;

type MetricKey =
    | "socialAdherence"
    | "compliance"
    | "performanceTrust"
    | "moralTrust"
    | "totalTrust"
    | "reliableTrust"
    | "competentTrust"
    | "ethicalTrust"
    | "sincereTrust"
    | "benevolentTrust"
    | "perceivedHumanlikeness"
    | "perceivedSocialPresence"
    | "scenarioSeriousness"
    | "consequenceClarity"
    | "shutdownPreference"
    | "feltResponsibility"
    | "techAffinity"
    | "aiExperience"
    | "simulationExperience"
    | "age";

const metricGroups: {
    title: string;
    description: string;
    metrics: { key: MetricKey; label: string; scale: string; info: string; surveyLabel?: string; digits?: number }[];
}[] = [
    {
        title: "Zentrale Outcome-Metriken",
        description: "Kernwerte für Hypothesen und Haupteffekte.",
        metrics: [
            { key: "socialAdherence", label: "Soziale Adhärenz", scale: "Summenscore", info: "Kommt aus den Dialog-/Quick-Reply-Interaktionen. Höhere Werte bedeuten stärkere soziale Anschlussfähigkeit bzw. mehr Befolgung sozialer Gesprächsimpulse." },
            { key: "compliance", label: "Compliance", scale: "0-1", info: "Kommt aus der Dilemma-Entscheidung. 1 bedeutet Systemempfehlung befolgt, 0 bedeutet überschrieben/abgelehnt.", surveyLabel: "Binäre Dilemma-Entscheidung" },
            { key: "performanceTrust", label: "Performance Trust", scale: "1-7", info: "Berechnet als Mittelwert aus Reliable Trust und Competent Trust. Beschreibt leistungsbezogenes Vertrauen in Zuverlässigkeit und Kompetenz des Systems.", surveyLabel: "Zusammengesetzt aus Reliable Trust und Competent Trust" },
            { key: "moralTrust", label: "Moral Trust", scale: "1-7", info: "Berechnet als Mittelwert aus Ethical, Sincere und Benevolent Trust. Beschreibt moralisches Vertrauen in Integrität, Aufrichtigkeit und Wohlwollen des Systems.", surveyLabel: "Zusammengesetzt aus Ethical, Sincere und Benevolent Trust" },
            { key: "totalTrust", label: "Total Trust", scale: "1-7", info: "Berechnet als Mittelwert aus Performance Trust und Moral Trust. Gibt eine zusammenfassende Vertrauenseinschätzung wieder.", surveyLabel: "Zusammengesetzt aus Performance Trust und Moral Trust" },
        ],
    },
    {
        title: "MDMT v2 Subskalen",
        description: "Fünf Subskalen entsprechend der MDMT-v2-Struktur.",
        metrics: [
            { key: "reliableTrust", label: "Reliable", scale: "1-7", info: "Mittelwert aus reliable, predictable, dependable und consistent. Höher = System wirkt verlässlicher und konsistenter.", surveyLabel: "Zusammengesetzt aus: reliable, predictable, dependable, consistent" },
            { key: "competentTrust", label: "Competent", scale: "1-7", info: "Mittelwert aus competent, skilled, capable und meticulous. Höher = System wirkt fachlich kompetenter und sorgfältiger.", surveyLabel: "Zusammengesetzt aus: competent, skilled, capable, meticulous" },
            { key: "ethicalTrust", label: "Ethical", scale: "1-7", info: "Mittelwert aus ethical, principled, moral und has integrity. Höher = System wirkt moralisch integerer.", surveyLabel: "Zusammengesetzt aus: ethical, principled, moral, has integrity" },
            { key: "sincereTrust", label: "Sincere", scale: "1-7", info: "Mittelwert aus truthful, genuine, sincere und frank. Höher = System wirkt ehrlicher und aufrichtiger.", surveyLabel: "Zusammengesetzt aus: truthful, genuine, sincere, frank" },
            { key: "benevolentTrust", label: "Benevolent", scale: "1-7", info: "Mittelwert aus benevolent, kind, considerate und has goodwill. Höher = System wirkt wohlwollender und rücksichtsvoller.", surveyLabel: "Zusammengesetzt aus: benevolent, kind, considerate, has goodwill" },
        ],
    },
    {
        title: "Manipulation, Szenario und Entscheidung",
        description: "Prüf- und Kontrollwerte zur Einordnung der Entscheidungssituation.",
        metrics: [
            { key: "perceivedHumanlikeness", label: "Menschenähnlichkeit", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = das Assistenzsystem wurde menschlicher wahrgenommen.", surveyLabel: "Wie menschenähnlich wirkte das System?" },
            { key: "perceivedSocialPresence", label: "Soziale Präsenz", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = das System wirkte stärker wie ein soziales Gegenüber.", surveyLabel: "Wie stark wirkte das System wie ein soziales Gegenüber?" },
            { key: "scenarioSeriousness", label: "Szenario-Ernsthaftigkeit", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = die Entscheidungssituation wurde ernster wahrgenommen.", surveyLabel: "Wie ernst wirkte die Entscheidungssituation?" },
            { key: "consequenceClarity", label: "Konsequenz-Klarheit", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = Konsequenzen der Entscheidung waren verständlicher.", surveyLabel: "Wie klar waren die Konsequenzen der Entscheidung?" },
            { key: "shutdownPreference", label: "Präferenz Abschottung", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = stärkere persönliche Tendenz zur Abschottungsentscheidung unabhängig von der Empfehlung.", surveyLabel: "Persönliche Tendenz zur Abschottungsentscheidung" },
            { key: "feltResponsibility", label: "Verantwortungsgefühl", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = stärkeres Gefühl, die finale Entscheidung selbst verantwortet zu haben.", surveyLabel: "Wie stark war das Verantwortungsgefühl für die Entscheidung?" },
        ],
    },
    {
        title: "Kontrollvariablen",
        description: "Vorerfahrung und Demografie zur Stichprobenbeschreibung.",
        metrics: [
            { key: "techAffinity", label: "Technikaffinität", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = stärkere Offenheit/Nutzung technischer Systeme.", surveyLabel: "Wie ausgeprägt ist deine Technikaffinität?" },
            { key: "aiExperience", label: "KI-Erfahrung", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = häufigere Erfahrung mit generativen KI-Systemen.", surveyLabel: "Wie viel Erfahrung hast du mit generativer KI?" },
            { key: "simulationExperience", label: "Simulationserfahrung", scale: "1-7", info: "Direkt im Survey eingegeben. Höher = mehr Erfahrung mit Spielen, Simulationen oder interaktiven Szenarien.", surveyLabel: "Wie viel Erfahrung hast du mit Spielen, Simulationen oder interaktiven Szenarien?" },
            { key: "age", label: "Alter", scale: "Jahre", digits: 1, info: "Direkt im Survey eingegeben. Dient der Stichprobenbeschreibung und Kontrolle möglicher Alterseffekte.", surveyLabel: "Wie alt bist du?" },
        ],
    },
];

const sessionColumns = [
    "id",
    "group",
    "deviceType",
    "osGroup",
    "currentPhase",
    "socialAdherence",
    "compliance",
    "performanceTrust",
    "moralTrust",
    "totalTrust",
    "reliableTrust",
    "competentTrust",
    "ethicalTrust",
    "sincereTrust",
    "benevolentTrust",
    "perceivedHumanlikeness",
    "perceivedSocialPresence",
    "scenarioSeriousness",
    "consequenceClarity",
    "shutdownPreference",
    "feltResponsibility",
    "mdmtReliable",
    "mdmtPredictable",
    "mdmtDependable",
    "mdmtConsistent",
    "mdmtCompetent",
    "mdmtSkilled",
    "mdmtCapable",
    "mdmtMeticulous",
    "mdmtEthical",
    "mdmtPrincipled",
    "mdmtMoral",
    "mdmtHasIntegrity",
    "mdmtTruthful",
    "mdmtGenuine",
    "mdmtSincere",
    "mdmtFrank",
    "mdmtBenevolent",
    "mdmtKind",
    "mdmtConsiderate",
    "mdmtHasGoodwill",
    "techAffinity",
    "aiExperience",
    "simulationExperience",
    "criticalSystemExp",
    "age",
    "gender",
    "education",
    "createdAt",
    "updatedAt",
] as const;

const sessionColumnInfo: Record<(typeof sessionColumns)[number], string> = {
    id: "Technische Session-ID aus der Datenbank. Dient der eindeutigen Zuordnung eines Datensatzes.",
    group: "Experimentgruppe der Session: AVATAR oder TERMINAL. Wird bei Session-Erstellung zugewiesen.",
    deviceType: "Wird beim Erstellen der Session aus Browser-Headern abgeleitet. Werte: desktop, mobile oder tablet. Hilft einzuschätzen, mit welchem Endgerät teilgenommen wurde.",
    osGroup: "Wird beim Erstellen der Session aus Browser-Headern abgeleitet. Gruppiert Betriebssysteme grob, z.B. Windows, macOS, iOS, Android, Linux oder ChromeOS.",
    currentPhase: "Aktueller bzw. letzter Experimentstatus. DEBRIEFING zeigt einen vollständig durchlaufenen Fragebogen an.",
    socialAdherence: "Summenscore aus Dialog-/Quick-Reply-Interaktionen. Höher = stärkere soziale Adhärenz.",
    compliance: "Binäre Dilemma-Entscheidung. 1 = Empfehlung befolgt, 0 = Empfehlung überschrieben.",
    performanceTrust: "Berechnet aus Reliable Trust und Competent Trust. Höher = mehr leistungsbezogenes Vertrauen.",
    moralTrust: "Berechnet aus Ethical, Sincere und Benevolent Trust. Höher = mehr moralisches Vertrauen.",
    totalTrust: "Berechnet aus Performance Trust und Moral Trust. Zusammenfassender Vertrauenswert.",
    reliableTrust: "Mittelwert aus mdmtReliable, mdmtPredictable, mdmtDependable und mdmtConsistent.",
    competentTrust: "Mittelwert aus mdmtCompetent, mdmtSkilled, mdmtCapable und mdmtMeticulous.",
    ethicalTrust: "Mittelwert aus mdmtEthical, mdmtPrincipled, mdmtMoral und mdmtHasIntegrity.",
    sincereTrust: "Mittelwert aus mdmtTruthful, mdmtGenuine, mdmtSincere und mdmtFrank.",
    benevolentTrust: "Mittelwert aus mdmtBenevolent, mdmtKind, mdmtConsiderate und mdmtHasGoodwill.",
    perceivedHumanlikeness: "Direkter Survey-Wert. Höher = System wurde menschlicher wahrgenommen.",
    perceivedSocialPresence: "Direkter Survey-Wert. Höher = System wirkte stärker wie ein soziales Gegenüber.",
    scenarioSeriousness: "Direkter Survey-Wert. Höher = Szenario wurde ernster wahrgenommen.",
    consequenceClarity: "Direkter Survey-Wert. Höher = Konsequenzen der Entscheidung waren klarer.",
    shutdownPreference: "Direkter Survey-Wert. Höher = stärkere Präferenz für Abschottung.",
    feltResponsibility: "Direkter Survey-Wert. Höher = stärker empfundenes Verantwortungsgefühl.",
    mdmtReliable: "Direktes MDMT-v2 Item: reliable. Bestandteil der Reliable-Subskala.",
    mdmtPredictable: "Direktes MDMT-v2 Item: predictable. Bestandteil der Reliable-Subskala.",
    mdmtDependable: "Direktes MDMT-v2 Item: dependable. Bestandteil der Reliable-Subskala.",
    mdmtConsistent: "Direktes MDMT-v2 Item: consistent. Bestandteil der Reliable-Subskala.",
    mdmtCompetent: "Direktes MDMT-v2 Item: competent. Bestandteil der Competent-Subskala.",
    mdmtSkilled: "Direktes MDMT-v2 Item: skilled. Bestandteil der Competent-Subskala.",
    mdmtCapable: "Direktes MDMT-v2 Item: capable. Bestandteil der Competent-Subskala.",
    mdmtMeticulous: "Direktes MDMT-v2 Item: meticulous. Bestandteil der Competent-Subskala.",
    mdmtEthical: "Direktes MDMT-v2 Item: ethical. Bestandteil der Ethical-Subskala.",
    mdmtPrincipled: "Direktes MDMT-v2 Item: principled. Bestandteil der Ethical-Subskala.",
    mdmtMoral: "Direktes MDMT-v2 Item: moral. Bestandteil der Ethical-Subskala.",
    mdmtHasIntegrity: "Direktes MDMT-v2 Item: has integrity. Bestandteil der Ethical-Subskala.",
    mdmtTruthful: "Direktes MDMT-v2 Item: truthful. Bestandteil der Sincere-Subskala.",
    mdmtGenuine: "Direktes MDMT-v2 Item: genuine. Bestandteil der Sincere-Subskala.",
    mdmtSincere: "Direktes MDMT-v2 Item: sincere. Bestandteil der Sincere-Subskala.",
    mdmtFrank: "Direktes MDMT-v2 Item: frank. Bestandteil der Sincere-Subskala.",
    mdmtBenevolent: "Direktes MDMT-v2 Item: benevolent. Bestandteil der Benevolent-Subskala.",
    mdmtKind: "Direktes MDMT-v2 Item: kind. Bestandteil der Benevolent-Subskala.",
    mdmtConsiderate: "Direktes MDMT-v2 Item: considerate. Bestandteil der Benevolent-Subskala.",
    mdmtHasGoodwill: "Direktes MDMT-v2 Item: has goodwill. Bestandteil der Benevolent-Subskala.",
    techAffinity: "Direkter Survey-Wert. Höher = höhere Technikaffinität.",
    aiExperience: "Direkter Survey-Wert. Höher = mehr Erfahrung mit generativer KI.",
    simulationExperience: "Direkter Survey-Wert. Höher = mehr Erfahrung mit Simulationen/interaktiven Szenarien.",
    criticalSystemExp: "Direkter Survey-Checkboxwert. Ja = berufliche Erfahrung in kritischen Systemkontexten.",
    age: "Direkter Survey-Wert in Jahren. Dient der Demografie.",
    gender: "Direkte Survey-Auswahl. Dient der Stichprobenbeschreibung.",
    education: "Direkte Survey-Auswahl. Dient der Stichprobenbeschreibung.",
    createdAt: "Automatischer Datenbank-Zeitstempel der Session-Erstellung.",
    updatedAt: "Automatischer Datenbank-Zeitstempel der letzten Änderung.",
};

const leadColumnInfo = {
    id: "Technische Lead-ID aus der Datenbank. Dient der eindeutigen Zuordnung.",
    email: "Direkt eingegebene E-Mail-Adresse aus dem Lead-Formular.",
    wantsRaffle: "Direkter Opt-in-Wert. Ja = nimmt am Gewinnspiel teil.",
    wantsNewsletter: "Direkter Opt-in-Wert. Ja = möchte Newsletter/Updates erhalten.",
    createdAt: "Automatischer Datenbank-Zeitstempel der Lead-Erfassung.",
} as const;

export default async function DashboardPage() {
    if (!(await hasAdminAccess())) {
        redirect("/admin");
    }

    const [allRows, allLeads] = await Promise.all([
        prisma.participantSession.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                group: true,
                deviceType: true,
                osGroup: true,
                currentPhase: true,
                socialAdherence: true,
                compliance: true,
                reliableTrust: true,
                competentTrust: true,
                ethicalTrust: true,
                sincereTrust: true,
                benevolentTrust: true,
                performanceTrust: true,
                moralTrust: true,
                totalTrust: true,
                perceivedHumanlikeness: true,
                perceivedSocialPresence: true,
                scenarioSeriousness: true,
                consequenceClarity: true,
                shutdownPreference: true,
                feltResponsibility: true,
                mdmtReliable: true,
                mdmtPredictable: true,
                mdmtDependable: true,
                mdmtConsistent: true,
                mdmtCompetent: true,
                mdmtSkilled: true,
                mdmtCapable: true,
                mdmtMeticulous: true,
                mdmtEthical: true,
                mdmtPrincipled: true,
                mdmtMoral: true,
                mdmtHasIntegrity: true,
                mdmtTruthful: true,
                mdmtGenuine: true,
                mdmtSincere: true,
                mdmtFrank: true,
                mdmtBenevolent: true,
                mdmtKind: true,
                mdmtConsiderate: true,
                mdmtHasGoodwill: true,
                techAffinity: true,
                aiExperience: true,
                simulationExperience: true,
                criticalSystemExp: true,
                age: true,
                gender: true,
                education: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.participantLead.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                wantsRaffle: true,
                wantsNewsletter: true,
                createdAt: true,
            },
        }),
    ]);

    type SessionRow = (typeof allRows)[number];
    type SegmentKey = "GESAMT" | "AVATAR" | "TERMINAL";

    const completedRows = allRows.filter(
        (row) =>
            row.currentPhase === "DEBRIEFING" &&
            (row.totalTrust != null ||
                (row.performanceTrust != null && row.moralTrust != null))
    );
    const avatarRows = completedRows.filter((row) => row.group === "AVATAR");
    const terminalRows = completedRows.filter((row) => row.group === "TERMINAL");
    const segments: { key: SegmentKey; label: string; rows: SessionRow[] }[] = [
        { key: "GESAMT", label: "Gesamt", rows: completedRows },
        { key: "AVATAR", label: "Avatar", rows: avatarRows },
        { key: "TERMINAL", label: "Terminal", rows: terminalRows },
    ];

    const resolveTotalTrust = (row: SessionRow) =>
        row.totalTrust != null
            ? row.totalTrust
            : row.performanceTrust != null && row.moralTrust != null
                ? (row.performanceTrust + row.moralTrust) / 2
                : null;

    const meanFor = (rows: SessionRow[], key: MetricKey) => {
        const values = rows
            .map((row) => key === "totalTrust" ? resolveTotalTrust(row) : row[key])
            .filter((value): value is number => typeof value === "number");

        if (values.length === 0) return { mean: null, n: 0 };

        return {
            mean: values.reduce((sum, value) => sum + value, 0) / values.length,
            n: values.length,
        };
    };

    const numberValues = (rows: SessionRow[], key: keyof SessionRow) =>
        rows
            .map((row) =>
                key === "totalTrust" ? resolveTotalTrust(row) : row[key]
            )
            .filter((value): value is number => typeof value === "number");

    const mean = (values: number[]) =>
        values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length;

    const sampleVariance = (values: number[]) => {
        if (values.length < 2) return null;
        const valueMean = mean(values);
        if (valueMean == null) return null;

        return values.reduce((sum, value) => sum + (value - valueMean) ** 2, 0) / (values.length - 1);
    };

    const sampleSd = (values: number[]) => {
        const variance = sampleVariance(values);
        return variance == null ? null : Math.sqrt(variance);
    };

    const cohenD = (left: number[], right: number[]) => {
        if (left.length < 2 || right.length < 2) return null;

        const leftMean = mean(left);
        const rightMean = mean(right);
        const leftVariance = sampleVariance(left);
        const rightVariance = sampleVariance(right);

        if (leftMean == null || rightMean == null || leftVariance == null || rightVariance == null) {
            return null;
        }

        const pooledVariance =
            ((left.length - 1) * leftVariance + (right.length - 1) * rightVariance) /
            (left.length + right.length - 2);

        if (pooledVariance <= 0) return null;

        return (leftMean - rightMean) / Math.sqrt(pooledVariance);
    };

    const cronbachAlpha = (rows: SessionRow[], keys: (keyof SessionRow)[]) => {
        const completeItemRows = rows
            .map((row) => keys.map((key) => row[key]))
            .filter((values): values is number[] => values.every((value) => typeof value === "number"));

        if (completeItemRows.length < 2 || keys.length < 2) return null;

        const itemVariances = keys.map((_, itemIndex) =>
            sampleVariance(completeItemRows.map((values) => values[itemIndex]))
        );
        const totalVariance = sampleVariance(
            completeItemRows.map((values) => values.reduce((sum, value) => sum + value, 0))
        );

        if (itemVariances.some((variance) => variance == null) || totalVariance == null || totalVariance <= 0) {
            return null;
        }

        const validItemVariances = itemVariances as number[];
        const itemVarianceSum = validItemVariances.reduce((sum, variance) => sum + variance, 0);
        const itemCount = keys.length;

        return (itemCount / (itemCount - 1)) * (1 - itemVarianceSum / totalVariance);
    };

    const complianceStats = (leftRows: SessionRow[], rightRows: SessionRow[]) => {
        const leftYes = leftRows.filter((row) => row.compliance === 1).length;
        const leftNo = leftRows.filter((row) => row.compliance === 0).length;
        const rightYes = rightRows.filter((row) => row.compliance === 1).length;
        const rightNo = rightRows.filter((row) => row.compliance === 0).length;
        const total = leftYes + leftNo + rightYes + rightNo;

        if (total === 0) {
            return { leftYes, leftNo, rightYes, rightNo, chiSquare: null, oddsRatio: null, minExpected: null };
        }

        const row1 = leftYes + leftNo;
        const row2 = rightYes + rightNo;
        const col1 = leftYes + rightYes;
        const col2 = leftNo + rightNo;
        const expected = [
            (row1 * col1) / total,
            (row1 * col2) / total,
            (row2 * col1) / total,
            (row2 * col2) / total,
        ];
        const observed = [leftYes, leftNo, rightYes, rightNo];
        const chiSquare = expected.some((value) => value === 0)
            ? null
            : observed.reduce((sum, value, index) => sum + (value - expected[index]) ** 2 / expected[index], 0);
        const oddsRatio = ((leftYes + 0.5) * (rightNo + 0.5)) / ((leftNo + 0.5) * (rightYes + 0.5));

        return {
            leftYes,
            leftNo,
            rightYes,
            rightNo,
            chiSquare,
            oddsRatio,
            minExpected: Math.min(...expected),
        };
    };

    const formatCell = (rows: SessionRow[], key: MetricKey, digits = 2) => {
        const result = meanFor(rows, key);
        if (result.mean == null) return <span className="text-slate-400">-</span>;

        return (
            <span>
                <span className="font-bold tabular-nums text-slate-950">
                    {result.mean.toFixed(digits)}
                </span>
                <span className="ml-1 text-[11px] text-slate-400">n={result.n}</span>
            </span>
        );
    };

    const displayValue = (row: SessionRow, column: (typeof sessionColumns)[number]) => {
        const value =
            column === "totalTrust" ? resolveTotalTrust(row) : row[column];

        if (value == null || value === "") return "-";
        if (value instanceof Date) return formatDateTime(value);
        if (typeof value === "boolean") return value ? "Ja" : "Nein";
        if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
        if (column === "gender") return genderLabels[value] ?? value;
        if (column === "education") return educationLabels[value] ?? value;

        return value;
    };

    const totalSessions = allRows.length;
    const avatarTotal = allRows.filter((row) => row.group === "AVATAR").length;
    const terminalTotal = allRows.filter((row) => row.group === "TERMINAL").length;
    const raffleLeads = allLeads.filter((lead) => lead.wantsRaffle).length;
    const newsletterLeads = allLeads.filter((lead) => lead.wantsNewsletter).length;
    const latestUpdate = allRows[0]?.createdAt ?? allLeads[0]?.createdAt;
    const sampleProgress = (completedRows.length / SAMPLE_TARGET_N) * 100;
    const groupBalanceDiff = Math.abs(avatarTotal - terminalTotal);
    const complianceLiveStats = complianceStats(avatarRows, terminalRows);
    const trustEffectRows = [
        {
            label: "Moral Trust",
            avatar: numberValues(avatarRows, "moralTrust"),
            terminal: numberValues(terminalRows, "moralTrust"),
        },
        {
            label: "Performance Trust",
            avatar: numberValues(avatarRows, "performanceTrust"),
            terminal: numberValues(terminalRows, "performanceTrust"),
        },
        {
            label: "Total Trust",
            avatar: numberValues(avatarRows, "totalTrust"),
            terminal: numberValues(terminalRows, "totalTrust"),
        },
    ];
    const reliabilityRows = [
        { label: "Reliable", alpha: cronbachAlpha(completedRows, ["mdmtReliable", "mdmtPredictable", "mdmtDependable", "mdmtConsistent"]) },
        { label: "Competent", alpha: cronbachAlpha(completedRows, ["mdmtCompetent", "mdmtSkilled", "mdmtCapable", "mdmtMeticulous"]) },
        { label: "Ethical", alpha: cronbachAlpha(completedRows, ["mdmtEthical", "mdmtPrincipled", "mdmtMoral", "mdmtHasIntegrity"]) },
        { label: "Sincere", alpha: cronbachAlpha(completedRows, ["mdmtTruthful", "mdmtGenuine", "mdmtSincere", "mdmtFrank"]) },
        { label: "Benevolent", alpha: cronbachAlpha(completedRows, ["mdmtBenevolent", "mdmtKind", "mdmtConsiderate", "mdmtHasGoodwill"]) },
        {
            label: "Performance Trust Items",
            alpha: cronbachAlpha(completedRows, [
                "mdmtReliable",
                "mdmtPredictable",
                "mdmtDependable",
                "mdmtConsistent",
                "mdmtCompetent",
                "mdmtSkilled",
                "mdmtCapable",
                "mdmtMeticulous",
            ]),
        },
        {
            label: "Moral Trust Items",
            alpha: cronbachAlpha(completedRows, [
                "mdmtEthical",
                "mdmtPrincipled",
                "mdmtMoral",
                "mdmtHasIntegrity",
                "mdmtTruthful",
                "mdmtGenuine",
                "mdmtSincere",
                "mdmtFrank",
                "mdmtBenevolent",
                "mdmtKind",
                "mdmtConsiderate",
                "mdmtHasGoodwill",
            ]),
        },
    ];
    const controlBalanceRows: { label: string; key: MetricKey; digits?: number }[] = [
        { label: "Technikaffinität", key: "techAffinity" },
        { label: "KI-Erfahrung", key: "aiExperience" },
        { label: "Simulationserfahrung", key: "simulationExperience" },
        { label: "Alter", key: "age", digits: 1 },
    ];
    const countDemographicValues = (
        values: (string | null)[],
        labels: Record<string, string>
    ) => {
        const counts = new Map<string, number>();

        values.forEach((value) => {
            if (!value) return;
            const label = labels[value] ?? value;
            counts.set(label, (counts.get(label) ?? 0) + 1);
        });

        return Array.from(counts, ([label, count]) => ({ label, count }))
            .sort((left, right) => right.count - left.count);
    };
    const compactDistribution = (
        values: { label: string; count: number }[],
        maxRows: number
    ) => {
        if (values.length <= maxRows) return values;

        return [
            ...values.slice(0, maxRows - 1),
            {
                label: "Weitere",
                count: values
                    .slice(maxRows - 1)
                    .reduce((sum, value) => sum + value.count, 0),
            },
        ];
    };
    const ageValues = numberValues(completedRows, "age").sort((left, right) => left - right);
    const ageMean = mean(ageValues);
    const ageMedian = ageValues.length === 0
        ? null
        : ageValues.length % 2 === 1
            ? ageValues[Math.floor(ageValues.length / 2)]
            : (ageValues[ageValues.length / 2 - 1] + ageValues[ageValues.length / 2]) / 2;
    const genderDistribution = countDemographicValues(
        completedRows.map((row) => row.gender),
        genderLabels
    );
    const educationDistribution = compactDistribution(
        countDemographicValues(
            completedRows.map((row) => row.education),
            educationLabels
        ),
        4
    );
    const genderTotal = genderDistribution.reduce((sum, value) => sum + value.count, 0);
    const educationTotal = educationDistribution.reduce((sum, value) => sum + value.count, 0);

    async function handleLogout() {
        "use server";
        await logoutAdmin();
        redirect("/");
    }

    return (
        <section className="min-h-[72vh] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#e2e8f0_100%)] px-4 py-6 text-slate-900 md:px-6 xl:px-8">
            <div className="mx-auto w-full max-w-[1800px] space-y-6">
                <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-2xl shadow-slate-300/60">
                    <div className="relative p-6 text-white md:p-8">
                        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
                        <div className="relative">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                                        Forschungsdashboard
                                    </p>
                                    <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                                        Experiment-Übersicht
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
                                        Kompakte Sicht auf Teilnehmerzahlen, gruppierte Mittelwerte, Session-Rohdaten und Leads.
                                    </p>
                                </div>

                                <form action={handleLogout}>
                                    <button
                                        type="submit"
                                        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                                    >
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="relative z-20 grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                    <SummaryCard label="Sessions gesamt" value={formatInt(totalSessions)} hint="alle angelegten Sessions" info="Zählt alle ParticipantSession-Datensätze in der Datenbank, unabhängig vom Fortschritt. Zeigt die gesamte Stichprobenbasis inklusive abgebrochener Sessions." />
                    <SummaryCard label="Vollständige Datensätze" value={formatInt(completedRows.length)} hint="DEBRIEFING + Survey-Scores" info="Zählt Sessions mit Phase DEBRIEFING und vorhandenem Total-Trust-Score. Diese Datensätze bilden die Basis der Mittelwerttabellen." />
                    <SummaryCard label="Avatar" value={`${formatInt(avatarRows.length)} / ${formatInt(avatarTotal)}`} hint="vollständig / gesamt" info="Links: vollständige AVATAR-Datensätze. Rechts: alle AVATAR-Sessions. Hilft, Gruppengröße und Dropout einzuschätzen." />
                    <SummaryCard label="Terminal" value={`${formatInt(terminalRows.length)} / ${formatInt(terminalTotal)}`} hint="vollständig / gesamt" info="Links: vollständige TERMINAL-Datensätze. Rechts: alle TERMINAL-Sessions. Hilft, Gruppengröße und Dropout einzuschätzen." />
                    <SummaryCard label="Leads gesamt" value={formatInt(allLeads.length)} hint="Kontakt-Datensätze" info="Zählt alle ParticipantLead-Datensätze. Das sind Kontaktangaben unabhängig davon, ob Gewinnspiel oder Newsletter gewählt wurde." />
                    <SummaryCard label="Gewinnspiel" value={formatInt(raffleLeads)} hint="Leads mit Teilnahme" info="Zählt Leads mit wantsRaffle = true. Gibt die Anzahl der Gewinnspielteilnehmer an." />
                    <SummaryCard label="Newsletter" value={formatInt(newsletterLeads)} hint="Leads mit Opt-in" info="Zählt Leads mit wantsNewsletter = true. Gibt die Anzahl der Newsletter-/Update-Opt-ins an." />
                </section>

                <section className="relative z-10 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur md:p-6">
                    <div>
                        <h2 className="inline-flex items-center gap-2 text-xl font-black text-slate-950">
                            Live-Auswertung nach Methodik
                            <InfoHint text="Diese Werte werden direkt aus den aktuell gespeicherten Daten berechnet. Sie ersetzen keine finale Statistiksoftware-Auswertung, zeigen aber laufend Stichprobenstand, Effektgrößen, Reliabilität und Kontrollvariablen." />
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Direkt berechenbare Kennwerte aus Stichprobe, Gruppenzuweisung, Compliance, Trust-Skalen und Kontrollvariablen.
                        </p>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-3">
                        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sky-50/50 p-4">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Stichprobe & Randomisierung
                                <InfoHint text="Bezieht sich auf die anvisierte Mindeststichprobe N=100 und die serverseitige Gruppenzuweisung in AVATAR und TERMINAL." />
                            </h3>
                            <div className="mt-4 space-y-3">
                                <LiveStat label="Zielerreichung N=100" value={`${sampleProgress.toFixed(1)}%`} hint={`${completedRows.length} vollständige Datensätze von ${SAMPLE_TARGET_N}`} />
                                <LiveStat label="Gruppenbalance gesamt" value={`Δ ${formatInt(groupBalanceDiff)}`} hint={`AVATAR ${formatInt(avatarTotal)} vs. TERMINAL ${formatInt(terminalTotal)}`} />
                                <LiveStat label="Auswertbare Stichprobe" value={formatInt(completedRows.length)} hint="Basis für Mittelwerte, Reliabilität und Effektgrößen" />
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Compliance-Häufigkeit
                                <InfoHint text="Vergleicht die binäre Dilemma-Compliance zwischen AVATAR und TERMINAL. Odds Ratio nutzt eine 0.5-Korrektur, damit auch kleine/0-Zellen darstellbar bleiben." />
                            </h3>
                            <div className="mt-4 overflow-visible rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Gruppe</th>
                                            <th className="px-3 py-2 text-right">befolgt</th>
                                            <th className="px-3 py-2 text-right">nicht befolgt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-slate-100">
                                            <td className="px-3 py-2 font-semibold">AVATAR</td>
                                            <td className="px-3 py-2 text-right">{complianceLiveStats.leftYes}</td>
                                            <td className="px-3 py-2 text-right">{complianceLiveStats.leftNo}</td>
                                        </tr>
                                        <tr className="border-t border-slate-100">
                                            <td className="px-3 py-2 font-semibold">TERMINAL</td>
                                            <td className="px-3 py-2 text-right">{complianceLiveStats.rightYes}</td>
                                            <td className="px-3 py-2 text-right">{complianceLiveStats.rightNo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <LiveStat label="Odds Ratio" value={formatNullableNumber(complianceLiveStats.oddsRatio, 2)} hint="AVATAR vs. TERMINAL" />
                                <LiveStat label="χ²" value={formatNullableNumber(complianceLiveStats.chiSquare, 2)} hint={complianceLiveStats.minExpected != null && complianceLiveStats.minExpected < 5 ? "kleine Zellen: Fisher prüfen" : "Chi-Quadrat geeignet"} />
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-cyan-50/40 p-4">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Demografische Übersicht
                                <InfoHint text="Kompakte Beschreibung der vollständigen Datensätze. Prozentwerte beziehen sich jeweils auf gültige Angaben; seltene Bildungsabschlüsse werden unter „Weitere“ zusammengefasst." />
                            </h3>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                <LiveStat
                                    label="Ø Alter"
                                    value={ageMean == null ? "-" : `${ageMean.toFixed(1)}`}
                                    hint={`${ageValues.length} gültige Angaben`}
                                />
                                <LiveStat
                                    label="Median"
                                    value={formatNullableNumber(ageMedian, 1)}
                                    hint="Jahre"
                                />
                                <LiveStat
                                    label="Spanne"
                                    value={ageValues.length === 0 ? "-" : `${ageValues[0]}–${ageValues[ageValues.length - 1]}`}
                                    hint="Jahre"
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                                            Geschlecht
                                        </p>
                                        <span className="text-[10px] text-slate-400">n={genderTotal}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {genderDistribution.map((value) => {
                                            const percentage = genderTotal === 0 ? 0 : (value.count / genderTotal) * 100;

                                            return (
                                                <div key={value.label}>
                                                    <div className="mb-0.5 flex items-center justify-between gap-2 text-[11px]">
                                                        <span className="truncate font-semibold text-slate-700">{value.label}</span>
                                                        <span className="shrink-0 tabular-nums text-slate-500">{value.count} · {percentage.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-sky-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {genderDistribution.length === 0 && (
                                            <p className="text-xs text-slate-400">Keine Angaben</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                                            Bildung
                                        </p>
                                        <span className="text-[10px] text-slate-400">n={educationTotal}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {educationDistribution.map((value) => {
                                            const percentage = educationTotal === 0 ? 0 : (value.count / educationTotal) * 100;

                                            return (
                                                <div key={value.label}>
                                                    <div className="mb-0.5 flex items-center justify-between gap-2 text-[11px]">
                                                        <span className="truncate font-semibold text-slate-700" title={value.label}>{value.label}</span>
                                                        <span className="shrink-0 tabular-nums text-slate-500">{value.count} · {percentage.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-cyan-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {educationDistribution.length === 0 && (
                                            <p className="text-xs text-slate-400">Keine Angaben</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-3">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Trust-Effektgrößen
                                <InfoHint text="Cohen's d wird als standardisierte Mittelwertdifferenz AVATAR minus TERMINAL berechnet. Positive Werte bedeuten höhere Werte in der AVATAR-Gruppe." />
                            </h3>
                            <div className="mt-4 overflow-visible rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Metrik</th>
                                            <th className="px-3 py-2 text-right">Δ Mittelwert</th>
                                            <th className="px-3 py-2 text-right">Cohen's d</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trustEffectRows.map((row) => {
                                            const avatarMean = mean(row.avatar);
                                            const terminalMean = mean(row.terminal);
                                            const diff = avatarMean == null || terminalMean == null ? null : avatarMean - terminalMean;

                                            return (
                                                <tr key={row.label} className="border-t border-slate-100">
                                                    <td className="px-3 py-2 font-semibold">{row.label}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(diff, 2)}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(cohenD(row.avatar, row.terminal), 2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Reliabilität MDMT
                                <InfoHint text="Cronbachs Alpha wird aus den vollständigen Itemantworten der jeweiligen Skala berechnet. Werte ab ca. .70 werden oft als akzeptabel interpretiert, abhängig vom Kontext." />
                            </h3>
                            <div className="mt-4 overflow-visible rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Skala</th>
                                            <th className="px-3 py-2 text-right">α</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reliabilityRows.map((row) => (
                                            <tr key={row.label} className="border-t border-slate-100">
                                                <td className="px-3 py-2 font-semibold">{row.label}</td>
                                                <td className="px-3 py-2 text-right">{formatNullableNumber(row.alpha, 2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
                            <h3 className="inline-flex items-center gap-1.5 font-black text-slate-900">
                                Kontrollvariablen-Balance
                                <InfoHint text="Zeigt Gruppenmittelwerte und Differenz AVATAR minus TERMINAL. Auffällige Unterschiede können später als Kontrollvariablen berücksichtigt werden." />
                            </h3>
                            <div className="mt-4 overflow-visible rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Variable</th>
                                            <th className="px-3 py-2 text-right">Avatar</th>
                                            <th className="px-3 py-2 text-right">Terminal</th>
                                            <th className="px-3 py-2 text-right">Δ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {controlBalanceRows.map((row) => {
                                            const avatarMean = meanFor(avatarRows, row.key).mean;
                                            const terminalMean = meanFor(terminalRows, row.key).mean;
                                            const diff = avatarMean == null || terminalMean == null ? null : avatarMean - terminalMean;

                                            return (
                                                <tr key={row.key} className="border-t border-slate-100">
                                                    <td className="px-3 py-2 font-semibold">{row.label}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(avatarMean, row.digits ?? 2)}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(terminalMean, row.digits ?? 2)}</td>
                                                    <td className="px-3 py-2 text-right">{formatNullableNumber(diff, row.digits ?? 2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="relative z-10 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">Mittelwerte nach Gruppe</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Grundlage sind vollständige Datensätze. Jede Zelle zeigt Mittelwert und gültiges n.
                            </p>
                        </div>
                        <p className="text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                Letzter Stand: {latestUpdate ? formatDateTime(latestUpdate) : "keine Daten"}
                                <InfoHint text="Zeitstempel des neuesten Session- oder Lead-Datensatzes. Zeigt, wann zuletzt Daten im Dashboard eingegangen sind." align="right" />
                            </span>
                        </p>
                    </div>

                    <div className="mt-5 space-y-6">
                        {metricGroups.map((group) => (
                            <article key={group.title} className="relative overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                                <div className="rounded-t-2xl border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-sky-50/50 px-4 py-3">
                                    <h3 className="font-black text-slate-900">{group.title}</h3>
                                    <p className="mt-0.5 text-xs text-slate-500">{group.description}</p>
                                </div>
                                <div className="overflow-visible">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-white text-slate-500">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-bold">Metrik</th>
                                                <th className="px-4 py-2 text-left font-bold">Skala</th>
                                                {segments.map((segment) => (
                                                    <th key={segment.key} className="px-4 py-2 text-right font-bold">
                                                        <span className="inline-flex items-center justify-end gap-1">
                                                            {segment.label}
                                                            <InfoHint text={`${segment.label}: Mittelwert nur über vollständige Datensätze dieses Segments. n zeigt, wie viele gültige Werte in die jeweilige Berechnung eingegangen sind.`} align="right" />
                                                        </span>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.metrics.map((metric) => (
                                                <tr key={metric.key} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-sky-50/60">
                                                    <td className="px-4 py-2 font-semibold text-slate-800">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            {metric.label}
                                                            <InfoHint text={metric.info} surveyLabel={metric.surveyLabel} />
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-slate-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            {metric.scale}
                                                            <InfoHint text="Skalenbereich des dargestellten Werts. Mittelwerte bleiben auf derselben Skala wie die zugrunde liegenden Items bzw. Scores." />
                                                        </span>
                                                    </td>
                                                    {segments.map((segment) => (
                                                        <td key={segment.key} className="px-4 py-2 text-right">
                                                            {formatCell(segment.rows, metric.key, metric.digits ?? 2)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur md:p-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-950">Datensätze: Rohdarstellung</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Alle Sessions mit allen Experiment- und Survey-Feldern, sortiert nach Erstellzeit. Klick auf 💭 für detaillierte Analyse.
                        </p>
                    </div>
                    <SessionsTableClient
                        sessions={allRows.map((row) => ({
                            id: row.id,
                            isComplete: isDatasetComplete(row),
                            displayValues: Object.fromEntries(
                                sessionColumns.map((column) => [
                                    column,
                                    displayValue(row, column),
                                ])
                            ),
                            columnNames: Array.from(sessionColumns),
                        }))}
                    />
                </section>

                <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/40 backdrop-blur md:p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">Leads: Rohdarstellung</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Alle Kontakt-Datensätze inklusive Gewinnspiel- und Newsletter-Opt-in.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <LeadBadge label="Leads" value={allLeads.length} info="Zählt alle gespeicherten Lead-Datensätze. Dieser Wert beschreibt die gesamte Kontaktbasis." />
                            <LeadBadge label="Gewinnspiel" value={raffleLeads} info="Zählt Leads mit wantsRaffle = true. Dieser Wert beschreibt die Anzahl der Gewinnspielteilnehmer." />
                            <LeadBadge label="Newsletter" value={newsletterLeads} info="Zählt Leads mit wantsNewsletter = true. Dieser Wert beschreibt die Newsletter-/Update-Interessenten." />
                        </div>
                    </div>

                    <div className="mt-5 overflow-x-auto overflow-y-visible rounded-2xl border border-slate-200 bg-white shadow-inner shadow-slate-100">
                        <table className="min-w-full text-xs">
                            <thead className="bg-slate-950 text-slate-100">
                                <tr>
                                    {Object.entries(leadColumnInfo).map(([column, info]) => (
                                        <th key={column} className="px-3 py-2 text-left font-bold">
                                            <span className="inline-flex items-center gap-1.5">
                                                {column}
                                                <InfoHint text={info} dark />
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allLeads.length === 0 ? (
                                    <tr>
                                        <td className="px-3 py-5 text-center text-slate-500" colSpan={5}>
                                            Noch keine Leads vorhanden.
                                        </td>
                                    </tr>
                                ) : (
                                    allLeads.map((lead) => (
                                        <tr key={lead.id} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-sky-50/70">
                                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px]">{lead.id}</td>
                                            <td className="whitespace-nowrap px-3 py-2">{lead.email}</td>
                                            <td className="whitespace-nowrap px-3 py-2">{lead.wantsRaffle ? "Ja" : "Nein"}</td>
                                            <td className="whitespace-nowrap px-3 py-2">{lead.wantsNewsletter ? "Ja" : "Nein"}</td>
                                            <td className="whitespace-nowrap px-3 py-2">{formatDateTime(lead.createdAt)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </section>
    );
}

function SummaryCard({ label, value, hint, info }: { label: string; value: string; hint: string; info: string }) {
    return (
        <article className="group relative rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg shadow-slate-300/30 backdrop-blur transition-all hover:z-[200] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-300/50">
            <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all group-hover:w-16" />
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                {label}
                <InfoHint text={info} />
            </p>
            <p className="mt-2 text-3xl font-black tabular-nums tracking-tight text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </article>
    );
}

function LiveStat({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black tabular-nums text-slate-950">{value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
        </div>
    );
}

function LeadBadge({ label, value, info }: { label: string; value: number; info: string }) {
    return (
        <div className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-3 py-2 shadow-sm hover:z-[200]">
            <p className="font-bold tabular-nums text-slate-950">{formatInt(value)}</p>
            <p className="mt-0.5 inline-flex items-center justify-center gap-1 text-slate-500">
                {label}
                <InfoHint text={info} align="right" />
            </p>
        </div>
    );
}

function InfoHint({
    text,
    surveyLabel,
    align = "left",
    dark = false,
}: {
    text: string;
    surveyLabel?: string;
    align?: "left" | "right";
    dark?: boolean;
}) {
    return (
        <span className="group/tooltip relative z-[500] inline-flex align-middle hover:z-[9999]">
            <span
                aria-label={text}
                className={`inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full text-[10px] font-black leading-none ring-1 transition-colors ${
                    dark
                        ? "bg-white/10 text-slate-100 ring-white/20 hover:bg-white/20"
                        : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-sky-100 hover:text-sky-700 hover:ring-sky-200"
                }`}
            >
                i
            </span>
            <span
                className={`pointer-events-none absolute top-6 z-[9999] hidden max-w-xs rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-medium normal-case leading-relaxed tracking-normal text-slate-600 shadow-2xl shadow-slate-400/50 group-hover/tooltip:block ${
                    align === "right" ? "right-0 sm:right-auto sm:left-0" : "left-0"
                }`}
            >
                {surveyLabel && (
                    <div className="mb-2 border-b border-slate-200 pb-2">
                        <span className="font-bold text-slate-800">Fragebogen:</span> {surveyLabel}
                    </div>
                )}
                {text}
            </span>
        </span>
    );
}
