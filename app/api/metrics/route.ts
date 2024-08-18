import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const db = await connectToDatabase();

    // Calculate the number of followed recommendations for the same userId and courseId.
    const [followedRecommendations] = await db
      .collection("recommendations")
      .aggregate([
        {
          // split aggregation into 2 pipelines, followed recommendations & total
          $facet: {
            followedRecommendations: [
              {
                $lookup: {
                  from: "engagements",
                  let: {
                    recommendationUserId: "$userId",
                    recommendationCourseId: "$courseId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$userId", "$$recommendationUserId"] },
                            { $eq: ["$courseId", "$$recommendationCourseId"] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "followedRecommendations",
                },
              },
              {
                $match: { "followedRecommendations.0": { $exists: true } },
              },
              {
                $count: "count",
              },
            ],
            totalRecommendations: [
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $project: {
            followed: {
              $arrayElemAt: ["$followedRecommendations.count", 0],
            },
            total: {
              $arrayElemAt: ["$totalRecommendations.count", 0],
            },
          },
        },
      ])
      .toArray();

    // Effectiveness here is assumed as how often a recommended course is engaged.
    const effectiveness = Math.round(
      (followedRecommendations.followed / followedRecommendations.total) * 100
    );

    return NextResponse.json(
      {
        success: true,
        metric: { effectiveness },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get metrics", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to get metrics." },
      { status: 500 }
    );
  }
}