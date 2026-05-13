import { z } from "zod";

export const adminUserRoleSchema = z.enum([
  "owner",
  "admin",
  "collaborator",
  "viewer",
]);

export const createAdminUserBodySchema = z.object({
  name: z.string().min(2, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(8, "Senha precisa ter no mínimo 8 caracteres."),
  role: adminUserRoleSchema,
});

export const adminUserIdParamsSchema = z.object({
  id: z.string().uuid("ID do usuário inválido."),
});

export const updateAdminUserRoleBodySchema = z.object({
  role: adminUserRoleSchema,
});

export const updateAdminUserActiveBodySchema = z.object({
  active: z.boolean(),
});

export type CreateAdminUserBody = z.infer<typeof createAdminUserBodySchema>;
export type AdminUserIdParams = z.infer<typeof adminUserIdParamsSchema>;
export type UpdateAdminUserRoleBody = z.infer<
  typeof updateAdminUserRoleBodySchema
>;
export type UpdateAdminUserActiveBody = z.infer<
  typeof updateAdminUserActiveBodySchema
>;
