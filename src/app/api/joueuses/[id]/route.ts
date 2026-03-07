import { NextResponse } from 'next/server';
import { db } from '@/db';
import { joueuses } from '@/db/schema';
import { eq } from 'drizzle-orm';


interface UpdateJoueuseData {
  pseudo_ingame?: string;
  pseudo_facebook?: string;
  pseudo_discord?: string;
  handcam?: string;
  compte_id?: string;
  tournoi_id?: number | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
  
) {
  try {
    const { id } = await params; 
    const joueuseId = parseInt(id);
    
    if (isNaN(joueuseId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const joueuse = await db.select().from(joueuses).where(eq(joueuses.id, joueuseId));
    
    if (joueuse.length === 0) {
      return NextResponse.json({ error: 'Joueuse non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(joueuse[0]);
  } catch (error) {
    console.error('Erreur GET:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {

  
  try {
    const { id } = await params; 
    const joueuseId = parseInt(id);
    
    if (isNaN(joueuseId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json();
    
    console.log('Données reçues pour mise à jour:', body);
    
    const updateData: UpdateJoueuseData = {};
    
    if (body.pseudo_ingame !== undefined) updateData.pseudo_ingame = body.pseudo_ingame;
    if (body.pseudo_facebook !== undefined) updateData.pseudo_facebook = body.pseudo_facebook;
    if (body.pseudo_discord !== undefined) updateData.pseudo_discord = body.pseudo_discord;
    if (body.handcam !== undefined) updateData.handcam = body.handcam;
    
    if (body.tournoi_id !== undefined) {
      const tournoiId = parseInt(body.tournoi_id);
      updateData.tournoi_id = isNaN(tournoiId) ? null : tournoiId;
    }
    
    const updatedJoueuse = await db.update(joueuses)
      .set(updateData)
      .where(eq(joueuses.id, joueuseId))
      .returning();
    
    if (updatedJoueuse.length === 0) {
      return NextResponse.json({ error: 'Joueuse non trouvée' }, { status: 404 });
    }
    
    console.log('Mise à jour réussie:', updatedJoueuse[0]);
    return NextResponse.json(updatedJoueuse[0]);
  } catch (error) {
    console.error('Erreur PUT détaillée:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la mise à jour',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const joueuseId = parseInt(id);
    
    if (isNaN(joueuseId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }
    
    console.log('Suppression de la joueuse ID:', joueuseId);
    
    const deletedJoueuse = await db.delete(joueuses)
      .where(eq(joueuses.id, joueuseId))
      .returning();
    
    if (deletedJoueuse.length === 0) {
      return NextResponse.json({ error: 'Joueuse non trouvée' }, { status: 404 });
    }
    
    console.log('Suppression réussie:', deletedJoueuse[0]);
    return NextResponse.json({ message: 'Joueuse supprimée avec succès' });
  } catch (error) {
    console.error('Erreur DELETE détaillée:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}