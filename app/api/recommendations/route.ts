import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RecommendationDTO } from "@/types/recommendation-dto";
import { Recommendation } from "@/models";

export async function GET(_: NextRequest) {
  try {
    const db = await connectToDatabase();

    const recommendations =
      (await db
        .collection("recommendations")
        .find()
        .sort({ createdAt: -1 })
        .toArray()) ?? [];

    const recommendationsDTO = recommendations.map((m) => ({
      ...RecommendationDTO.fromEntity(m as Recommendation),
    }));

    return NextResponse.json(
      { success: true, recommendations: recommendationsDTO },
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
