import { z } from "zod";

export const adminLoginBodySchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres."),
});

export type AdminLoginBody = z.infer<typeof adminLoginBodySchema>;