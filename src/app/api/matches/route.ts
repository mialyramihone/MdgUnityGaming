import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { mapResults, teams, maps, matches } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const MAP_NAMES: Record<number, string> = {
  1: 'Bermuda', 2: 'Purgatory', 3: 'Kalahari',
  4: 'NeXTerra', 5: 'Solara', 6: 'Alpine'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    
    let results: any[];
    
    if (matchId && parseInt(matchId) > 0) {
      results = await db
        .select({
          id: mapResults.id,
          teamId: mapResults.teamId,
          teamName: teams.teamName,
          position: mapResults.position,
          kills: mapResults.kills,
          booyah: mapResults.booyah,
          points: mapResults.points,
          createdAt: mapResults.createdAt,
          matchNumber: matches.matchNumber,
          mapNumber: maps.mapNumber,
        })
        .from(mapResults)
        .leftJoin(teams, eq(mapResults.teamId, teams.id))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .where(eq(matches.matchNumber, parseInt(matchId)))
        .orderBy(maps.mapNumber, mapResults.position);
    } else {
      results = await db
        .select({
          id: mapResults.id,
          teamId: mapResults.teamId,
          teamName: teams.teamName,
          position: mapResults.position,
          kills: mapResults.kills,
          booyah: mapResults.booyah,
          points: mapResults.points,
          createdAt: mapResults.createdAt,
          matchNumber: matches.matchNumber,
          mapNumber: maps.mapNumber,
        })
        .from(mapResults)
        .leftJoin(teams, eq(mapResults.teamId, teams.id))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .orderBy(desc(matches.matchNumber), desc(maps.mapNumber), desc(mapResults.createdAt))
        .limit(50);
    }
    
    const formattedResults = results.map(r => ({
      ...r,
      mapName: MAP_NAMES[r.mapNumber || 1] || 'Bermuda'
    }));
    
    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Erreur API match-results:', error);
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    
    const result = await db.select().from(mapResults).where(eq(mapResults.id, parseInt(id))).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }
    
    const mapId = result[0].mapId;
    await db.delete(mapResults).where(eq(mapResults.id, parseInt(id)));
    
    const remaining = await db.select().from(mapResults).where(eq(mapResults.mapId, mapId));
    if (remaining.length === 0) {
      await db.delete(maps).where(eq(maps.id, mapId));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}