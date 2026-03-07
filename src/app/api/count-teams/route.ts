import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  console.log("🔵 API count-teams appelée");
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  console.log("🔵 ID reçu:", id);
  
  try {
    const tournoiId = parseInt(id || '');
    console.log("🔵 Tournoi ID parsé:", tournoiId);
    
    const result = await db.select()
      .from(teams)
      .where(eq(teams.tournamentId, tournoiId));
    
    console.log("🟢 Équipes trouvées:", result.length);
    console.log("🟢 Données:", result);
    
    return NextResponse.json({ count: result.length });
    
  } catch (error) {
    console.error("🔴 Erreur:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}