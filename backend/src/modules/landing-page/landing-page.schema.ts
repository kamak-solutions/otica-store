import { z } from "zod";

export const landingPageParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createLandingPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  heroTitle: z.string().min(1),
  whatsappNumber: z.string().min(1),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

export const updateLandingPageSchema = createLandingPageSchema.partial();

export type LandingPageParams = z.infer<typeof landingPageParamsSchema>;
export type CreateLandingPageBody = z.infer<typeof createLandingPageSchema>;
export type UpdateLandingPageBody = z.infer<typeof updateLandingPageSchema>;