import { NextResponse } from 'next/server';
import { db } from '@/db/config';

export async function GET() {
  try {
    const result = await db.execute('SELECT NOW()');
    return NextResponse.json({ success: true, time: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}