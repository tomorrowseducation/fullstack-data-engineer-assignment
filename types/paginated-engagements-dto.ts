import { z } from "zod";
import { engagementDTOSchema } from "./engagement-dto";

export const paginatedEngagementsDTOSchema = z.object({
  items: z.array(engagementDTOSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export type PaginatedEngagementsDTO = z.infer<
  typeof paginatedEngagementsDTOSchema
>;
