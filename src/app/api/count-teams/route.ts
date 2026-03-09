import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  console.log("🔵 API count-teams appelée");
  
  try {
    const url = new URL(request.url);
    
    const idParam = url.searchParams.get('tournamentId');
    console.log("🔵 tournamentId reçu:", idParam);
    
    if (!idParam) {
      console.log("🔴 ERREUR: tournamentId manquant");
      return NextResponse.json(
        { error: "ID du tournoi manquant" }, 
        { status: 400 }
      );
    }
    
    const tournoiId = parseInt(idParam, 10);
    
    if (isNaN(tournoiId)) {
      console.log("🔴 ERREUR: tournamentId invalide");
      return NextResponse.json(
        { error: "ID du tournoi invalide" }, 
        { status: 400 }
      );
    }
    
    console.log("🔵 Tournoi ID parsé:", tournoiId);
    
    const result = await db.select()
      .from(teams)
      .where(eq(teams.tournamentId, tournoiId));
    
    console.log("🟢 Équipes trouvées:", result.length);
    
    return NextResponse.json({ count: result.length });
    
  } catch (error) {
    console.error("🔴 Erreur:", error);
    return NextResponse.json(
      { error: String(error) }, 
      { status: 500 }
    );
  }
}