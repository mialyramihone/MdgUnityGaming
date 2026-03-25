import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');
    
    if (!tournamentId) {
      return NextResponse.json({ count: 0 });
    }
    
    const id = parseInt(tournamentId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ count: 0 });
    }
    
    const result = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, id));
    
    return NextResponse.json({ count: result.length });
  } catch (error) {
    console.error('Erreur count-teams:', error);
    return NextResponse.json({ count: 0 });
  }
}