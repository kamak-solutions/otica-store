import { z } from "zod";

const optionalTextSchema = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => value || undefined);

const degreeSchema = z
  .string()
  .trim()
  .regex(
    /^[+-]?\d{1,2}([.,]\d{1,2})?$/,
    "Grau deve ser um número válido.",
  )
  .transform((value) => value.replace(",", "."))
  .optional();

const axisSchema = z
  .string()
  .trim()
  .regex(/^\d{1,3}$/, "Eixo deve ser um número inteiro.")
  .refine(
    (value) => {
      const axis = Number(value);

      return axis >= 0 && axis <= 180;
    },
    "Eixo deve estar entre 0 e 180 graus.",
  )
  .optional();

const measurementSchema = z
  .string()
  .trim()
  .regex(
    /^\d{1,3}([.,]\d{1,2})?$/,
    "Medida deve ser um número válido.",
  )
  .transform((value) => value.replace(",", "."))
  .optional();

export const customerPrescriptionParamsSchema = z.object({
  customerId: z.string().uuid("ID do cliente inválido."),
});

export const createPrescriptionBodySchema = z
  .object({
    examDate: z
      .string()
      .date("Data do exame inválida.")
      .optional(),

    expiresAt: z
      .string()
      .date("Data de validade inválida.")
      .optional(),

    rightSpherical: degreeSchema,
    rightCylindrical: degreeSchema,
    rightAxis: axisSchema,

    leftSpherical: degreeSchema,
    leftCylindrical: degreeSchema,
    leftAxis: axisSchema,

    addition: degreeSchema,
    pupillaryDistance: measurementSchema,
    height: measurementSchema,

    doctorName: z
      .string()
      .trim()
      .min(3, "Nome do profissional muito curto.")
      .max(120, "Nome do profissional muito longo.")
      .optional(),

    doctorCrm: z
      .string()
      .trim()
      .max(40, "Registro profissional muito longo.")
      .optional(),

    notes: optionalTextSchema,
  })
  .superRefine((data, context) => {
    const hasPrescriptionData =
      data.rightSpherical !== undefined ||
      data.rightCylindrical !== undefined ||
      data.rightAxis !== undefined ||
      data.leftSpherical !== undefined ||
      data.leftCylindrical !== undefined ||
      data.leftAxis !== undefined ||
      data.addition !== undefined ||
      data.pupillaryDistance !== undefined ||
      data.height !== undefined;

    if (!hasPrescriptionData) {
      context.addIssue({
        code: "custom",
        path: ["rightSpherical"],
        message: "Informe ao menos um dado da receita óptica.",
      });
    }

    if (data.examDate) {
      const examDate = new Date(`${data.examDate}T00:00:00.000Z`);
      const today = new Date();

      if (examDate.getTime() > today.getTime()) {
        context.addIssue({
          code: "custom",
          path: ["examDate"],
          message: "A data do exame não pode estar no futuro.",
        });
      }
    }

    if (data.examDate && data.expiresAt) {
      const examDate = new Date(`${data.examDate}T00:00:00.000Z`);
      const expiresAt = new Date(`${data.expiresAt}T00:00:00.000Z`);

      if (expiresAt <= examDate) {
        context.addIssue({
          code: "custom",
          path: ["expiresAt"],
          message:
            "A validade deve ser posterior à data do exame.",
        });
      }
    }

    if (
      data.rightCylindrical !== undefined &&
      data.rightAxis === undefined
    ) {
      context.addIssue({
        code: "custom",
        path: ["rightAxis"],
        message:
          "Informe o eixo quando houver cilindro no olho direito.",
      });
    }

    if (
      data.leftCylindrical !== undefined &&
      data.leftAxis === undefined
    ) {
      context.addIssue({
        code: "custom",
        path: ["leftAxis"],
        message:
          "Informe o eixo quando houver cilindro no olho esquerdo.",
      });
    }
  });

export type CustomerPrescriptionParams = z.infer<
  typeof customerPrescriptionParamsSchema
>;

export type CreatePrescriptionBody = z.infer<
  typeof createPrescriptionBodySchema
>;