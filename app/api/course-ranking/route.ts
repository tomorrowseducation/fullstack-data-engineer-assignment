import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const db = await connectToDatabase();

    // Determine the best and worst courses based on AVG timeSpent.
    const pipeline = [
      // group by courseId
      {
        $group: {
          _id: "$courseId",
          avgTimeSpent: { $avg: "$timeSpent" },
        },
      },
      // join with course details
      {
        $lookup: {
          from: "courses",
          let: { courseId: { $toObjectId: "$_id" } },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$courseId"] } },
            },
          ],
          as: "course",
        },
      },
      // merge reference to root
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$course", 0] }, "$$ROOT"],
          },
        },
      },
      // relevant fields
      {
        $project: {
          _id: 1,
          title: 1,
          avgTimeSpent: { $round: ["$avgTimeSpent", 2] },
        },
      },
    ];

    const [ranking] = await db
      .collection("engagements")
      .aggregate([
        {
          // split aggregation into 2 pipelines, best & worst courses
          $facet: {
            bestCourses: [
              ...pipeline,
              { $sort: { avgTimeSpent: -1 } }, // sort descending (best courses)
              { $limit: 3 }, // top 3
            ],
            worstCourses: [
              ...pipeline,
              { $sort: { avgTimeSpent: 1 } }, // sort ascending (worst courses)
              { $limit: 3 }, // top 3
            ],
          },
        },
      ])
      .toArray();

    return NextResponse.json({ success: true, ranking }, { status: 200 });
  } catch (error) {
    console.log("Failed to get course ranking.", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to get course ranking." },
      { status: 500 }
    );
  }
}
