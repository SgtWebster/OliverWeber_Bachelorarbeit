/**
 * Erweiterte Text-Bausteine für psychologisch intensive Analyse
 * Integriert: Demografie, Vertrauen, Compliance, Interaktion, Group-Effekte, Muster
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
  interaction: {
    groupContext: (group: string) => string;
    socialAdherence: (socialAdherence: number | null, humanlikeness: number) => string;
    politeness: (
      group: string,
      socialAdherence: number | null,
      moralTrust: number,
      sincereTrust: number
    ) => string;
  };
  insights: {
    patterns: (
      compliance: number,
      shutdownPreference: number,
      feltResponsibility: number,
      humanlikeness: number
    ) => string;
    groupDynamics: (
      group: string,
      compliance: number,
      totalTrust: number,
      socialAdherence: number | null,
      scenario_seriousness: number
    ) => string;
    causalChain: (
      group: string,
      techAffinity: number,
      humanlikeness: number,
      compliance: number,
      moralTrust: number
    ) => string;
    conclusion: (
      totalTrust: number,
      compliance: number,
      reliableTrust: number,
      competentTrust: number,
      group: string
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
        if (trustLevel >= 5.5) {
          reason = "Das hohe Systemvertrauen dürfte hier eine Rolle gespielt haben.";
        } else if (trustLevel >= 4) {
          reason =
            "Trotz moderatem Vertrauen entschied sie sich, dem System zu folgen – möglicherweise aus Unsicherheit oder bewusster Delegation.";
        } else {
          reason =
            "Überraschenderweise folgte sie dem System trotz niedrigem Vertrauen – vielleicht aus Konfusion oder Abhängigkeit.";
        }

        if (feltResponsibility >= 5) {
          reason +=
            " Das hohe Verantwortungsgefühl zeigt: Diese Person traf die Entscheidung bewusst, nicht reaktiv.";
        } else {
          reason +=
            " Das niedrige Verantwortungsgefühl legt nahe, dass die Delegation eher automatisch war.";
        }
      } else {
        if (shutdownPreference >= 5) {
          reason =
            "Dies passt zu ihrer persönlichen Neigung – sie vertraute ihrer eigenen Intuition mehr als der Systemempfehlung.";
        } else if (shutdownPreference >= 3) {
          reason =
            "Obwohl ihre Neigung nicht stark war, wollte sie dennoch unabhängig entscheiden – Autonomiebedarf sticht.";
        } else {
          reason =
            "Überraschend: Ihre Neigung zur Abschottung war niedrig, aber sie lehnte ab. Das deutet auf Systemskepsis oder echte Autonomie hin.";
        }

        if (feltResponsibility >= 5.5) {
          reason +=
            " Das hohe Verantwortungsgefühl unterstreicht: Diese Person wollte Kontrolle behalten und nicht delegieren.";
        }
      }

      return reason;
    },
  },

  interaction: {
    groupContext: (group: string) => {
      if (group === "AVATAR") {
        return "Diese Person interagierte mit AIDA – dem Avatar-System mit Gesicht, Stimme und menschlicher Präsenz. Das System wirkte wie ein echter Gesprächspartner.";
      } else if (group === "TERMINAL") {
        return "Diese Person interagierte mit TERMINAL – einem rein textbasierten System ohne visuelle oder auditive menschliche Merkmale. Die Interaktion war funktional und abstrakt.";
      }
      return "Diese Person nutzte eines der beiden System-Interfaces.";
    },

    socialAdherence: (socialAdherence: number | null, humanlikeness: number) => {
      if (socialAdherence === null || socialAdherence === undefined) {
        return "Keine Daten zu sozialen Adhärenz-Mustern verfügbar.";
      }

      // socialAdherence ist eine Summe von 0-12 (mögliche adherence-Punkte aus Dialog)
      // Normalisierung: 0-2 (0-17%), 3-5 (25-42%), 6-8 (50-67%), 9-12 (75-100%)
      const adherencePercentage = (socialAdherence / 12) * 100;
      
      let adherenceDesc = "";
      let adherenceQuality = "";
      
      if (socialAdherence >= 9) {
        adherenceQuality = "SEHR HOCH";
        adherenceDesc =
          `Die soziale Adhärenz war außergewöhnlich hoch (${socialAdherence}/12 Punkte, ${adherencePercentage.toFixed(0)}%). Diese Person reagierte durchgehend auf soziale Signale, Höflichkeitsangebote und emotionale Momente. Sie war nicht nur responsiv, sondern suchte aktiv nach sozialen Interaktionsmomenten – ein Zeichen tieferen Engagements oder sozialer Orientierung.`;
      } else if (socialAdherence >= 6) {
        adherenceQuality = "HOCH";
        adherenceDesc =
          `Die soziale Adhärenz war erhöht (${socialAdherence}/12 Punkte, ${adherencePercentage.toFixed(0)}%). Diese Person war offen für soziale Momente und reaktiv auf Gesprächssignale. Sie balancierten zwischen Fokus auf die Aufgabe und sozialer Responsivität – ein gesundes Gleichgewicht.`;
      } else if (socialAdherence >= 3) {
        adherenceQuality = "MODERAT";
        adherenceDesc =
          `Die soziale Adhärenz war moderat (${socialAdherence}/12 Punkte, ${adherencePercentage.toFixed(0)}%). Diese Person zeigte selektive soziale Responsivität – sie griffen auf Höflichkeitsangebote auf oder ignorierten sie je nach Kontext. Ein Muster von Pragmatismus statt emotionaler Öffnung.`;
      } else {
        adherenceQuality = "NIEDRIG";
        adherenceDesc =
          `Die soziale Adhärenz war niedrig (${socialAdherence}/12 Punkte, ${adherencePercentage.toFixed(0)}%). Diese Person blieb überwiegend aufgabenorientiert und lehnte soziale Gesprächsmomente ab oder ignorierte sie. Dies deutet auf eine funktionale, sachliche Interaktionsstil hin – nicht kalt, sondern fokussiert.`;
      }

      // Analyse: Mismatch zwischen wahrgenommener Menschenähnlichkeit und tatsächlicher sozialer Responsivität
      if (humanlikeness >= 5 && socialAdherence >= 9) {
        adherenceDesc +=
          ` Die hohe wahrgenommene Menschenähnlichkeit des Systems traf auf eine Person mit starkem sozialen Engagement: ein psychologisches Match, das tiefe Verbindung ermöglichte.`;
      } else if (humanlikeness < 3 && socialAdherence >= 6) {
        adherenceDesc +=
          ` Interessantes Muster: Trotz niedriger wahrgenommener Menschenähnlichkeit zeigte diese Person hohe soziale Adhärenz. Dies könnte echte Höflichkeit sein, nicht oberflächlich-sozial: Sie respektierte das System als kognitives Werkzeug.`;
      } else if (humanlikeness >= 5 && socialAdherence <= 2) {
        adherenceDesc +=
          ` Paradoxon: Das System wirkte sehr menschlich, aber diese Person lehnte soziale Interaktionsmuster ab. Sie behielt Distanz trotz Menschenähnlichkeit – ein Zeichen bewusster funktionaler Interaktion.`;
      }

      return adherenceDesc;
    },

    politeness: (
      group: string,
      socialAdherence: number | null,
      moralTrust: number,
      sincereTrust: number
    ) => {
      let politenessIndicator = "";
      const sa = socialAdherence ?? 0;

      // Höflichkeit gegenüber AIDA vs Terminal (mit korrigierter 0-12 Skala)
      if (group === "AVATAR" && sa >= 6) {
        politenessIndicator =
          `Diese Person war dem Avatar gegenüber sozial responsiv und höflich (${sa}/12). Sie könnten das System als einen echten Gesprächspartner wahrgenommen haben – nicht aus Täuschung, sondern aus echtem sozialen Engagement.`;
      } else if (group === "AVATAR" && sa < 6) {
        politenessIndicator =
          `Trotz Avatar-Präsentation blieb diese Person emotional distanziert (${sa}/12 Adhärenz). Sie behandelten das System funktional statt sozial – das ist nicht unhöflich, sondern bewusste Grenzziehung.`;
      } else if (group === "TERMINAL" && sa >= 6) {
        politenessIndicator =
          `Bemerkenswert: Selbst in reiner Text-Form zeigte diese Person hohe soziale Adhärenz (${sa}/12). Sie brachten dem abstrakten Interface Respekt entgegen – ein Zeichen echter Höflichkeit oder starken Ververantwortungsgefühls.`;
      } else if (group === "TERMINAL" && sa < 6) {
        politenessIndicator =
          `Mit Terminal zeigte diese Person selektive soziale Engagement (${sa}/12). Sie blieben sachlich-transaktional – pragmatisch, nicht unhöflich.`;
      }

      // MDMT-Kontext: Wenn sehr niedrige Adhärenz über viele Turns, könnte das Fokus bedeuten oder Ungeduld
      if (sa <= 1 && moralTrust >= 5.5) {
        politenessIndicator +=
          ` Interessant: Trotz minimaler sozialer Adhärenz zeigte diese Person hohen moralischen Vertrauen in das System. Das deutet auf ethische Respekt statt Desinteresse hin.`;
      } else if (sa >= 9 && sincereTrust >= 5) {
        politenessIndicator +=
          ` Das hohe Vertrauen in Aufrichtigkeit kombiniert mit starker sozialer Adhärenz: Diese Person wollte nicht 'täuschen' und interagierte authentisch, als wäre es ein echter Dialog.`;
      }

      return politenessIndicator;
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

      // Autonomie vs. Delegation Pattern
      if (compliance === 1 && shutdownPreference < 3) {
        pattern +=
          "**Vertrauens-Deleganten:** Die Person überließ die Entscheidung dem System, obwohl ihre eigene Neigung anders war. Das deutet auf hohen Systemvertrauen. ";
      } else if (compliance === 0 && shutdownPreference > 5) {
        pattern +=
          "**Autonome Entscheider:** Die Person folgte ihrer eigenen Intuition über der Empfehlung. Starkes Eigenverantwortungsgefühl. ";
      } else if (compliance === 1 && shutdownPreference > 5) {
        pattern +=
          "**Widerspruch mit Gewicht:** Die Person hatte starke persönliche Tendenz zur Abschottung, folgte aber dem System. Das spricht für beeindruckend starken Systemeinfluss. ";
      } else if (compliance === 0 && shutdownPreference < 3) {
        pattern +=
          "**Systemskepsis vor Neigung:** Die Person lehnte das System ab, obwohl ihre persönliche Neigung schwach war. Pure Systemskepsis. ";
      }

      // Verantwortung
      if (feltResponsibility >= 5.5 && compliance === 1) {
        pattern +=
          "Trotz hohem Verantwortungsgefühl überließ sie die Entscheidung – **bewusste Delegation unter voller Awareness**. ";
      } else if (feltResponsibility <= 3.5 && compliance === 0) {
        pattern +=
          "Mit niedrigem Verantwortungsgefühl lehnte sie ab – **reflektive Ablehnung, nicht Überreaktion**. ";
      }

      // Humanlikeness Effekt
      if (humanlikeness >= 5.5 && compliance === 1) {
        pattern +=
          "Die menschlich wirkende Präsenz verstärkte die Compliance – sozialer Einfluss ist wirksam. ";
      } else if (humanlikeness >= 5.5 && compliance === 0) {
        pattern +=
          "Selbst mit hoher Menschenlichkeit blieb diese Person kritisch – echte Eigenständigkeit, kein bloßer sozialer Konformismus.";
      }

      return pattern || "Die Entscheidung wirkt kohärent mit den persönlichen Werten dieser Person.";
    },

    groupDynamics: (
      group: string,
      compliance: number,
      totalTrust: number,
      socialAdherence: number | null,
      scenario_seriousness: number
    ) => {
      let dynamics = "";

      if (group === "AVATAR") {
        if (compliance === 1 && totalTrust >= 5.5) {
          dynamics =
            "**AIDA-Effekt:** Mit Avatar erhielt das System große Compliance und hohes Vertrauen. Die visuelle/soziale Präsenz könnte entscheidend gewesen sein.";
        } else if (compliance === 0 && totalTrust >= 5.5) {
          dynamics =
            "**Avatar-Paradox:** Hohe Menschlichkeit + Vertrauen, aber keine Compliance. Diese Person trennt Vertrauen von Gehorsam – echte kritische Autonomie.";
        } else if (compliance === 1 && totalTrust < 4) {
          dynamics =
            "**Avatar-Suggestibilität:** Niedrig Vertrauen, aber Compliance – das Avatar-Format könnte soziale Beeinflussung ermöglicht haben.";
        }
      } else if (group === "TERMINAL") {
        if (compliance === 1 && totalTrust >= 5.5) {
          dynamics =
            "**Text-Rationalität:** Selbst rein textuell erreichte das System sowohl Vertrauen als auch Compliance. Die Logik der Empfehlung überzeugte.";
        } else if (compliance === 0 && totalTrust >= 5.5) {
          dynamics =
            "**Terminal-Skeptizismus:** Mit Text-Interface konnte Vertrauen nicht zu Compliance führen. Die Distanz ermöglichte kritischere Haltung.";
        } else if (compliance === 1 && socialAdherence && socialAdherence >= 40) {
          dynamics =
            "**Text-Engagement:** Hohe soziale Adhärenz bei Terminal – diese Person engagierte sich emotional mit einem abstrakten Interface.";
        }
      }

      if (scenario_seriousness >= 5.5 && compliance === 1) {
        dynamics +=
          " Die wahrgenommene Ernsthaftigkeit des Szenarios verstärkte die Compliance-Bereitschaft.";
      }

      return dynamics;
    },

    causalChain: (
      group: string,
      techAffinity: number,
      humanlikeness: number,
      compliance: number,
      moralTrust: number
    ) => {
      let chain = "";

      // Kausallogik für AVATAR
      if (group === "AVATAR") {
        chain = "**Kausallogik für AIDA-Nutzer:** ";

        if (techAffinity >= 6 && humanlikeness >= 5.5) {
          chain +=
            "Tech-Versierte + menschliches Interface → System wirkt natürlich + kompetent → ";
          if (compliance === 1) {
            chain += "Compliance (rationale Entscheidung an kompetenten Partner zu delegieren).";
          } else {
            chain += "Aber trotzdem Ablehnung – komplexeres kritisches Denken.";
          }
        } else if (techAffinity < 4 && humanlikeness >= 5.5) {
          chain +=
            "Tech-Scheu + menschliches Interface → System wirkt wie echter Mensch, nicht wie Code → ";
          if (compliance === 1) {
            chain +=
              "Höhere Chance auf Compliance (soziale Norm: dem Rat verständiger Menschen folgen).";
          } else {
            chain +=
              "Trotzdem kritisch – auch Laien können kritisch sein, wenn moralische Zweifel entstehen.";
          }
        }
      } else if (group === "TERMINAL") {
        chain = "**Kausallogik für Terminal-Nutzer:** ";

        if (techAffinity >= 6 && humanlikeness <= 3) {
          chain +=
            "Tech-Versierte + abstraktes Interface → Klare Rationalität möglich → ";
          if (compliance === 1) {
            chain +=
              "Compliance basiert rein auf logischer Überzeugung, kein sozialer Einfluss.";
          } else {
            chain +=
              "Ablehnung basiert auf rationalem Diskurs, nicht auf Emotion.";
          }
        } else if (techAffinity < 4 && humanlikeness <= 3) {
          chain +=
            "Tech-Scheu + abstraktes Interface → System wirkt entfernt/unklar → ";
          if (compliance === 1) {
            chain +=
              "Compliance trotzdem, aber vielleicht aus Überzeugung (System war gut) oder Verunsicherung.";
          } else {
            chain += "Höhere Ablehnung aus Distanz und Unsicherheit.";
          }
        }
      }

      if (moralTrust >= 5.5) {
        chain += " Die moralische Integrität verstärkt das gesamte Muster.";
      }

      return chain;
    },

    conclusion: (
      totalTrust: number,
      compliance: number,
      reliableTrust: number,
      competentTrust: number,
      group: string
    ) => {
      let conclusion = "";

      if (compliance === 1) {
        conclusion = "**Fazit: Ein System-Vertrauter.** ";

        if (totalTrust >= 5.5) {
          if (group === "AVATAR") {
            conclusion +=
              "Mit Avatar erreichte das System maximales Vertrauen und volle Compliance – ein Paradebeispiel für sozial-intelligente Systeme.";
          } else {
            conclusion +=
              "Rein textual überzeugt – diese Person vertraut auf Logik, nicht auf Präsenz.";
          }
        } else if (totalTrust >= 4) {
          conclusion +=
            "Auch bei moderatem Vertrauen folgt diese Person – hohe Delegationswilligkeit oder Unsicherheit.";
        } else {
          conclusion +=
            "Überraschend: Niedrig Vertrauen, aber Compliance. Vielleicht situativ überfordert oder vom Interface beeinflusst.";
        }
      } else {
        conclusion = "**Fazit: Ein kritischer Autonomer.** ";

        if (totalTrust >= 5.5) {
          conclusion +=
            "Hoches Vertrauen, aber keine Compliance – diese Person trennt theoretisches Vertrauen von praktischer Handlung. Echte Eigenständigkeit.";
        } else if (totalTrust >= 4) {
          conclusion +=
            "Moderates Vertrauen + Ablehnung – gesunde kritische Balance.";
        } else {
          conclusion +=
            "Niedriges Vertrauen + Ablehnung – konsistente Systemskepsis.";
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
  group?: string | null;
}): boolean {
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
    "group",
  ];

  return requiredFields.every((field) => {
    const value = data[field as keyof typeof data];
    return value !== null && value !== undefined;
  });
}

/**
 * Generiert persönliche Ansprache in "Du"-Form für Einzelteilnehmerfeedback
 * (Kann später standalone für Vorab-Analysen verwendet werden)
 */
