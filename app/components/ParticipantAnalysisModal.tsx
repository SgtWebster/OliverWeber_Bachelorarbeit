"use client";

import { useState, useEffect } from "react";
import { ParticipantAnalysis } from "@/app/lib/analysis/generateAnalysis";
import styles from "./ParticipantAnalysisModal.module.css";

interface ParticipantAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
}

export function ParticipantAnalysisModal({
  isOpen,
  onClose,
  participantId,
}: ParticipantAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<ParticipantAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<
    "personality" | "perception" | "decision" | "insights" | null
  >("personality");

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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {analysis ? "Teilnehmer-Analyse" : "Laden..."}
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
            <div className={styles.accordion}>
              {/* Persönlichkeit */}
              <div className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "personality" ? null : "personality"
                    )
                  }
                >
                  <span>👤 Persönlichkeit & Hintergrund</span>
                  <span className={styles.icon}>
                    {expandedSection === "personality" ? "▼" : "▶"}
                  </span>
                </button>
                {expandedSection === "personality" && (
                  <div className={styles.accordionContent}>
                    <p>{analysis.sections.personality}</p>
                  </div>
                )}
              </div>

              {/* Wahrnehmung */}
              <div className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "perception" ? null : "perception"
                    )
                  }
                >
                  <span>🔍 Wahrnehmung des Systems</span>
                  <span className={styles.icon}>
                    {expandedSection === "perception" ? "▼" : "▶"}
                  </span>
                </button>
                {expandedSection === "perception" && (
                  <div className={styles.accordionContent}>
                    <p>{analysis.sections.perception}</p>
                  </div>
                )}
              </div>

              {/* Entscheidung */}
              <div className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "decision" ? null : "decision"
                    )
                  }
                >
                  <span>⚡ Entscheidung & Beweggründe</span>
                  <span className={styles.icon}>
                    {expandedSection === "decision" ? "▼" : "▶"}
                  </span>
                </button>
                {expandedSection === "decision" && (
                  <div className={styles.accordionContent}>
                    <p>{analysis.sections.decision}</p>
                  </div>
                )}
              </div>

              {/* Insights */}
              <div className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "insights" ? null : "insights"
                    )
                  }
                >
                  <span>💡 Insights & Muster</span>
                  <span className={styles.icon}>
                    {expandedSection === "insights" ? "▼" : "▶"}
                  </span>
                </button>
                {expandedSection === "insights" && (
                  <div className={styles.accordionContent}>
                    <p>{analysis.sections.insights}</p>
                  </div>
                )}
              </div>
            </div>
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
