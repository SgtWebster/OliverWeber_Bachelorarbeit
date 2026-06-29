"use client";

import { useState } from "react";
import { ParticipantAnalysisModal } from "./ParticipantAnalysisModal";

interface DisplayedSession {
  id: string;
  isComplete: boolean;
  displayValues: Record<string, string | number>;
  columnNames: string[];
}

interface SessionsTableClientProps {
  sessions: DisplayedSession[];
}

export function SessionsTableClient({ sessions }: SessionsTableClientProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalysisClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="mt-5 overflow-x-auto overflow-y-visible rounded-2xl border border-slate-200 bg-white shadow-inner shadow-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-950 text-slate-100">
            <tr>
              <th className="px-3 py-2 text-left font-bold">Analyse</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-5 text-center text-slate-500">
                Noch keine Sessions vorhanden.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const firstSession = sessions[0];
  const columnNames = firstSession.columnNames || [];

  return (
    <>
      <div className="mt-5 overflow-x-auto overflow-y-visible rounded-2xl border border-slate-200 bg-white shadow-inner shadow-slate-100">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-950 text-slate-100">
            <tr>
              <th className="px-3 py-2 text-left font-bold">Analyse</th>
              {columnNames.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2 text-left font-bold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-sky-50/70"
              >
                <td className="px-3 py-2">
                  {session.isComplete ? (
                    <button
                      onClick={() => handleAnalysisClick(session.id)}
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
                {columnNames.map((column) => (
                  <td
                    key={column}
                    className="whitespace-nowrap px-3 py-2"
                  >
                    {session.displayValues[column] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
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
