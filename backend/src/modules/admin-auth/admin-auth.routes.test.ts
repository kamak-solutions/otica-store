import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

describe("Admin auth routes", () => {
  it("should reject invalid login payload", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/admin/auth/login",
      headers: {
        origin: "http://localhost:5173",
      },
      payload: {
        email: "email-invalido",
        password: "123",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body).toEqual(
      expect.objectContaining({
        error: "Validation error",
        message: "Dados inválidos.",
      }),
    );
  });

  it("should reject invalid admin credentials", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/admin/auth/login",
      headers: {
        origin: "http://localhost:5173",
      },
      payload: {
        email: "admin@oticashowroom.com",
        password: "senha-incorreta-teste",
      },
    });

    expect(response.statusCode).toBe(401);

    const body = response.json();

    expect(body).toEqual(
      expect.objectContaining({
        error: "Unauthorized",
        message: "E-mail ou senha inválidos.",
      }),
    );
  });
});
