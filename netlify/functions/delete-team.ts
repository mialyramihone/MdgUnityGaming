import { Handler } from '@netlify/functions';
import { db } from '@/db/config';
import { teams, teamPlayers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  try {
    const id = event.queryStringParameters?.id;
    const teamId = parseInt(id || '');

    if (isNaN(teamId)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'ID invalide' }) };
    }

    await db.delete(teamPlayers).where(eq(teamPlayers.teamId, teamId));
    const deleted = await db.delete(teams).where(eq(teams.id, teamId)).returning();

    if (deleted.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Équipe non trouvée' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Erreur:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur serveur' }) };
  }
};

export { handler };
