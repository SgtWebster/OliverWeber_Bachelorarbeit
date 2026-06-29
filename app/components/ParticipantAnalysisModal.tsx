"use client";

import { useState, useEffect } from "react";
import { ParticipantAnalysis } from "@/app/lib/analysis/generateAnalysis";
import styles from "./ParticipantAnalysisModal.module.css";

interface ParticipantAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
}

type TabType = "personality" | "perception" | "decision" | "interaction" | "patterns" | "causal" | "personal";

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: "personal", label: "👤 Du bist", icon: "👤" },
  { id: "personality", label: "👥 Profil", icon: "👥" },
  { id: "perception", label: "🔍 Wahrnehmung", icon: "🔍" },
  { id: "decision", label: "⚡ Entscheidung", icon: "⚡" },
  { id: "interaction", label: "💬 Interaktion", icon: "💬" },
  { id: "patterns", label: "🔗 Muster & Dynamiken", icon: "🔗" },
  { id: "causal", label: "🧠 Kausalitäten", icon: "🧠" },
];

export function ParticipantAnalysisModal({
  isOpen,
  onClose,
  participantId,
}: ParticipantAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<ParticipantAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  // Lade Analyse wenn Modal öffnet
  useEffect(() => {
    if (!isOpen || analysis) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/analysis/participant/${participantId}`
        );

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Analyse");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setActiveTab("personal");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, participantId]);

  const retryLoad = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analysis/participant/${participantId}`
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Analyse");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getTabContent = (tab: TabType): string => {
    if (!analysis) return "";
    return analysis.sections[tab] || "";
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {analysis ? "Tiefenanalyse" : "Laden..."}
            </h2>
            {analysis && (
              <>
                <p className={styles.subtitle}>{analysis.title}</p>
                <p className={styles.summary}>{analysis.summary}</p>
              </>
            )}
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Analyse wird generiert...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>⚠️ {error}</p>
              <button onClick={retryLoad} className={styles.retryButton}>
                Erneut versuchen
              </button>
            </div>
          )}

          {analysis && !analysis.isComplete && (
            <div className={styles.incomplete}>
              <p>⚠️ Dieser Datensatz ist unvollständig und kann nicht analysiert werden.</p>
            </div>
          )}

          {analysis && analysis.isComplete && (
            <>
              {/* Executive Summary */}
              <div className={styles.executiveSummary}>
                <p>{analysis.executiveSummary}</p>
              </div>

              {/* Tab Navigation */}
              <div className={styles.tabNav}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.tabButton} ${
                      activeTab === tab.id ? styles.tabActive : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabLabel}>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className={styles.tabContent}>
                <p>{getTabContent(activeTab)}</p>

                {/* Abschlussbotschaft der KI (nur im "Du bist"-Tab) */}
                {activeTab === "personal" && analysis.closingMessage && (
                  <div
                    className={`${styles.closingBox} ${
                      analysis.group === "AVATAR"
                        ? styles.closingAida
                        : styles.closingTerminal
                    }`}
                  >
                    <p className={styles.closingText}>{analysis.closingMessage}</p>
                    <p className={styles.closingSignature}>
                      {analysis.closingSignature}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButtonFooter} onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
