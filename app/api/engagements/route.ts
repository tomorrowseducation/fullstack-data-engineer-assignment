import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EngagementDTO } from "@/types/engagement-dto";
import { Engagement } from "@/models";
import { ZodError } from "zod";

export async function GET() {
  try {
    const db = await connectToDatabase();

    // Fetch engagements and referenced collections using MongoDB aggregation pipeline
    const engagements = await db
      .collection("engagements")
      .aggregate([
        {
          $lookup: {
            from: "users",
            let: { id: { $toObjectId: "$userId" } }, // compare ObjectId here
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }],
            as: "user",
          },
        },
        {
          $lookup: {
            from: "courses",
            let: { id: { $toObjectId: "$courseId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }],
            as: "course",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              // merge additional data into root object
              $mergeObjects: [
                { $arrayElemAt: ["$user", 0] },
                { $arrayElemAt: ["$course", 0] },
                "$$ROOT",
              ],
            },
          },
        },
      ])
      .toArray();

    // Enrich engagement data with rest of data
    const engagementsDTO = engagements.map((m) => {
      return {
        ...EngagementDTO.fromEntity(m as Engagement),
        userName: m?.name || "Unknown user",
        courseTitle: m?.title || "Unknown course",
      };
    });

    return NextResponse.json({
      success: true,
      engagements: engagementsDTO,
      status: 200,
    });
  } catch (error) {
    console.log("Failed to get engagements", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { sucess: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to get engagements" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";