import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchNumber = searchParams.get('match');
    const matchGroup = searchParams.get('group');
    
    let query = sql`
      SELECT 
        t.id,
        t.team_name as "teamName",
        t.team_tag as "teamTag",
        COALESCE(SUM(mr.points), 0) as "totalPoints",
        COALESCE(SUM(mr.kills), 0) as "totalKills",
        COALESCE(SUM(CASE WHEN mr.booyah = true THEN 1 ELSE 0 END), 0) as "totalBooyahs",
        COUNT(DISTINCT mr.map_id) as "matchesPlayed"
      FROM teams t
      LEFT JOIN map_results mr ON t.id = mr.team_id
      LEFT JOIN maps mp ON mr.map_id = mp.id
      LEFT JOIN matches m ON mp.match_id = m.id
      WHERE m.tournament_id = 2
    `;
    
    if (matchGroup && matchGroup !== 'all') {
      query = sql`${query} AND m.match_group = ${matchGroup}`;
    }
    
    if (matchNumber && parseInt(matchNumber) > 0) {
      const numMatch = parseInt(matchNumber);
      query = sql`${query} AND m.match_number = ${numMatch}`;
    }
    
    query = sql`${query} GROUP BY t.id, t.team_name, t.team_tag ORDER BY "totalPoints" DESC, "totalBooyahs" DESC, "totalKills" DESC`;
    
    const rankings = await query;
    
    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Erreur API rankings:', error);
    return NextResponse.json([]);
  }
}