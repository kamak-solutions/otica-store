import { z } from "zod";

export const landingPageParamsSchema = z.object({
  id: z.string().uuid(),
});

export const landingPageSectionInputSchema = z.object({
  type: z.string().max(50).optional(),
  title: z.string().max(200).optional(),
  subtitle: z.string().max(500).optional(),
  content: z.string().max(5000).optional(),
  imageUrl: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  buttonText: z.string().max(200).optional(),
  buttonLink: z.string().max(2048).optional(),
  bgColor: z.string().max(100).optional(),
  textColor: z.string().max(100).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
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
    .regex(
      /^(#[0-9A-Fa-f]{6}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\))$/,
      "Cor primária inválida.",
    )
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
    .nullable()
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
