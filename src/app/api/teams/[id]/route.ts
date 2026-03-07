import { NextResponse } from 'next/server';

export async function GET(
  { }: { params: { id: string } }
) {
  try {


    const count = 0;

    return NextResponse.json({ count });
    
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}