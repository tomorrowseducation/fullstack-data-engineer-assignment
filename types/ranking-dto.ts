import { z } from "zod";
import { courseDTOSchema } from "./course-dto";

export const rankingDTOSchema = z.object({
  bestCourses: z.array(courseDTOSchema),
  worstCourses: z.array(courseDTOSchema),
});

export type RankingDTO = z.infer<typeof rankingDTOSchema>;
