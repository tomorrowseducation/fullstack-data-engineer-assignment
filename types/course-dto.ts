import { Course, CourseSchema } from "@/models";
import { z } from "zod";

export const courseDTOSchema = z.object({
  id: z.string(),
  title: CourseSchema.shape.title,
  avgTimeSpent: z.number(),
});

export type CourseDTO = z.infer<typeof courseDTOSchema>;
export const CourseDTO = {
  fromEntity(entity: Course): CourseDTO {
    return courseDTOSchema.parse({
      id: entity._id.toHexString(),
      title: entity.title,
      avgTimeSpent: 0,
    });
  },
};
