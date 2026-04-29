import type { FastifyReply, FastifyRequest } from "fastify";
import { loginAdmin } from "./admin-auth.service.js";
import {
  adminLoginBodySchema,
  type AdminLoginBody,
} from "./admin-auth.schemas.js";

export async function adminLoginController(
  request: FastifyRequest<{
    Body: AdminLoginBody;
  }>,
  reply: FastifyReply,
) {
  const body = adminLoginBodySchema.parse(request.body);

  request.log.info({ email: body.email }, "Admin login attempt");

  const { admin, token } = await loginAdmin(body);

  return reply.send({
    data: {
      admin,
      token,
    },
    message: "Login realizado com sucesso.",
  });
}