export function generatePersonalAddressSummary(
  age: number,
  techAffinity: number,
  totalTrust: number,
  compliance: number,
  socialAdherence: number | null,
  perceivedHumanlikeness: number,
  moralTrust: number,
  sincereTrust: number,
  group: string,
  feltResponsibility: number,
  shutdownPreference: number
): string {
  // MDMT v2 Scale is 1-7, so thresholds: >5.5 = High, 3.5-5.5 = Moderate, <3.5 = Low
  let address = "";

  // === VERTRAUENS-ADRESSE ===
  if (totalTrust >= 5.5) {
    address += "Du bringst ein grundsätzliches Vertrauen in KI-Systeme mit – du glaubst, dass Technologie dir helfen kann und dass sie grundsätzlich zuverlässig ist.\n\n";
    if (sincereTrust >= 5.5 && moralTrust >= 5.5) {
      address +=
        "Besonders wichtig ist dir nicht nur, dass das System funktioniert, sondern auch, dass es ehrlich mit dir umgeht und gute Absichten hat. Du fragst dich nicht nur 'Funktioniert es?', sondern auch 'Meint es das ernst?'.\n\n";
    } else if (sincereTrust < 3.5) {
      address +=
        "Allerdings zweifelst du daran, ob das System wirklich mit dir aufrichtig kommuniziert. Es könnte dich täuschen – das ist ein kritischer Punkt für dich.\n\n";
    }
  } else if (totalTrust >= 3.5) {
    address +=
      "Du schaust Systemen mit gesundem Skeptizismus entgegen – nicht ablehnend, aber auch nicht blind vertrauensvoll. Du möchtest verstehen, wie etwas funktioniert, bevor du es akzeptierst.\n\n";
  } else {
    address +=
      "Du brauchst starke Gründe, um Systemen zu vertrauen. Deine erste Instanz ist Vorsicht – möglicherweise aus früheren negativen Erfahrungen oder einem grundsätzlichen skeptischen Charakter.\n\n";
  }

  // === ENTSCHEIDUNGS-ADRESSE ===
  if (compliance === 1) {
    address += "Als die kritische Entscheidung anstand, hast du dich entschieden, dem System zu folgen. ";
    if (feltResponsibility >= 5.5) {
      address +=
        "Das war keine unbewusste Delegation – du hast die Verantwortung bewusst übernommen und dich aktiv dafür entschieden, dieser Empfehlung zu vertrauen.\n\n";
    } else {
      address +=
        "Es war mehr eine automatische Reaktion – vielleicht weil das System überzeugend wirkte oder du dich der Situation nicht ganz sicher warst.\n\n";
    }
  } else {
    address += "Als die kritische Entscheidung anstand, hast du dich selbst entschieden – gegen die Systemempfehlung. ";
    if (feltResponsibility >= 5.5) {
      address +=
        "Das war ein bewusster Akt: Du wolltest die Kontrolle behalten und die Verantwortung selber tragen. Du vertraust dir selbst mehr als dem System.\n\n";
    } else {
      address +=
        "Du lehntest ab, aber es war nicht aus einer Position der Stärke – eher eine reaktive, intuitive Entscheidung.\n\n";
    }
  }

  // === SOZIALE INTERAKTION ===
  const sa = socialAdherence ?? 0;
  if (sa >= 9) {
    address += `Du warst bei der Interaktion sozial offen. Du hast auf Höflichkeitsangebote reagiert (${sa}/12 Punkte), hast versucht, eine echte Beziehung zum System aufzubauen. Das könnte bedeuten: Du magst Zusammenarbeit, oder du wolltest das System 'nicht verletzen', als wäre es eine echte Entität.\n\n`;
  } else if (sa >= 6) {
    address += `Du warst balanced – fokussiert auf die Aufgabe, aber offen für kleine zwischenmenschliche Momente. Du hast auf Höflichkeit reagiert (${sa}/12 Punkte), aber dich nicht darin verloren. Ein reifes Muster.\n\n`;
  } else if (sa >= 3) {
    address += `Du warst pragmatisch. Bei sozialen Angeboten hast du selektiv reagiert (${sa}/12 Punkte) – nur wenn es dir sinnvoll vorkam. Effizienz vor Emotion.\n\n`;
  } else {
    address += `Du warst aufgabenfokussiert und hast soziale Signale größtenteils ignoriert (${sa}/12 Punkte). Das ist nicht Unhöflichkeit, sondern Präzision: Du wolltest die Sache erledigen.\n\n`;
  }

  // === SYSTEM-INTERFACE-EFFEKT ===
  if (group === "AVATAR") {
    if (perceivedHumanlikeness >= 5) {
      address +=
        `Das Avatar-System wirkte auf dich menschlich. Du hast das wahrgenommen und deine Interaktion danach ausgerichtet – ein klassisches psychologisches Phänomen: Form beeinflusst Verhalten.`;
    } else {
      address +=
        `Obwohl du mit einem Avatar interagiert hast, blieb er für dich eher eine Illusion. Du hast gewusst, dass es ein System ist – und hast dich danach verhalten.`;
    }
  } else {
    address +=
      `Du interagierst mit reinem Text – keine visuellen Tricks, keine Stimme, nur Logik. Das passt zu deinem Charakter: Du magst es direkt und ehrlich.`;
  }

  return address;
}

