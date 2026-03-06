import { NextResponse } from 'next/server';
import { db } from '@/db';
import { joueuses } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      compte_id, 
      pseudo_ingame, 
      pseudo_facebook, 
      pseudo_discord, 
      handcam,
      tournoi_id 
    } = body;

    // Préparer les valeurs avec les bons types
    const values = {
      compte_id: compte_id,
      pseudo_ingame: pseudo_ingame,
      pseudo_facebook: pseudo_facebook,
      pseudo_discord: pseudo_discord,
      handcam: handcam || 'Non',
      tournoi_id: tournoi_id ? parseInt(tournoi_id) : null,
      date_inscription: new Date(),
    };

    const newJoueuse = await db.insert(joueuses).values(values).returning();

    return NextResponse.json(newJoueuse[0], { status: 201 });
  } catch {
    
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allJoueuses = await db.select().from(joueuses);
    return NextResponse.json(allJoueuses);
  } catch {
    
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}