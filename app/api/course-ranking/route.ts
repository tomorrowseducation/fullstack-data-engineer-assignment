import { connectToDatabase } from "@/lib/mongodb";
import { Course } from "@/models";
import { CourseDTO } from "@/types/course-dto";
import { BSON } from "mongodb";
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
          _id: { $toObjectId: "$_id" },
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

    // Map to DTO(s)
    const bestCourses = ranking.bestCourses.map((m: BSON.Document) => ({
      ...CourseDTO.fromEntity(m as Course),
      avgTimeSpent: m.avgTimeSpent,
    }));

    const worstCourses = ranking.worstCourses.map((m: BSON.Document) => ({
      ...CourseDTO.fromEntity(m as Course),
      avgTimeSpent: m.avgTimeSpent,
    }));

    return NextResponse.json(
      {
        success: true,
        ranking: {
          bestCourses,
          worstCourses,
        },
      },
      { status: 200 }
    );
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
