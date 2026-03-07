import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';

export async function GET() {
  try {
    const allTeams = await db.select().from(teams);
    return NextResponse.json(allTeams);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}