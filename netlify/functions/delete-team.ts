import { db } from '@/db/config';
import { teams, teamPlayers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request) {
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const teamId = parseInt(id || '');

    if (isNaN(teamId)) {
      return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
    }

    await db.delete(teamPlayers).where(eq(teamPlayers.teamId, teamId));
    const deleted = await db.delete(teams).where(eq(teams.id, teamId)).returning();

    if (deleted.length === 0) {
      return new Response(JSON.stringify({ error: 'Équipe non trouvée' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
}
