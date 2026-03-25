import { db } from '@/db/config';
import { mapResults, teams, rankings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function recalculateRankings() {
  try {
    
    const results = await db
      .select({
        teamId: mapResults.teamId,
        totalPoints: sql<number>`COALESCE(SUM(${mapResults.points}), 0)`,
        totalKills: sql<number>`COALESCE(SUM(${mapResults.kills}), 0)`,
        totalBooyahs: sql<number>`COALESCE(SUM(CASE WHEN ${mapResults.booyah} = true THEN 1 ELSE 0 END), 0)`,
        matchesPlayed: sql<number>`COUNT(*)`,
      })
      .from(mapResults)
      .groupBy(mapResults.teamId);
    
      
    await db.delete(rankings);
    
    
    for (const result of results) {
      await db.insert(rankings).values({
        teamId: result.teamId,
        totalPoints: result.totalPoints,
        totalKills: result.totalKills,
        totalBooyahs: result.totalBooyahs,
        matchesPlayed: result.matchesPlayed,
        updatedAt: new Date(),
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur recalcul classement:', error);
    return { success: false, error };
  }
}