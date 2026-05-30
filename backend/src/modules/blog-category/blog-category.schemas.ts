import { z } from "zod";

export const blogCategorySchema = z.object({
  name: z
    .string()
    .min(2),

  description: z
    .string()
    .optional(),

  position: z
    .number()
    .default(0),

  active: z
    .boolean()
    .default(true),
});