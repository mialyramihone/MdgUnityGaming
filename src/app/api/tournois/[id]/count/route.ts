import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // <-- params est un Promise
) {
  // récupérer id depuis la Promise
  const { id } = await context.params;

  console.log("=".repeat(50));
  console.log("🔵 API /api/tournois/[id]/count appelée");
  console.log("🔵 params reçus:", { id });
  
  try {
    if (!id) {
      console.log("🔴 id manquant");
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const tournoiId = parseInt(id);
    if (isNaN(tournoiId)) {
      console.log("🔴 Tournoi ID invalide (NaN)");
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const result = await db.select()
      .from(teams)
      .where(eq(teams.tournamentId, tournoiId));

    console.log("🟢 Équipes trouvées:", result.length);
    console.log("=".repeat(50));

    return NextResponse.json({ count: result.length });

  } catch (error) {
    console.error("🔴 ERREUR:", error);
    console.log("=".repeat(50));

    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: String(error) 
    }, { status: 500 });
  }
}