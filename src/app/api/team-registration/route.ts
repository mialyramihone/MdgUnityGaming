import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams } from '@/db/schema';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    
    let paymentImagePath = null;
    const paymentImage = formData.get('paymentImage') as File | null;
    
    if (paymentImage && paymentImage.size > 0) {
      const bytes = await paymentImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `payment-${Date.now()}-${paymentImage.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      paymentImagePath = `/uploads/${fileName}`;
    }
    
    
    const teamName = formData.get('teamName') as string;
    const teamTag = formData.get('teamTag') as string;
    const captainName = formData.get('captainName') as string;
    const captainLink = formData.get('captainLink') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentRef = formData.get('paymentRef') as string;
    const paymentDate = formData.get('paymentDate') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const termsAccepted = formData.get('termsAccepted') === 'true';
    const rulesAccepted = formData.get('rulesAccepted') === 'true';
    
    
    const registrationCode = `TT4-${Date.now().toString().slice(-8)}`;
    
    
    const [team] = await db.insert(teams).values({
      teamName,
      teamTag: teamTag || null,
      captainName,
      captainLink,
      registrationCode,
      paymentMethod,
      paymentRef,
      paymentDate: new Date(paymentDate),
      paymentImage: paymentImagePath,
      tournamentId: parseInt(tournamentId),
      termsAccepted,
      rulesAccepted,
      status: 'confirmed',
    }).returning();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inscription réussie',
      registrationCode,
      teamId: team.id 
    });
    
  } catch (error) {
    console.error("🔴 ERREUR:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}