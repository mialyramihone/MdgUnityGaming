import { NextRequest, NextResponse } from 'next/server';
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resultId = parseInt(id);
    const body = await request.json();
    const { teamId, matchNumber, matchGroup, mapName, position, kills, points } = body;
    
    const existingResult = await sql`
      SELECT mr.*, mp.match_id 
      FROM map_results mr
      JOIN maps mp ON mr.map_id = mp.id
      WHERE mr.id = ${resultId}
    `;
    
    if (existingResult.length === 0) {
      return NextResponse.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }
    
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
    let newMapId: number;
    
    if (mapResult.length === 0) {
      const newMap = await sql`
        INSERT INTO maps (match_id, map_number) 
        VALUES (${matchId}, ${mapNumberValue}) 
        RETURNING id
      `;
      newMapId = newMap[0].id;
    } else {
      newMapId = mapResult[0].id;
    }
    
    await sql`
      UPDATE map_results 
      SET map_id = ${newMapId},
          team_id = ${teamId},
          position = ${position},
          kills = ${kills},
          booyah = ${position === 1},
          points = ${points},
          created_at = NOW()
      WHERE id = ${resultId}
    `;
    
    await sql`DELETE FROM rankings`;
    
    const allResults = await sql`
      SELECT 
        team_id,
        SUM(points) as total_points,
        SUM(kills) as total_kills,
        SUM(CASE WHEN booyah = true THEN 1 ELSE 0 END) as total_booyahs,
        COUNT(DISTINCT map_id) as matches_played
      FROM map_results
      GROUP BY team_id
    `;
    
    for (const r of allResults) {
      await sql`
        INSERT INTO rankings (team_id, total_points, total_kills, total_booyahs, matches_played, updated_at)
        VALUES (${r.team_id}, ${r.total_points}, ${r.total_kills}, ${r.total_booyahs}, ${r.matches_played}, NOW())
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur PUT points:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resultId = parseInt(id);
    
    const result = await sql`
      SELECT mr.*, mp.match_id 
      FROM map_results mr
      JOIN maps mp ON mr.map_id = mp.id
      WHERE mr.id = ${resultId}
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }
    
    const mapId = result[0].map_id;
    
    await sql`DELETE FROM map_results WHERE id = ${resultId}`;
    
    const remaining = await sql`
      SELECT id FROM map_results WHERE map_id = ${mapId}
    `;
    
    if (remaining.length === 0) {
      await sql`DELETE FROM maps WHERE id = ${mapId}`;
    }
    
    await sql`DELETE FROM rankings`;
    
    const allResults = await sql`
      SELECT 
        team_id,
        SUM(points) as total_points,
        SUM(kills) as total_kills,
        SUM(CASE WHEN booyah = true THEN 1 ELSE 0 END) as total_booyahs,
        COUNT(DISTINCT map_id) as matches_played
      FROM map_results
      GROUP BY team_id
    `;
    
    for (const r of allResults) {
      await sql`
        INSERT INTO rankings (team_id, total_points, total_kills, total_booyahs, matches_played, updated_at)
        VALUES (${r.team_id}, ${r.total_points}, ${r.total_kills}, ${r.total_booyahs}, ${r.matches_played}, NOW())
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE points:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}