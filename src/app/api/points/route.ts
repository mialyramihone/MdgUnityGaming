import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const POSITION_POINTS: Record<number, number> = {
  1: 12, 2: 9, 3: 8, 4: 7, 5: 6,
  6: 5, 7: 4, 8: 3, 9: 2, 10: 1,
  11: 0, 12: 0
};

const MAPS: Record<string, number> = {
  'Bermuda': 1, 'Purgatory': 2, 'Kalahari': 3,
  'NeXTerra': 4, 'Solara': 5, 'Alpine': 6
};

export async function GET() {
  try {
    
    const teams = await sql`
      SELECT 
        id, 
        team_name as "teamName", 
        team_tag as "teamTag"
      FROM teams 
      WHERE tournament_id = 2 
      ORDER BY team_name
    `;
    
    const rankings = await sql`
      SELECT r.*, t.team_name as "teamName", t.team_tag as "teamTag"
      FROM rankings r
      JOIN teams t ON r.team_id = t.id
      WHERE t.tournament_id = 2
      ORDER BY r.total_points DESC, r.total_booyahs DESC, r.total_kills DESC
    `;
    
    const matchResults = await sql`
      SELECT 
        mr.id, 
        mr.team_id, 
        mr.position, 
        mr.kills, 
        mr.booyah, 
        mr.points, 
        mr.created_at as "createdAt",
        t.team_name as "teamName",
        m.match_number as "matchNumber",
        m.match_group as "matchGroup",
        mp.map_number as "mapNumber"
      FROM map_results mr
      JOIN teams t ON mr.team_id = t.id
      JOIN maps mp ON mr.map_id = mp.id
      JOIN matches m ON mp.match_id = m.id
      WHERE m.tournament_id = 2
      ORDER BY m.match_group, m.match_number, mp.map_number, mr.position
    `;
    
    const formattedResults = matchResults.map((r: any) => ({
      id: r.id,
      teamId: r.team_id,
      teamName: r.teamName,
      matchNumber: r.matchNumber,
      matchGroup: r.matchGroup,
      mapNumber: r.mapNumber,
      mapName: Object.keys(MAPS).find(k => MAPS[k as keyof typeof MAPS] === r.mapNumber) || 'Unknown',
      position: r.position,
      kills: r.kills,
      booyah: r.booyah,
      points: r.points,
      createdAt: r.createdAt
    }));
    
    return NextResponse.json({ 
      teams, 
      rankings, 
      matchResults: formattedResults 
    });
  } catch (error) {
    console.error('Erreur GET points:', error);
    return NextResponse.json({ teams: [], rankings: [], matchResults: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, matchNumber, matchGroup, mapName, position, kills } = body;
    const booyah = position === 1;
    
    const positionPoints = POSITION_POINTS[position] || 0;
    const totalPoints = positionPoints + (kills * 1);
    
    const mapNumberValue = MAPS[mapName as keyof typeof MAPS];
    if (!mapNumberValue) {
      return NextResponse.json({ error: 'Map non reconnue' }, { status: 400 });
    }
    
    let matchResult = await sql`
      SELECT id FROM matches 
      WHERE match_number = ${matchNumber} 
      AND match_group = ${matchGroup}
      AND tournament_id = 2
      LIMIT 1
    `;
    let matchId: number;
    
    if (matchResult.length === 0) {
      const newMatch = await sql`
        INSERT INTO matches (match_number, match_group, tournament_id) 
        VALUES (${matchNumber}, ${matchGroup}, 2) 
        RETURNING id
      `;
      matchId = newMatch[0].id;
    } else {
      matchId = matchResult[0].id;
    }
    
    let mapResult = await sql`
      SELECT id FROM maps 
      WHERE match_id = ${matchId} AND map_number = ${mapNumberValue} 
      LIMIT 1
    `;
    let mapId: number;
    
    if (mapResult.length === 0) {
      const newMap = await sql`
        INSERT INTO maps (match_id, map_number) 
        VALUES (${matchId}, ${mapNumberValue}) 
        RETURNING id
      `;
      mapId = newMap[0].id;
    } else {
      mapId = mapResult[0].id;
    }
    
    await sql`
      INSERT INTO map_results (map_id, team_id, position, kills, booyah, points)
      VALUES (${mapId}, ${teamId}, ${position}, ${kills}, ${booyah}, ${totalPoints})
    `;
    
    const existingRanking = await sql`
      SELECT * FROM rankings WHERE team_id = ${teamId} LIMIT 1
    `;
    
    if (existingRanking.length === 0) {
      await sql`
        INSERT INTO rankings (team_id, total_points, total_kills, total_booyahs, matches_played)
        VALUES (${teamId}, ${totalPoints}, ${kills}, ${booyah ? 1 : 0}, 1)
      `;
    } else {
      await sql`
        UPDATE rankings 
        SET total_points = total_points + ${totalPoints},
            total_kills = total_kills + ${kills},
            total_booyahs = total_booyahs + ${booyah ? 1 : 0},
            matches_played = matches_played + 1,
            updated_at = NOW()
        WHERE team_id = ${teamId}
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST points:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}