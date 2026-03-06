import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT 1 as test');
    return NextResponse.json({ connected: true, result });
  } catch (error) {
    return NextResponse.json({ 
      connected: false, 
      error: String(error) 
    }, { status: 500 });
  }
}