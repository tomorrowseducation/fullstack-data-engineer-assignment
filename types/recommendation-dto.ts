import { Recommendation, RecommendationSchema } from "@/models";
import { z } from "zod";

export const recommendationDTOSchema = z.object({
  id: z.string(),
  userId: RecommendationSchema.shape.userId,
  courseId: RecommendationSchema.shape.courseId,
  createdAt: RecommendationSchema.shape.createdAt,
});

export type RecommendationDTO = z.infer<typeof recommendationDTOSchema>;
export const RecommendationDTO = {
  fromEntity(entity: Recommendation): RecommendationDTO {
    return recommendationDTOSchema.parse({
      id: entity._id.toHexString(),
      userId: entity.userId,
      courseId: entity.courseId,
      createdAt: entity.createdAt,
    });
  },
};
