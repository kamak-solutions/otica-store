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
