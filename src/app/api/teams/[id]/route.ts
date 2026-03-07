import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams , teamPlayers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
      const id = parseInt(params.id);
      
  await db.delete(teamPlayers).where(eq(teamPlayers.teamId, id));
    
      await db.delete(teams).where(eq(teams.id, id));
      
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}