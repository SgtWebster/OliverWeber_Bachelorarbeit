import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";
import { generateAnalysis } from "@/app/lib/analysis/generateAnalysis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Hole die Session aus der DB
    const session = await prisma.participantSession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Teilnehmer nicht gefunden" },
        { status: 404 }
      );
    }

    // Generiere die Analyse
    const analysis = generateAnalysis(session);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Fehler bei der Analyse-Generierung:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Analyse" },
      { status: 500 }
    );
  }
}
