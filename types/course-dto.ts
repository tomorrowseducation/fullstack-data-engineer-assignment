import { CourseSchema } from "@/models";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const courseDTOSchema = z.object({
  _id: z.instanceof(ObjectId),
  title: CourseSchema.shape.title,
  avgTimeSpent: z.number(),
});

export type CourseDTO = z.infer<typeof courseDTOSchema>;
