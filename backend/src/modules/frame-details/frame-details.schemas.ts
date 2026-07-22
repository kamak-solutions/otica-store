import { z } from "zod";

const optionalText = (maximumLength: number) =>
  z
    .string()
    .trim()
    .max(maximumLength)
    .optional()
    .transform((value) => value || undefined);

export const productFrameDetailsParamsSchema = z.object({
  productId: z.string().uuid("ID do produto inválido."),
});

export type ProductFrameDetailsParams = z.infer<
  typeof productFrameDetailsParamsSchema
>;

const frameDetailsBaseSchema = z.object({
  supplierId: z.string().uuid("ID do fornecedor inválido."),

  collectionId: z
    .string()
    .uuid("ID da coleção inválido.")
    .optional(),

  supplierCode: optionalText(80),

  internalCode: z
    .string()
    .trim()
    .min(3, "Código interno é obrigatório.")
    .max(80, "Código interno muito longo.")
    .transform((value) => value.toUpperCase()),

  modelCode: z
    .string()
    .trim()
    .min(2, "Código do modelo é obrigatório.")
    .max(80, "Código do modelo muito longo.")
    .transform((value) => value.toUpperCase()),

  publicBrand: z
    .string()
    .trim()
    .min(2, "Marca pública é obrigatória.")
    .max(120, "Marca pública muito longa.")
    .default("Ótica Show Room"),

  audience: z.enum([
    "masculino",
    "feminino",
    "unissex",
    "infantil",
  ]),

  material: z.enum([
    "acetato",
    "metal",
    "titanio",
    "tr90",
    "nylon",
    "flexivel",
  ]),

  shape: z.enum([
    "retangular",
    "redondo",
    "quadrado",
    "gatinho",
    "aviador",
    "hexagonal",
    "oval",
    "borboleta",
    "geometrico",
  ]),

  primaryColor: z
    .string()
    .trim()
    .min(2, "Cor principal é obrigatória.")
    .max(80, "Cor principal muito longa."),

  secondaryColor: optionalText(80),

  finish: z.enum(["brilho", "fosco"]).optional(),

  lensWidth: z.coerce
    .number()
    .int("A largura da lente precisa ser um número inteiro.")
    .min(20, "A largura da lente precisa ser maior ou igual a 20.")
    .max(90, "A largura da lente precisa ser menor ou igual a 90.")
    .optional(),

  bridgeWidth: z.coerce
    .number()
    .int("A largura da ponte precisa ser um número inteiro.")
    .min(5, "A largura da ponte precisa ser maior ou igual a 5.")
    .max(40, "A largura da ponte precisa ser menor ou igual a 40.")
    .optional(),

  templeLength: z.coerce
    .number()
    .int("O comprimento da haste precisa ser um número inteiro.")
    .min(80, "O comprimento da haste precisa ser maior ou igual a 80.")
    .max(200, "O comprimento da haste precisa ser menor ou igual a 200.")
    .optional(),

  sizeLabel: optionalText(30),
});

type FrameMeasurements = {
  lensWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
};

function validateMeasurements(
  data: FrameMeasurements,
  context: z.RefinementCtx,
) {
  const measurements = [
    data.lensWidth,
    data.bridgeWidth,
    data.templeLength,
  ];

  const informedMeasurements = measurements.filter(
    (value) => value !== undefined,
  ).length;

  if (informedMeasurements > 0 && informedMeasurements < 3) {
    context.addIssue({
      code: "custom",
      path: ["lensWidth"],
      message:
        "Informe largura da lente, ponte e haste em conjunto.",
    });
  }
}

export const createFrameDetailsBodySchema =
  frameDetailsBaseSchema.superRefine(validateMeasurements);

export type CreateFrameDetailsBody = z.infer<
  typeof createFrameDetailsBodySchema
>;

export const updateFrameDetailsBodySchema = frameDetailsBaseSchema
  .partial()
  .superRefine(validateMeasurements)
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type UpdateFrameDetailsBody = z.infer<
  typeof updateFrameDetailsBodySchema
>;