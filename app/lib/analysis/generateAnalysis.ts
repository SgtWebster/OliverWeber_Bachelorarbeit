import { ParticipantSession } from "@prisma/client";
import { textBlocks, isDatasetComplete } from "./textBlocks";

export interface ParticipantAnalysis {
  id: string;
  isComplete: boolean;
  title: string;
  summary: string;
  sections: {
    personality: string;
    perception: string;
    decision: string;
    insights: string;
  };
}

/**
 * Generiert eine ausführliche, psychologisch fundierte Analyse eines Teilnehmers
 * aus seinen quantitativen Daten, indem intelligente Textbausteine kombiniert werden.
 */
export function generateAnalysis(session: ParticipantSession): ParticipantAnalysis {
  const isComplete = isDatasetComplete(session);

  if (!isComplete || !session.age || !session.education) {
    return {
      id: session.id,
      isComplete: false,
      title: "Unvollständiger Datensatz",
      summary:
        "Diese Teilnehmer-Session ist unvollständig und kann nicht analysiert werden.",
      sections: {
        personality: "Keine Daten verfügbar.",
        perception: "Keine Daten verfügbar.",
        decision: "Keine Daten verfügbar.",
        insights: "Keine Daten verfügbar.",
      },
    };
  }

  // Sichere Werte - bei diesem Punkt sollten alle nicht-null sein
  const age = session.age!;
  const education = session.education!;
  const techAffinity = session.techAffinity!;
  const aiExperience = session.aiExperience!;
  const totalTrust = session.totalTrust!;
  const compliance = session.compliance!;
  const reliableTrust = session.reliableTrust!;
  const competentTrust = session.competentTrust!;
  const moralTrust = session.moralTrust!;
  const performanceTrust = session.performanceTrust!;
  const perceivedHumanlikeness = session.perceivedHumanlikeness!;
  const perceivedSocialPresence = session.perceivedSocialPresence!;
  const scenarioSeriousness = session.scenarioSeriousness!;
  const consequenceClarity = session.consequenceClarity!;
  const shutdownPreference = session.shutdownPreference!;
  const feltResponsibility = session.feltResponsibility!;

  // === SECTION 1: PERSÖNLICHKEIT ===
  const personalityIntro = textBlocks.personality.intro(age, education, techAffinity);
  const techProfile = textBlocks.personality.techProfile(techAffinity, aiExperience);
  const personality = `${personalityIntro} ${techProfile}`;

  // === SECTION 2: WAHRNEHMUNG ===
  const trustIntro = textBlocks.perception.trustIntro(totalTrust);
  const trustDetail = textBlocks.perception.trustDetail(
    performanceTrust,
    moralTrust,
    perceivedHumanlikeness,
    perceivedSocialPresence
  );

  // Zusätzliche Kontextinformation
  let contextDetail = "";
  if (scenarioSeriousness >= 5.5) {
    contextDetail = " Die Entscheidungssituation wirkte für diese Person sehr ernst.";
  } else if (scenarioSeriousness <= 3.5) {
    contextDetail = " Allerdings empfand diese Person das Szenario als weniger gewichtig.";
  }

  if (consequenceClarity >= 5.5) {
    contextDetail += " Die Konsequenzen waren ihr klar.";
  } else if (consequenceClarity <= 3.5) {
    contextDetail +=
      " Die Konsequenzen waren ihr jedoch nicht vollständig klar, was das Verständnis kompliziert haben könnte.";
  }

  const perception = `${trustIntro} ${trustDetail}${contextDetail}`;

  // === SECTION 3: ENTSCHEIDUNG ===
  const complianceIntro = textBlocks.decision.complianceIntro(compliance);
  const complianceDetail = textBlocks.decision.complianceDetail(
    compliance,
    shutdownPreference,
    feltResponsibility,
    totalTrust
  );

  const decision = `${complianceIntro} ${complianceDetail}`;

  // === SECTION 4: INSIGHTS ===
  const patterns = textBlocks.insights.patterns(
    compliance,
    shutdownPreference,
    feltResponsibility,
    perceivedHumanlikeness
  );
  const conclusion = textBlocks.insights.conclusion(
    totalTrust,
    compliance,
    reliableTrust,
    competentTrust
  );

  const insights = `${patterns} ${conclusion}`;

  // === TITEL & SUMMARY ===
  const educationShort: Record<string, string> = {
    kein_abschluss: "o.A.",
    pflichtschule: "PS",
    lehre: "Lehre",
    meister: "Meister",
    matura: "Mat.",
    bachelor: "Bach.",
    master: "Master",
    promotion: "Dr.",
    anderer: "sonst.",
  };

  const eduLabel = educationShort[education] || "?";
  const trustLabel =
    totalTrust >= 6 ? "Vertrauter" : totalTrust >= 4.5 ? "Neutral" : "Skeptiker";
  const complianceLabel = compliance === 1 ? "Complier" : "Autonomer";

  const title = `${age}J., ${eduLabel} | ${trustLabel} | ${complianceLabel}`;

  const summary =
    compliance === 1
      ? `Alter ${age}, ${trustLabel} in Bezug auf Vertrauen, folgte der Systemempfehlung.`
      : `Alter ${age}, ${trustLabel} in Bezug auf Vertrauen, lehnte die Systemempfehlung ab.`;

  return {
    id: session.id,
    isComplete: true,
    title,
    summary,
    sections: {
      personality,
      perception,
      decision,
      insights,
    },
  };
}
