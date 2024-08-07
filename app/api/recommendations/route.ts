import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(_: NextRequest) {
  try {
    const db = await connectToDatabase();

    const recommendations =
      (await db
        .collection("recommendations")
        .find()
        .sort({ createdAt: -1 })
        .toArray()) ?? [];

    return NextResponse.json(
      { success: true, recommendations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get recommendations", error);
    return NextResponse.json(
      { success: false, error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
