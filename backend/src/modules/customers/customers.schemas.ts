import { z } from "zod";

const crmStatusSchema = z.enum(["lead", "prospect", "customer", "inactive"]);

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isAdult(birthDate: string) {
  const date = new Date(`${birthDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  if (date > today) {
    return false;
  }

  let age = today.getUTCFullYear() - date.getUTCFullYear();

  const currentMonth = today.getUTCMonth();
  const birthMonth = date.getUTCMonth();

  const hasNotHadBirthday =
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && today.getUTCDate() < date.getUTCDate());

  if (hasNotHadBirthday) {
    age -= 1;
  }

  return age >= 18;
}

export const createAdminCustomerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome precisa ter no mínimo 3 caracteres.")
    .max(120, "Nome muito longo."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido.")
    .max(160, "E-mail muito longo."),

  phone: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (phone) => phone.length >= 10 && phone.length <= 11,
      "Telefone inválido.",
    ),

  cpf: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine((cpf) => cpf.length === 11, "CPF inválido.")
    .optional(),

  birthDate: z
    .string()
    .date("Data de nascimento inválida.")
    .refine(isAdult, "O cliente deve ser maior de idade.")
    .optional(),

  zipcode: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine((zipcode) => zipcode.length === 8, "CEP inválido."),

  state: z
    .string()
    .trim()
    .toUpperCase()
    .length(2, "Estado deve conter a sigla com 2 letras."),

  street: z.string().trim().min(2).max(160),
  number: z.string().trim().min(1).max(30),
  complement: z.string().trim().max(120).optional(),
  district: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),

  crmStatus: crmStatusSchema.optional(),

  lgpdAccepted: z.literal(true, {
    error: "É necessário registrar o aceite LGPD.",
  }),

  lgpdConsentSource: z.string().trim().min(2).max(60).optional(),
});

export const updateCustomerCrmStatusBodySchema = z.object({
  crmStatus: crmStatusSchema,
});

export const customerIdParamsSchema = z.object({
  id: z.string().uuid("ID do cliente inválido."),
});

export type CreateAdminCustomerBody = z.infer<
  typeof createAdminCustomerBodySchema
>;

export type UpdateCustomerCrmStatusBody = z.infer<
  typeof updateCustomerCrmStatusBodySchema
>;

export type CustomerIdParams = z.infer<typeof customerIdParamsSchema>;

export type CustomerCrmStatus = z.infer<typeof crmStatusSchema>;
