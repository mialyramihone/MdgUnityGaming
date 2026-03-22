import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams, teamPlayers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    await db.delete(teamPlayers).where(eq(teamPlayers.teamId, teamId));

    const deleted = await db.delete(teams).where(eq(teams.id, teamId)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Équipe non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
