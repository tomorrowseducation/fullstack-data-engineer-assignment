import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EngagementDTO } from "@/types/engagement-dto";
import { Engagement } from "@/models";
import { ZodError } from "zod";
import { BSON } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const skip = (page - 1) * pageSize;

    // Fetch engagements and referenced collections using MongoDB aggregation pipeline
    const [engagements] = await db
      .collection("engagements")
      .aggregate([
        {
          $facet: {
            items: [
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
              {
                $skip: skip,
              },
              {
                $limit: pageSize,
              },
            ],
            total: [{ $count: "count" }],
          },
        },
      ])
      .toArray();

    // Enrich engagement data with rest of data
    const engagementsDTO = engagements.items.map((m: BSON.Document) => {
      return {
        ...EngagementDTO.fromEntity(m as Engagement),
        userName: m?.name || "Unknown user",
        courseTitle: m?.title || "Unknown course",
      };
    });

    return NextResponse.json({
      success: true,
      engagements: {
        items: engagementsDTO,
        page,
        pageSize,
        total: engagements.total[0].count,
      },
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