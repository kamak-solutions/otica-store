import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

const protectedRoutes = [
  "/admin/products",
  "/admin/orders",
  "/admin/quote-requests",
  "/admin/audit-logs",
];

describe("Admin RBAC routes", () => {
  it.each(protectedRoutes)(
    "should reject request without token on %s",
    async (url) => {
      const response = await app.inject({
        method: "GET",
        url,
        headers: {
          origin: "http://localhost:5173",
        },
      });

      expect(response.statusCode).toBe(401);

      const body = response.json();

      expect(body).toEqual(
        expect.objectContaining({
          error: "Unauthorized",
          message: "Token não informado.",
        }),
      );
    },
  );

  it.each(protectedRoutes)(
    "should reject request with invalid token on %s",
    async (url) => {
      const response = await app.inject({
        method: "GET",
        url,
        headers: {
          origin: "http://localhost:5173",
          authorization: "Bearer token-falso",
        },
      });

      expect(response.statusCode).toBe(401);

      const body = response.json();

      expect(body).toEqual(
        expect.objectContaining({
          error: "Unauthorized",
          message: "Token inválido ou expirado.",
        }),
      );
    },
  );
});
