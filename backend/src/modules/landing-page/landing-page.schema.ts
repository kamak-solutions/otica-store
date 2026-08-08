import { z } from "zod";

export const landingPageParamsSchema = z.object({
  id: z.string().uuid(),
});

export const landingPageSectionInputSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const createLandingPageSchema = z.object({
  title: z.string().min(1).max(200),

  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug inválido. Use apenas letras minúsculas, números e hífens.",
    ),

  active: z.boolean().optional(),

  theme: z.string().max(50).optional(),

  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor primária inválida.")
    .optional(),

  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor secundária inválida.")
    .optional(),

  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor de fundo inválida.")
    .optional(),

  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor do texto inválida.")
    .optional(),

  heroBadge: z.string().trim().max(80).default("OFERTA ESPECIAL"),

  fontFamily: z.string().max(100).optional(),

  heroTitle: z.string().min(1).max(300),

  heroSubtitle: z.string().max(1000).optional(),

  heroBannerUrl: z
    .string()
    .url("URL da imagem do Hero inválida.")
    .max(2048)
    .optional(),

  heroBannerPublicId: z.string().max(255).nullable().optional(),

  ctaText: z.string().max(200).optional(),

  whatsappNumber: z.string().min(1).max(30),

  whatsappMessage: z.string().max(1000).optional(),

  sections: z.array(landingPageSectionInputSchema).optional(),
});

export const updateLandingPageSchema = createLandingPageSchema.partial();

export type LandingPageParams = z.infer<typeof landingPageParamsSchema>;

export type CreateLandingPageBody = z.infer<typeof createLandingPageSchema>;

export type UpdateLandingPageBody = z.infer<typeof updateLandingPageSchema>;
