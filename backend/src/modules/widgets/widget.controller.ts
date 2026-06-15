import { FastifyReply, FastifyRequest } from "fastify";
import { WidgetService } from "./widget.service.js";
import { createWidgetSchema } from "./widget.schema.js";

const service = new WidgetService();

export async function listWidgets(req: FastifyRequest, reply: FastifyReply) {
  const { position } = req.params as {
    position: string;
  };

  const widgets = await service.listPublic(position);

  return reply.send({
    data: widgets,
  });
}
export async function createWidget(req: FastifyRequest, reply: FastifyReply) {
  const data = createWidgetSchema.parse(req.body);

  const widget = await service.create(data);

  return reply.send({
    data: widget,
  });
  
}

export async function deleteWidget(request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  
}