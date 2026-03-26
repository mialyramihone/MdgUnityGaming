import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { mapResults, teams, maps, matches, rankings } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchNumber = searchParams.get('match');
    const matchGroup = searchParams.get('group');
    
    if (matchNumber && parseInt(matchNumber) > 0 && matchGroup && matchGroup !== 'all') {
      const results = await db
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
          matchGroup: matches.matchGroup,
          mapNumber: maps.mapNumber,
        })
        .from(mapResults)
        .leftJoin(teams, eq(mapResults.teamId, teams.id))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .where(and(
          eq(matches.matchNumber, parseInt(matchNumber)),
          eq(matches.matchGroup, matchGroup)
        ))
        .orderBy(matches.matchNumber, maps.mapNumber, mapResults.position);
      
      const mapNames: Record<number, string> = {
        1: 'Bermuda', 2: 'Purgatory', 3: 'Kalahari',
        4: 'NeXTerra', 5: 'Solara', 6: 'Alpine'
      };
      
      const formattedResults = results.map(r => ({
        id: r.id,
        teamId: r.teamId,
        teamName: r.teamName,
        matchNumber: r.matchNumber,
        matchGroup: r.matchGroup,
        mapName: r.mapNumber ? mapNames[r.mapNumber] || 'Bermuda' : 'Bermuda',
        position: r.position,
        kills: r.kills,
        booyah: r.booyah,
        points: r.points,
        createdAt: r.createdAt,
      }));
      
      return NextResponse.json(formattedResults);
    }
    
    if (matchNumber && parseInt(matchNumber) > 0) {
      const results = await db
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
          matchGroup: matches.matchGroup,
          mapNumber: maps.mapNumber,
        })
        .from(mapResults)
        .leftJoin(teams, eq(mapResults.teamId, teams.id))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .where(eq(matches.matchNumber, parseInt(matchNumber)))
        .orderBy(matches.matchNumber, maps.mapNumber, mapResults.position);
      
      const mapNames: Record<number, string> = {
        1: 'Bermuda', 2: 'Purgatory', 3: 'Kalahari',
        4: 'NeXTerra', 5: 'Solara', 6: 'Alpine'
      };
      
      const formattedResults = results.map(r => ({
        id: r.id,
        teamId: r.teamId,
        teamName: r.teamName,
        matchNumber: r.matchNumber,
        matchGroup: r.matchGroup,
        mapName: r.mapNumber ? mapNames[r.mapNumber] || 'Bermuda' : 'Bermuda',
        position: r.position,
        kills: r.kills,
        booyah: r.booyah,
        points: r.points,
        createdAt: r.createdAt,
      }));
      
      return NextResponse.json(formattedResults);
    }
    
    if (matchGroup && matchGroup !== 'all') {
      const results = await db
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
          matchGroup: matches.matchGroup,
          mapNumber: maps.mapNumber,
        })
        .from(mapResults)
        .leftJoin(teams, eq(mapResults.teamId, teams.id))
        .leftJoin(maps, eq(mapResults.mapId, maps.id))
        .leftJoin(matches, eq(maps.matchId, matches.id))
        .where(eq(matches.matchGroup, matchGroup))
        .orderBy(matches.matchNumber, maps.mapNumber, mapResults.position);
      
      const mapNames: Record<number, string> = {
        1: 'Bermuda', 2: 'Purgatory', 3: 'Kalahari',
        4: 'NeXTerra', 5: 'Solara', 6: 'Alpine'
      };
      
      const formattedResults = results.map(r => ({
        id: r.id,
        teamId: r.teamId,
        teamName: r.teamName,
        matchNumber: r.matchNumber,
        matchGroup: r.matchGroup,
        mapName: r.mapNumber ? mapNames[r.mapNumber] || 'Bermuda' : 'Bermuda',
        position: r.position,
        kills: r.kills,
        booyah: r.booyah,
        points: r.points,
        createdAt: r.createdAt,
      }));
      
      return NextResponse.json(formattedResults);
    }
    
    const results = await db
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
        matchGroup: matches.matchGroup,
        mapNumber: maps.mapNumber,
      })
      .from(mapResults)
      .leftJoin(teams, eq(mapResults.teamId, teams.id))
      .leftJoin(maps, eq(mapResults.mapId, maps.id))
      .leftJoin(matches, eq(maps.matchId, matches.id))
      .orderBy(matches.matchNumber, maps.mapNumber, mapResults.position);
    
    const mapNames: Record<number, string> = {
      1: 'Bermuda', 2: 'Purgatory', 3: 'Kalahari',
      4: 'NeXTerra', 5: 'Solara', 6: 'Alpine'
    };
    
    const formattedResults = results.map(r => ({
      id: r.id,
      teamId: r.teamId,
      teamName: r.teamName,
      matchNumber: r.matchNumber,
      matchGroup: r.matchGroup,
      mapName: r.mapNumber ? mapNames[r.mapNumber] || 'Bermuda' : 'Bermuda',
      position: r.position,
      kills: r.kills,
      booyah: r.booyah,
      points: r.points,
      createdAt: r.createdAt,
    }));
    
    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Erreur GET match-results:', error);
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
    
    const result = await db
      .select({ mapId: mapResults.mapId })
      .from(mapResults)
      .where(eq(mapResults.id, parseInt(id)))
      .limit(1);
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }
    
    const mapId = result[0].mapId;
    
    await db.delete(mapResults).where(eq(mapResults.id, parseInt(id)));
    
    const remaining = await db
      .select()
      .from(mapResults)
      .where(eq(mapResults.mapId, mapId));
    
    if (remaining.length === 0) {
      await db.delete(maps).where(eq(maps.id, mapId));
    }
    
    await db.delete(rankings);
    
    const allResults = await db
      .select({
        teamId: mapResults.teamId,
        points: mapResults.points,
        kills: mapResults.kills,
        booyah: mapResults.booyah,
      })
      .from(mapResults);
    
    const teamTotals = new Map();
    
    for (const r of allResults) {
      const existing = teamTotals.get(r.teamId) || { points: 0, kills: 0, booyahs: 0, matches: 0 };
      existing.points += r.points;
      existing.kills += r.kills;
      existing.booyahs += r.booyah ? 1 : 0;
      existing.matches += 1;
      teamTotals.set(r.teamId, existing);
    }
    
    for (const [teamId, stats] of teamTotals) {
      await db.insert(rankings).values({
        teamId: teamId as number,
        totalPoints: stats.points,
        totalKills: stats.kills,
        totalBooyahs: stats.booyahs,
        matchesPlayed: stats.matches,
        updatedAt: new Date(),
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}