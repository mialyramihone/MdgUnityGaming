import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams, rankings, mapResults, matches, maps } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchFilter = searchParams.get('match');
    
    let allRankings: any[] = [];
    
    if (matchFilter && parseInt(matchFilter) > 0) {
      const matchNumber = parseInt(matchFilter);
      
      const result = await db
        .select({
          id: teams.id,
          teamName: teams.teamName,
          teamTag: teams.teamTag,
          totalPoints: sql<number>`COALESCE(SUM(${mapResults.points}), 0)`,
          totalKills: sql<number>`COALESCE(SUM(${mapResults.kills}), 0)`,
          totalBooyahs: sql<number>`COALESCE(SUM(CASE WHEN ${mapResults.booyah} = true THEN 1 ELSE 0 END), 0)`,
          matchesPlayed: sql<number>`COUNT(DISTINCT ${mapResults.mapId})`,
        })
        .from(teams)
        .leftJoin(mapResults, eq(teams.id, mapResults.teamId))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .where(eq(matches.matchNumber, matchNumber))
        .groupBy(teams.id, teams.teamName, teams.teamTag)
        .orderBy(
          desc(sql`COALESCE(SUM(${mapResults.points}), 0)`),
          desc(sql`COALESCE(SUM(CASE WHEN ${mapResults.booyah} = true THEN 1 ELSE 0 END), 0)`),
          desc(sql`COALESCE(SUM(${mapResults.kills}), 0)`)
        );
      
      allRankings = result.map(r => ({
        id: r.id,
        teamName: r.teamName,
        teamTag: r.teamTag,
        totalPoints: Number(r.totalPoints) || 0,
        totalKills: Number(r.totalKills) || 0,
        totalBooyahs: Number(r.totalBooyahs) || 0,
        matchesPlayed: Number(r.matchesPlayed) || 0,
      }));
    } else {
      const result = await db
        .select({
          id: teams.id,
          teamName: teams.teamName,
          teamTag: teams.teamTag,
          totalPoints: rankings.totalPoints,
          totalKills: rankings.totalKills,
          totalBooyahs: rankings.totalBooyahs,
          matchesPlayed: rankings.matchesPlayed,
        })
        .from(teams)
        .leftJoin(rankings, eq(teams.id, rankings.teamId))
        .orderBy(desc(rankings.totalPoints), desc(rankings.totalBooyahs), desc(rankings.totalKills));
      
      allRankings = result.map(r => ({
        id: r.id,
        teamName: r.teamName,
        teamTag: r.teamTag,
        totalPoints: r.totalPoints || 0,
        totalKills: r.totalKills || 0,
        totalBooyahs: r.totalBooyahs || 0,
        matchesPlayed: r.matchesPlayed || 0,
      }));
    }
    
    
    return NextResponse.json(allRankings);
  } catch (error) {
    console.error('Erreur API rankings:', error);
    return NextResponse.json([]);
  }
}