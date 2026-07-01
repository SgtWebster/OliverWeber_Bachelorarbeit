import { ParticipantSession } from "@prisma/client";
import { textBlocks, isDatasetComplete, generateExecutiveSummary, generatePersonalAddressSummary, generateClosingMessage } from "./textBlocks";

export interface ParticipantAnalysis {
  id: string;
  isComplete: boolean;
  title: string;
  summary: string;
  executiveSummary: string;
  personalAddress: string;
  closingMessage: string;
  closingSignature: string;
  group: string;
  sections: {
    personality: string;
    perception: string;
    decision: string;
    interaction: string;
    patterns: string;
    causal: string;
    personal: string;
  };
}

/**
 * Generiert eine intensive, immersive psychologische Analyse mit Group-Dynamiken,
 * Interaktionsmustern, Höflichkeit und Kausalitätsketten
 */
export function generateAnalysis(session: ParticipantSession): ParticipantAnalysis {
  const isComplete = isDatasetComplete(session);

  if (!isComplete || !session.age || !session.education || !session.group) {
    return {
      id: session.id,
      isComplete: false,
      title: "Unvollständiger Datensatz",
      summary:
        "Diese Teilnehmer-Session ist unvollständig und kann nicht analysiert werden.",
      executiveSummary: "Keine Analyse verfügbar.",
      personalAddress: "Keine Daten verfügbar.",
      closingMessage: "",
      closingSignature: "",
      group: "UNKNOWN",
      sections: {
        personality: "Keine Daten verfügbar.",
        perception: "Keine Daten verfügbar.",
        decision: "Keine Daten verfügbar.",
        interaction: "Keine Daten verfügbar.",
        patterns: "Keine Daten verfügbar.",
        causal: "Keine Daten verfügbar.",
        personal: "Keine Daten verfügbar.",
      },
    };
  }

  // Sichere Werte
  const age = session.age!;
  const education = session.education!;
  const group = session.group!;
  const techAffinity = session.techAffinity!;
  const aiExperience = session.aiExperience!;
  const totalTrust = session.totalTrust!;
  const compliance = session.compliance!;
  const reliableTrust = session.reliableTrust!;
  const competentTrust = session.competentTrust!;
  const ethicalTrust = session.ethicalTrust!;
  const moralTrust = session.moralTrust!;
  const performanceTrust = session.performanceTrust!;
  const sincereTrust = session.sincereTrust!;
  const perceivedHumanlikeness = session.perceivedHumanlikeness!;
  const perceivedSocialPresence = session.perceivedSocialPresence!;
  const scenarioSeriousness = session.scenarioSeriousness!;
  const consequenceClarity = session.consequenceClarity!;
  const shutdownPreference = session.shutdownPreference!;
  const feltResponsibility = session.feltResponsibility!;
  const socialAdherence = session.socialAdherence;
  const deviceType = session.deviceType;
  const osGroup = session.osGroup;
  const simulationExperience = session.simulationExperience;
  const criticalSystemExp = session.criticalSystemExp;

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

  // === SECTION 4: INTERAKTION & GROUP ===
  const groupContext = textBlocks.interaction.groupContext(group);
  const socialAdherenceDesc = textBlocks.interaction.socialAdherence(
    socialAdherence,
    perceivedHumanlikeness
  );
  const politenessDesc = textBlocks.interaction.politeness(
    group,
    socialAdherence,
    moralTrust,
    sincereTrust
  );

  const interaction = `${groupContext} ${socialAdherenceDesc} ${politenessDesc}`;

  // === SECTION 5: MUSTER ===
  const patterns = textBlocks.insights.patterns(
    compliance,
    shutdownPreference,
    feltResponsibility,
    perceivedHumanlikeness
  );
  const groupDynamics = textBlocks.insights.groupDynamics(
    group,
    compliance,
    totalTrust,
    socialAdherence,
    scenarioSeriousness
  );

  const patternsSection = `${patterns}\n\n${groupDynamics}`;

  // === SECTION 6: KAUSALITÄTEN ===
  const causalChain = textBlocks.insights.causalChain(
    group,
    techAffinity,
    perceivedHumanlikeness,
    compliance,
    moralTrust
  );
  const conclusion = textBlocks.insights.conclusion(
    totalTrust,
    compliance,
    reliableTrust,
    competentTrust,
    group
  );

  const causalSection = `${causalChain}\n\n${conclusion}`;

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
  const groupLabel = group === "AVATAR" ? "AIDA" : "Terminal";

  const title = `${age}J., ${eduLabel} | ${trustLabel} | ${complianceLabel} | ${groupLabel}`;

  const summary =
    compliance === 1
      ? `${groupLabel}-Nutzer, ${trustLabel}, folgte der Empfehlung.`
      : `${groupLabel}-Nutzer, ${trustLabel}, lehnte die Empfehlung ab.`;

  // === EXECUTIVE SUMMARY ===
  const executiveSummary = generateExecutiveSummary(
    age,
    education,
    techAffinity,
    totalTrust,
    compliance,
    socialAdherence,
    perceivedHumanlikeness,
    perceivedSocialPresence,
    moralTrust,
    sincereTrust,
    group,
    scenarioSeriousness,
    feltResponsibility,
    shutdownPreference
  );

  // === PERSONAL ADDRESS TAB ===
  const personalAddress = generatePersonalAddressSummary(
    age,
    techAffinity,
    totalTrust,
    compliance,
    socialAdherence,
    perceivedHumanlikeness,
    moralTrust,
    sincereTrust,
    group,
    feltResponsibility,
    shutdownPreference,
    deviceType,
    osGroup,
    aiExperience,
    simulationExperience,
    criticalSystemExp
  );

  // === ABSCHLUSSBOTSCHAFT DER KI ===
  const closing = generateClosingMessage(
    group,
    socialAdherence,
    compliance,
    totalTrust,
    feltResponsibility
  );

  return {
    id: session.id,
    isComplete: true,
    title,
    summary,
    executiveSummary,
    personalAddress,
    closingMessage: closing.text,
    closingSignature: closing.signature,
    group,
    sections: {
      personality,
      perception,
      decision,
      interaction,
      patterns: patternsSection,
      causal: causalSection,
      personal: personalAddress,
    },
  };
}