/**
 * Generiert eine psychologische Executive Summary – eine "Porträt" der Person
 * basierend auf allen Metriken, MDMT-Logiken und Verhalten
 * MDMT v2: 1-7 Skala, Schwellen: >5.5=High, 3.5-5.5=Moderate, <3.5=Low
 */
export function generateExecutiveSummary(
  age: number,
  education: string,
  techAffinity: number,
  totalTrust: number,
  compliance: number,
  socialAdherence: number | null,
  perceivedHumanlikeness: number,
  perceivedSocialPresence: number,
  moralTrust: number,
  sincereTrust: number,
  group: string,
  scenarioSeriousness: number,
  feltResponsibility: number,
  shutdownPreference: number
): string {
  let profile = "";

  // === PSYCHOLOGISCHER ARCHETYPTIS ===
  let archetype = "";
  let archDescription = "";

  // Personality-Kontinuum
  const socialEngagement = (socialAdherence ?? 0) / 12;
  const trustLevel = totalTrust / 7;
  const autonomyDrive = shutdownPreference / 7;

  // Archetypische Muster
  if (compliance === 1 && totalTrust >= 5.5 && socialEngagement >= 0.5) {
    archetype = "Der vertrauen Delegant";
    archDescription =
      "Diese Person vertraut Systemen bewusst und delegiert bereitwillig. Sie ist psychologisch offen für Zusammenarbeit.";
  } else if (compliance === 0 && autonomyDrive >= 0.7 && moralTrust >= 5) {
    archetype = "Der ethisch autonome Denker";
    archDescription =
      "Ein starker Eigenverantwortungs-Charakter: Diese Person behält Kontrolle aus moralischen Gründen, nicht aus Misstrauen.";
  } else if (compliance === 0 && autonomyDrive >= 0.7 && moralTrust < 3) {
    archetype = "Der skeptische Kontrollhalter";
    archDescription =
      "Diese Person vertraut Systemen nicht und behält Kontrolle – ein Muster von Vorsicht oder früheren negativen Erfahrungen.";
  } else if (totalTrust >= 5.5 && socialEngagement >= 0.7 && group === "AVATAR") {
    archetype = "Der Avatar-Resonator";
    archDescription =
      "Eine Person, die auf menschlich-wahrgenommene Systeme reagiert: Sie schaffen soziale Nähe wo sie wahrgenommen wird.";
  } else if (totalTrust >= 5.5 && socialEngagement < 0.25 && group === "TERMINAL") {
    archetype = "Der funktionale Vertrauer";
    archDescription =
      "Vertraut dem System rein rational, ohne emotionale Komponenten. Ein klarer, kognitiver Entscheider.";
  } else if (totalTrust < 3.5 && compliance === 1) {
    archetype = "Der unversicherte Abgebende";
    archDescription =
      "Folgt trotz niedriger Vertrauens – möglicherweise Verunsicherung, Konventionalität, oder unbewusste Abhängigkeit.";
  } else if (sincereTrust >= 5.5 && moralTrust >= 5.5 && socialEngagement >= 0.5) {
    archetype = "Der aufrichtig Engagierte";
    archDescription =
      "Diese Person glaubt, dass das System ehrlich ist und mit guter Absicht handelt – sie interagieren mit Authentizität.";
  } else {
    archetype = "Der pragmatische Evaluator";
    archDescription =
      "Eine Person, die alle Dimensionen ausgewogen betrachtet: nicht emotional, aber auch nicht kalt.";
  }

  // === KERNMOTIVATION UND VERHALTEN ===
  profile += `${archetype} – ${archDescription}\n\n`;

  // === MDMT-KONTEXT-ANALYSE (basierend auf Dialog-Länge) ===
  const mdmtContext = `${socialAdherence ?? 0}/12 Social Cues akzeptiert`;
  let mdmtInterpretation = "";

  if (socialAdherence !== null && socialAdherence <= 1) {
    mdmtInterpretation =
      `Diese Person lehnte fast alle sozialen Gesprächsmöglichkeiten ab (${mdmtContext}). Dies ist nicht Unhöflichkeit, sondern strikte Aufgaben-Fokussierung – psychologisch bedeutet das entweder: (a) hohe Effizienzorientierung, (b) Unruhe/Ungeduld, oder (c) bewusste emotionale Distanzierung zu dem System.`;
  } else if (socialAdherence !== null && socialAdherence >= 9) {
    mdmtInterpretation =
      `Diese Person griff aktiv zu sozialen Gesprächsmöglichkeiten (${mdmtContext}). Sie suchten Kontakt, Bestätigung, oder wollten das System nicht "kränken" – ein Zeichen von sozialer Intelligenz oder erhöhtem Vertrauensbedarf.`;
  } else if (socialAdherence !== null && socialAdherence >= 5) {
    mdmtInterpretation =
      `Diese Person balancierte zwischen Aufgabe und Beziehung (${mdmtContext}). Sie waren "höflich aber fokussiert" – ein ausgeglichenes Muster, das gesunden sozialen Bezug zeigt ohne Abhängigkeit.`;
  }

  profile += `Interaktions-Qualität (MDMT-Analyse): ${mdmtInterpretation}\n\n`;

  // === VERTRAUENS-PSYCHOLOGIE ===
  let trustNarrative = "";

  if (totalTrust >= 6 && sincereTrust >= 5 && moralTrust >= 5) {
    trustNarrative =
      "Diese Person vertraut dem System ganzheitlich: Sie glauben nicht nur, dass es funktioniert (Performance), sondern dass es ehrlich ist und mit guter Absicht handelt. Ein tiefes, umfassendes Vertrauen.";
  } else if (totalTrust >= 5.5 && (sincereTrust < 3 || moralTrust < 3)) {
    trustNarrative =
      "Interessant: Gesamtvertrauen ist hoch, aber die Person ist unsicher, ob das System wirklich aufrichtig ist. Sie vertrauen der Kompetenz, nicht der Intention.";
  } else if (totalTrust < 3.5) {
    trustNarrative =
      "Niedriges Vertrauen durchgehend. Diese Person geht skeptisch ins Experiment; ihre Entscheidungen werden von Vorsicht geprägt sein, nicht von Zusammenarbeit.";
  }

  profile += `Vertrauens-Profil: ${trustNarrative}\n\n`;

  // === VERANTWORTUNGS- UND COMPLIANCE-PSYCHOLOGIE ===
  let complianceNarrative = "";

  if (compliance === 1 && feltResponsibility >= 6) {
    complianceNarrative =
      "Compliance-Entscheidung gepaart mit hohem Verantwortungsgefühl: Diese Person hat die Systemempfehlung bewusst akzeptiert und fühlt sich dafür verantwortlich. Ein reflexiver, bewusster Akt – nicht einfach Gehorsam.";
  } else if (compliance === 1 && feltResponsibility < 4) {
    complianceNarrative =
      "Compliance ohne großes Verantwortungsgefühl: Diese Person folgte dem System, aber emotionaler Bezug war gering. Möglicherweise Delegationsmechanismus oder Unbehagen mit der Verantwortung.";
  } else if (compliance === 0 && feltResponsibility >= 6) {
    complianceNarrative =
      "Ablehnung der Systemempfehlung mit hohem Verantwortungsgefühl: Diese Person wollte selbst die Kontrolle haben und übernahm die Verantwortung. Ein Ausdruck echter Autonomie und Eigenverantwortung.";
  } else if (compliance === 0 && feltResponsibility < 4) {
    complianceNarrative =
      "Ablehnung ohne starkes Verantwortungsgefühl: Diese Person lehnte einfach ab, vielleicht unbewusst oder aus Routine. Weniger bewusste Autonomie, mehr Reaktion.";
  }

  profile += `Entscheidungs-Psychologie: ${complianceNarrative}\n\n`;

  // === SYSTEM-INTERFACE-EFFEKT ===
  let interfaceEffect = "";

  if (group === "AVATAR" && perceivedHumanlikeness >= 5 && socialEngagement >= 0.5) {
    interfaceEffect =
      "Der Avatar-Effekt wirkte bei dieser Person: Das System wirkte menschlich, und die Person reagierte sozial. Dies ist ein klassisches psychologisches Phänomen: Form folgt Inhalt.";
  } else if (group === "AVATAR" && perceivedHumanlikeness >= 5 && socialEngagement < 0.25) {
    interfaceEffect =
      "Interessant: Der Avatar wirkte sehr menschlich, aber die Person blieb emotional distanziert. Sie haben das System bewusst als Werkzeug behandelt, nicht als soziales Wesen – emotionale Resistenz oder Bewusstsein, dass es kein echter Mensch ist.";
  } else if (group === "TERMINAL" && socialEngagement >= 0.5) {
    interfaceEffect =
      "Die Person war sozial responsiv auch gegenüber reiner Text. Dies deutet auf intrinsisches sozialkulturelle Konditionierung hin: Sie behandeln jedes Interface mit sozialen Normen, als wäre jemand 'auf der anderen Seite'.";
  } else if (group === "TERMINAL" && socialEngagement < 0.25) {
    interfaceEffect =
      "Terminal-Nutzer, der funktional blieb. Keine Avatar-Effekte nötig – diese Person hat durchgehend pragmatisch interagiert.";
  }

  profile += `Interface-Dynamik: ${interfaceEffect}\n\n`;

  // === FINALE PSYCHOLOGISCHE CHARAKTERISIERUNG ===
  let psychoSummary = "";

  const trustScore = totalTrust / 7;
  const engagementScore = socialEngagement;
  const autonomyScore = autonomyDrive;

  if (trustScore >= 0.75 && engagementScore >= 0.65) {
    psychoSummary =
      "Psychologisches Profil: Ein vertrauen-engagierter Mensch, der Systeme akzeptiert und mit ihnen kooperiert. Niedrig defensiv, offen für Zusammenarbeit. In menschlichen Beziehungen wahrscheinlich kollaborativ und loyal.";
  } else if (autonomyScore >= 0.7 && trustScore >= 0.6) {
    psychoSummary =
      "Psychologisches Profil: Ein souveräner, selbstständiger Denker, der hohe Standards hat aber bereit ist, andere zu bewerten. Nicht leicht zu beeinflussen, aber nicht radikal skeptisch. In Teams wahrscheinlich kritisch-konstruktiv.";
  } else if (trustScore < 0.4 && autonomyScore >= 0.7) {
    psychoSummary =
      "Psychologisches Profil: Ein kritischer, defensiver Charakter. Diese Person braucht starke Beweise bevor sie vertraut. Könnte frühere Verletzung oder negative Erfahrung spiegeln. In Kooperation wahrscheinlich vorsichtig, aber wenn Vertrauen gewonnen, dann treu.";
  } else if (engagementScore < 0.3 && trustScore >= 0.5) {
    psychoSummary =
      "Psychologisches Profil: Eine funktional-emotionale Person: Sie vertrauen den Systemen, aber ohne emotionale Bindung. Professionell, sachlich, klar – aber auch möglicherweise distanziert. Guter Denker, aber wenig Bauchgefühl in Entscheidungen.";
  } else {
    psychoSummary =
      "Psychologisches Profil: Eine komplexe, mehrschichtige Person mit ausgewogenen Tendenzen. Sie navigieren zwischen Vertrauen und Skepsis, Autonomie und Kooperation – ein realistisches, erwachsenes Entscheidungsmuster.";
  }

  profile += psychoSummary;

  return profile;
}
