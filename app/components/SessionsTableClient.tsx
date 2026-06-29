"use client";

import { useState } from "react";
import { ParticipantAnalysisModal } from "./ParticipantAnalysisModal";
import { isDatasetComplete } from "@/app/lib/analysis/textBlocks";

interface SessionsTableClientProps<T> {
  rows: T[];
  columns: readonly string[];
  columnInfo: Record<string, string>;
  displayValue: (row: T, column: string) => React.ReactNode;
  sessionColumns: readonly string[];
}

export function SessionsTableClient<T extends { id: string }>({
  rows,
  columns,
  columnInfo,
  displayValue,
  sessionColumns,
}: SessionsTableClientProps<T>) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalysisClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  // Type guard to check if row has complete dataset
  const isComplete = (row: T): boolean => {
    const anyRow = row as any;
    return isDatasetComplete(anyRow);
  };

  return (
    <>
      <div className="mt-5 overflow-x-auto overflow-y-visible rounded-2xl border border-slate-200 bg-white shadow-inner shadow-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-950 text-slate-100">
            <tr>
              <th className="px-3 py-2 text-left font-bold">Analyse</th>
              {sessionColumns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2 text-left font-bold"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {column}
                    <InfoHint text={columnInfo[column]} dark />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-5 text-center text-slate-500"
                  colSpan={sessionColumns.length + 1}
                >
                  Noch keine Sessions vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const complete = isComplete(row);

                return (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-sky-50/70"
                  >
                    <td className="px-3 py-2">
                      {complete ? (
                        <button
                          onClick={() => handleAnalysisClick(row.id)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold transition-colors"
                          title="Detaillierte Analyse anzeigen"
                        >
                          💭
                        </button>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded bg-slate-100 text-slate-400 text-xs"
                          title="Datensatz unvollständig"
                        >
                          ⓘ
                        </span>
                      )}
                    </td>
                    {sessionColumns.map((column) => (
                      <td
                        key={column}
                        className="whitespace-nowrap px-3 py-2"
                      >
                        {displayValue(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedSessionId && (
        <ParticipantAnalysisModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSessionId(null);
          }}
          participantId={selectedSessionId}
        />
      )}
    </>
  );
}

/**
 * InfoHint Komponente - einfache Version für Fallback
 * (Falls diese nicht existiert, wird sie hier als Dummy definiert)
 */
function InfoHint({
  text,
  dark,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full cursor-help text-[10px] font-bold ${
        dark
          ? "bg-slate-600 text-slate-100 hover:bg-slate-700"
          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
      }`}
      title={text}
    >
      ?
    </span>
  );
}
