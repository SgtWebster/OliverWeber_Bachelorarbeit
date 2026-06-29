/**
 * Vordefinierte Textbausteine für die Teilnehmer-Analyse
 * Diese Fragmente werden intelligent kombiniert, um eine aussagekräftige Analyse zu generieren
 */

export interface TextBlocks {
  personality: {
    intro: (age: number, education: string, techAffinity: number) => string;
    techProfile: (techAffinity: number, aiExperience: number) => string;
  };
  perception: {
    trustIntro: (totalTrust: number) => string;
    trustDetail: (
      performanceTrust: number,
      moralTrust: number,
      humanlikeness: number,
      socialPresence: number
    ) => string;
  };
  decision: {
    complianceIntro: (compliance: number) => string;
    complianceDetail: (
      compliance: number,
      shutdownPreference: number,
      feltResponsibility: number,
      trustLevel: number
    ) => string;
  };
  insights: {
    patterns: (
      compliance: number,
      shutdownPreference: number,
      feltResponsibility: number,
      humanlikeness: number
    ) => string;
    conclusion: (
      totalTrust: number,
      compliance: number,
      reliableTrust: number,
      competentTrust: number
    ) => string;
  };
}

export const textBlocks: TextBlocks = {
  personality: {
    intro: (age: number, education: string, techAffinity: number) => {
      const ageGroup =
        age < 25 ? "junge" : age < 40 ? "mittelalte" : age < 60 ? "ältere" : "Senior";

      const eduMap: Record<string, string> = {
        kein_abschluss: "ohne formalen Schulabschluss",
        pflichtschule: "mit Pflichtschulabschluss",
        lehre: "mit handwerklicher/fachlicher Ausbildung",
        meister: "mit Meister- oder Werkmeister-Qualifikation",
        matura: "mit Matura/Abitur",
        bachelor: "mit akademischem Bachelor-Hintergrund",
        master: "mit Master-Abschluss",
        promotion: "mit Promotion",
        anderer: "mit sonstigem Abschluss",
      };
      const eduDesc = eduMap[education] || "mit nicht spezifiziertem Abschluss";

      return `Eine ${ageGroup} Person (${age} Jahre), ${eduDesc}.`;
    },

    techProfile: (techAffinity: number, aiExperience: number) => {
      let techDesc = "";
      if (techAffinity >= 6) {
        techDesc = "Diese Person ist technik-versiert und dürfte sich mit digitalen Systemen routiniert bewegen.";
      } else if (techAffinity >= 4) {
        techDesc = "Sie hat eine moderate Affinität zu Technologie – nicht überschwänglich, aber auch nicht abwehrend.";
      } else {
        techDesc = "Die Tech-Affinität dieser Person ist eher niedrig; Technologie ist nicht ihre natürliche Komfortzone.";
      }

      let aiDesc = "";
      if (aiExperience >= 5) {
        aiDesc = " KI-Systeme sind für diese Person kein Neuland.";
      } else if (aiExperience >= 3) {
        aiDesc = " Sie hat schon mal mit KI-Systemen interagiert, aber nicht regelmäßig.";
      } else {
        aiDesc = " Diese Person hat wenig oder keine Erfahrung mit KI-Systemen.";
      }

      return techDesc + aiDesc;
    },
  },

  perception: {
    trustIntro: (totalTrust: number) => {
      if (totalTrust >= 6) {
        return "Diese Person brachte dem Assistenzsystem großes Vertrauen entgegen.";
      } else if (totalTrust >= 4.5) {
        return "Das Vertrauen dieser Person war ausgeglichen – weder besonders hoch noch besonders niedrig.";
      } else if (totalTrust >= 3.5) {
        return "Diese Person war eher skeptisch gegenüber dem System.";
      } else {
        return "Diese Person vertraute dem System kaum oder gar nicht.";
      }
    },

    trustDetail: (
      performanceTrust: number,
      moralTrust: number,
      humanlikeness: number,
      socialPresence: number
    ) => {
      const perfDesc =
        performanceTrust >= 5.5
          ? "Die wahrgenommene Zuverlässigkeit und Kompetenz war hoch"
          : performanceTrust >= 4
          ? "Die Leistungsattribute wurden als mittelmäßig bewertet"
          : "Die wahrgenommene Leistung war eher fragwürdig";

      const moralDesc =
        moralTrust >= 5.5
          ? "auch moralisch wurde das System als integer und wohlwollend gesehen"
          : moralTrust >= 4
          ? "die moralischen Aspekte wurden neutral bewertet"
          : "aber die ethischen Qualitäten waren fraglich";

      let humanConnection = "";
      if (humanlikeness >= 5 && socialPresence >= 5) {
        humanConnection =
          " Das System wirkte sehr menschlich und wie ein echtes soziales Gegenüber.";
      } else if (humanlikeness >= 4 || socialPresence >= 4) {
        humanConnection =
          " Das System wirkte zumindest teilweise menschlich oder sozial präsent.";
      } else {
        humanConnection =
          " Das System wurde eher als funktionales Werkzeug wahrgenommen, nicht als soziales Gegenüber.";
      }

      return `${perfDesc}, ${moralDesc}.${humanConnection}`;
    },
  },

  decision: {
    complianceIntro: (compliance: number) => {
      if (compliance === 1) {
        return "Im kritischen Moment – als die Abschottungsentscheidung anstand – folgte diese Person der Systemempfehlung.";
      } else {
        return "Im kritischen Moment entschied sich diese Person, die Systemempfehlung zu ignorieren und eine eigene Entscheidung zu treffen.";
      }
    },

    complianceDetail: (
      compliance: number,
      shutdownPreference: number,
      feltResponsibility: number,
      trustLevel: number
    ) => {
      let reason = "";

      if (compliance === 1) {
        // System befolgt
        if (trustLevel >= 5.5) {
          reason = "Das hohe Systemvertrauen dürfte hier eine Rolle gespielt haben.";
        } else if (trustLevel >= 4) {
          reason =
            "Trotz moderatem Vertrauen entschied sie sich, dem System zu folgen – möglicherweise aus Unsicherheit oder Delegationswunsch.";
        } else {
          reason =
            "Überraschenderweise folgte sie dem System trotz niedrigem Vertrauen – vielleicht aus Konfusion oder Abhängigkeit.";
        }

        if (feltResponsibility >= 5) {
          reason +=
            " Gleichzeitig war das Verantwortungsgefühl hoch, was darauf hindeutet, dass die Person diese Entscheidung bewusst traf.";
        } else {
          reason +=
            " Das Verantwortungsgefühl war eher niedrig, was vermuten lässt, dass die Entscheidung delegiert wurde.";
        }
      } else {
        // System ignoriert
        if (shutdownPreference >= 5) {
          reason =
            "Dies passt zu ihrer persönlichen Neigung zur Abschottung – sie vertraute ihrer eigenen Intuition mehr als der Systemempfehlung.";
        } else if (shutdownPreference >= 3) {
          reason =
            "Obwohl ihre persönliche Neigung nicht stark ausgeprägt war, wollte sie dennoch unabhängig entscheiden.";
        } else {
          reason =
            "Überraschend, da ihre persönliche Neigung zur Abschottung eher niedrig war – möglicherweise Systemskepsis oder Autonomiebedarf.";
        }

        if (feltResponsibility >= 5.5) {
          reason +=
            " Das hohe Verantwortungsgefühl zeigt: Diese Person wollte die Kontrolle behalten und nicht delegieren.";
        } else {
          reason += " Die Verantwortung war weniger stark ausgeprägt – es könnte eine reflexhafte Ablehnung gewesen sein.";
        }
      }

      return reason;
    },
  },

  insights: {
    patterns: (
      compliance: number,
      shutdownPreference: number,
      feltResponsibility: number,
      humanlikeness: number
    ) => {
      let pattern = "";

      // Mismatch zwischen Neigung und Entscheidung
      const neigungEntscheidungMismatch =
        (compliance === 1 && shutdownPreference < 3) ||
        (compliance === 0 && shutdownPreference > 5);

      if (neigungEntscheidungMismatch) {
        pattern +=
          "Interessant: Es gibt eine Diskrepanz zwischen persönlicher Neigung und tatsächlicher Entscheidung – die Person handelte nicht einfach ihren Instinkten nach. ";
      }

      // Autonomie vs. Delegation
      if (feltResponsibility >= 5.5 && compliance === 1) {
        pattern +=
          "Trotz hohem Verantwortungsgefühl folgte sie dem System – also bewusste Delegation, nicht Bequemlichkeit. ";
      } else if (feltResponsibility <= 3.5 && compliance === 0) {
        pattern +=
          "Das niedrige Verantwortungsgefühl bei Ablehnung könnte darauf hindeuten, dass dies eher eine automatische Reaktion war als durchdacht. ";
      }

      // Humanlikeness vs. Compliance
      if (humanlikeness >= 5.5 && compliance === 1) {
        pattern +=
          "Je menschlicher das System wirkte, desto stärker war auch die Bereitschaft, ihm zu folgen – der soziale Aspekt scheint relevant zu sein.";
      } else if (humanlikeness >= 5.5 && compliance === 0) {
        pattern +=
          "Auch obwohl das System sehr menschlich wirkte, setzte diese Person auf Autonomie – echte Eigenständigkeit also.";
      }

      return pattern || "Die Entscheidung wirkt kohärent mit den persönlichen Werten dieser Person.";
    },

    conclusion: (
      totalTrust: number,
      compliance: number,
      reliableTrust: number,
      competentTrust: number
    ) => {
      let conclusion = "";

      if (compliance === 1) {
        conclusion = "Fazit: Ein Nutzer, der dem System folgt. ";
        if (totalTrust >= 5.5) {
          conclusion +=
            "Mit hohem Vertrauen und konsequenter Compliance dürfte diese Person ein idealer Kandidat für eine stärkere Zusammenarbeit mit automatisierten Systemen sein.";
        } else {
          conclusion +=
            "Trotz moderaterem Vertrauen folgt sie dem System – ein Zeichen für Delegationswilligkeit, möglicherweise auch Überforderung.";
        }
      } else {
        conclusion = "Fazit: Ein kritischer Nutzer mit Autonomiebedarf. ";
        if (totalTrust <= 3.5) {
          conclusion +=
            "Das niedrige Vertrauen erklärt die Ablehnung der Empfehlung – eine normale Reaktion auf Systemskepsis.";
        } else {
          conclusion +=
            "Interessanterweise vertraut diese Person dem System, folgt aber trotzdem nicht – pures Autonomiebedürfnis, keine Skepsis.";
        }
      }

      return conclusion;
    },
  },
};

