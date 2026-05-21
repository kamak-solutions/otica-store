import { z } from "zod";

export const storefrontHeroSlideIdParamsSchema = z.object({
  id: z.string().min(1, "ID do slide é obrigatório."),
});

export const updateStorefrontHeroSlideBodySchema = z.object({
  kicker: z.string().min(1, "Chamada é obrigatória.").optional(),
  title: z.string().min(1, "Título é obrigatório.").optional(),
  description: z.string().min(1, "Descrição é obrigatória.").optional(),
  imageUrl: z.string().url("URL da imagem inválida.").optional(),
  primaryAction: z
    .string()
    .min(1, "Texto do botão principal é obrigatório.")
    .optional(),
  secondaryAction: z
    .string()
    .min(1, "Texto do botão secundário é obrigatório.")
    .optional(),
  position: z.coerce.number().int().min(0).optional(),
  active: z.boolean().optional(),
});
export const storefrontBannerIdParamsSchema = z.object({
  id: z.string().min(1, "ID do banner é obrigatório."),
});
export const updateStorefrontBannerBodySchema = z.object({
  kicker: z.string().min(1, "Chamada é obrigatória.").optional(),
  title: z.string().min(1, "Título é obrigatório.").optional(),
  description: z.string().min(1, "Descrição é obrigatória.").optional(),
  buttonLabel: z.string().min(1, "Texto do botão é obrigatório.").optional(),
  buttonHref: z.string().min(1, "Link do botão é obrigatório.").optional(),
  imageUrl: z.string().url("URL da imagem inválida.").nullable().optional(),
  imagePosition: z
    .enum([
      "center",
      "top",
      "bottom",
      "left",
      "right",
      "center top",
      "center bottom",
    ])
    .optional(),
  active: z.boolean().optional(),
});
export const updateStorefrontThemeBodySchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor principal inválida.")
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor secundária inválida.")
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor de destaque inválida.")
    .optional(),

  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor de fundo inválida.")
    .optional(),
  surfaceColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor dos cards inválida.")
    .optional(),
  titleColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor dos títulos inválida.")
    .optional(),
  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor dos textos inválida.")
    .optional(),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor das bordas inválida.")
    .optional(),
  buttonTextColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor do texto dos botões inválida.")
    .optional(),
  bannerContentOpacity: z.coerce
    .number()
    .int()
    .min(20, "A transparência mínima é 20.")
    .max(95, "A transparência máxima é 95.")
    .optional(),
});

export type StorefrontHeroSlideIdParams = z.infer<
  typeof storefrontHeroSlideIdParamsSchema
>;

export type UpdateStorefrontHeroSlideBody = z.infer<
  typeof updateStorefrontHeroSlideBodySchema
>;
export const createStorefrontHeroSlideBodySchema = z.object({
  kicker: z.string().min(1, "Chamada é obrigatória."),
  title: z.string().min(1, "Título é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  imageUrl: z.string().url("URL da imagem inválida."),
  primaryAction: z.string().min(1, "Texto do botão principal é obrigatório."),
  secondaryAction: z
    .string()
    .min(1, "Texto do botão secundário é obrigatório."),
  position: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});
export type CreateStorefrontHeroSlideBody = z.infer<
  typeof createStorefrontHeroSlideBodySchema
>;
export type StorefrontBannerIdParams = z.infer<
  typeof storefrontBannerIdParamsSchema
>;

export type UpdateStorefrontBannerBody = z.infer<
  typeof updateStorefrontBannerBodySchema
>;
export type UpdateStorefrontThemeBody = z.infer<
  typeof updateStorefrontThemeBodySchema
>;
