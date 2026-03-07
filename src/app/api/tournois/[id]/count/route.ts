import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("=".repeat(50));
  console.log("🔵 API /api/tournois/2/count appelée");
  console.log("🔵 params reçus:", params);
  
  try {
    // Vérifier que params.id existe
    if (!params?.id) {
      console.log("🔴 params.id manquant");
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }
    
    const tournoiId = parseInt(params.id);
    console.log("🔵 Tournoi ID parsé:", tournoiId);
    
    // Vérifier que c'est un nombre valide
    if (isNaN(tournoiId)) {
      console.log("🔴 Tournoi ID invalide (NaN)");
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }
    
    // Compter les équipes pour ce tournoi
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