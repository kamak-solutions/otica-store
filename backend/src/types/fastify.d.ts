import type { AdminJwtPayload } from "../lib/admin-jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    admin?: AdminJwtPayload;
  }
}
