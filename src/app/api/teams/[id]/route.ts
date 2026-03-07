import { NextResponse } from 'next/server';

export async function GET(
  { }: { params: Promise<{ id: string }> }
) {
  try {
    
    // Votre logique ici
    const count = 0; 
    
    return NextResponse.json({ count: count });
  } catch {
    // Sans le paramètre error
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}