import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  const db = await connectToDatabase();

  return NextResponse.json(
    {
      success: true,
      engagements: await db.collection("engagements").find().toArray(),
    },
    { status: 200 }
  );
}
export const dynamic = "force-dynamic";
