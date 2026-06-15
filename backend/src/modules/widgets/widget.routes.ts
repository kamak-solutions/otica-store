import { FastifyInstance } from "fastify";

import { listWidgets, createWidget } from "./widget.controller.js";

import { WidgetService } from "./widget.service.js";

export async function widgetRoutes(app: FastifyInstance) {
  const service = new WidgetService();

  app.get("/widgets/:position", listWidgets);

  app.get("/admin/widgets", async (req, reply) => {
    const data = await service.listAll();

    return reply.send({
      data,
    });
  });

  app.post("/admin/widgets", createWidget);


  app.delete("/admin/widgets/:id", async (req, reply) => {
    const { id } = req.params as {
      id: string;
    };

    const data = await service.delete(id);

    return reply.send({
      data,
    });
  });
}