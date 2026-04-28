export async function healthRoutes(app) {
  app.get("/health", async (request, reply) => {
    request.log.info("Health check requested");

    return reply.send({
      status: "ok",
      service: "otica-showroom-api",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  });
}