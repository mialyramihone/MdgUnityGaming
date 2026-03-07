import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tournois } from '@/db/schema';

export async function GET() {
  try {
    const allTournois = await db.select().from(tournois);
    return NextResponse.json(allTournois);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération des tournois' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      titre,
      jeu,
      description,
      format,
      cash_prize,
      places,
      date,
      status 
    } = body;

    if (!titre || !jeu || !format || !places || !date) {
      return NextResponse.json(
        { error: 'Champs requis manquants' }, 
        { status: 400 }
      );
    }

    const values = {
      titre,
      jeu,
      description: description || null,
      format,
      cash_prize: cash_prize || null,
      places: parseInt(places),
      participants: 0,
      date: new Date(date),
      status: status || 'ouvert',
      date_creation: new Date(),
    };

    const newTournoi = await db.insert(tournois).values(values).returning();
    return NextResponse.json(newTournoi[0], { status: 201 });
    
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création du tournoi' }, 
      { status: 500 }
    );
  }
}