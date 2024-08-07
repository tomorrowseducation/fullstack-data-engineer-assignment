import { connectToDatabase } from "@/lib/mongodb";
import { generateSeedData } from "@/lib/seed-data";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectToDatabase();
  await generateSeedData(db);

  return NextResponse.json({ success: true }, { status: 200 });
}

export const dynamic = "force-dynamic";
