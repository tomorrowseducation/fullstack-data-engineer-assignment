import { Engagement, EngagementSchema } from "@/models";
import { z } from "zod";

export const engagementDTOSchema = z.object({
  id: z.string(),
  userName: z.string(),
  courseTitle: z.string(),
  timestamp: EngagementSchema.shape.timestamp,
  timeSpent: EngagementSchema.shape.timeSpent,
});

// Companion object pattern (type and object literals named equal)
export type EngagementDTO = z.infer<typeof engagementDTOSchema>;
export const EngagementDTO = {
  fromEntity(entity: Engagement): EngagementDTO {
    return engagementDTOSchema.parse({
      id: entity._id.toHexString(),
      timestamp: entity.timestamp,
      timeSpent: entity.timeSpent,
      userName: '',
      courseTitle: '',
    });
  },
};