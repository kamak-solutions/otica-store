import type { FastifyInstance } from "fastify";

import { createWidget, listWidgets } from "./widget.controller.js";

import { WidgetService } from "./widget.service.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

type WidgetIdParams = {
  id: string;
};

export async function widgetRoutes(app: FastifyInstance) {
  const service = new WidgetService();

  // Público: usado pela vitrine para renderizar widgets por posição.
  app.get<{
    Params: {
      position: string;
    };
  }>("/widgets/:position", listWidgets);

  // Administrativo: todos os papéis podem consultar.
  app.get(
    "/admin/widgets",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    async (_request, reply) => {
      const data = await service.listAll();

      return reply.send({
        data,
      });
    },
  );

  // Somente owner e admin podem criar.
  app.post(
    "/admin/widgets",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    createWidget,
  );

  // Somente owner pode excluir.
  app.delete<{
    Params: WidgetIdParams;
  }>(
    "/admin/widgets/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    async (request, reply) => {
      const { id } = request.params;

      const data = await service.delete(id);

      return reply.send({
        data,
      });
    },
  );
}
