import { z } from "zod";

export const metricDTOSchema = z.object({
  effectiveness: z.number(),
});

export type MetricDTO = z.infer<typeof metricDTOSchema>;
