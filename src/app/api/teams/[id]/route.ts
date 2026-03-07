import {  NextResponse } from "next/server";

export async function GET(
  
) {
  try {

    const count = 0;

    return NextResponse.json({ count });

  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}