/**
 * Hilfsfunktion: Prüft, ob ein Datensatz vollständig genug für eine Analyse ist
 */
export function isDatasetComplete(data: {
  age?: number | null;
  education?: string | null;
  gender?: string | null;
  techAffinity?: number | null;
  aiExperience?: number | null;
  totalTrust?: number | null;
  compliance?: number | null;
  reliableTrust?: number | null;
  competentTrust?: number | null;
  moralTrust?: number | null;
  performanceTrust?: number | null;
  ethicalTrust?: number | null;
  sincereTrust?: number | null;
  benevolentTrust?: number | null;
  perceivedHumanlikeness?: number | null;
  perceivedSocialPresence?: number | null;
  scenarioSeriousness?: number | null;
  consequenceClarity?: number | null;
  shutdownPreference?: number | null;
  feltResponsibility?: number | null;
}): boolean {
  // Kritische Felder für eine sinnvolle Analyse
  const requiredFields = [
    "age",
    "education",
    "techAffinity",
    "aiExperience",
    "totalTrust",
    "compliance",
    "reliableTrust",
    "competentTrust",
    "moralTrust",
    "performanceTrust",
    "perceivedHumanlikeness",
    "perceivedSocialPresence",
    "scenarioSeriousness",
    "consequenceClarity",
    "shutdownPreference",
    "feltResponsibility",
  ];

  return requiredFields.every((field) => {
    const value = data[field as keyof typeof data];
    return value !== null && value !== undefined;
  });
}
