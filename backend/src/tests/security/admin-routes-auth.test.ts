import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { env } from "../../config/env.js";
import { signAdminToken, type AdminRole } from "../../lib/admin-jwt.js";
import { prisma } from "../../lib/prisma.js";

describe("Segurança das rotas administrativas", () => {
  function mockActiveAdmin(data: {
    id: string;
    email: string;
    role: AdminRole;
  }) {
    vi.spyOn(prisma.adminUser, "findUnique").mockResolvedValue({
      id: data.id,
      name: "Administrador de teste",
      email: data.email,
      passwordHash: "hash-nao-utilizado-no-teste",
      role: data.role,
      active: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
  }

  beforeAll(async () => {
    await app.ready();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Categorias", () => {
    it("permite listar categorias sem autenticação", async () => {
      vi.spyOn(prisma.category, "findMany").mockResolvedValue([]);

      const response = await app.inject({
        method: "GET",
        url: "/categories",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        data: [],
      });
    });

    it("impede criar categoria sem token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/admin/categories",
        payload: {
          name: "Categoria não autorizada",
          slug: "categoria-nao-autorizada",
        },
      });

      expect(response.statusCode).toBe(401);

      expect(response.json()).toMatchObject({
        error: "Unauthorized",
        message: "Token não informado.",
      });
    });

    it("impede atualizar categoria sem token", async () => {
      const response = await app.inject({
        method: "PUT",
        url: "/admin/categories/00000000-0000-0000-0000-000000000000",
        payload: {
          name: "Tentativa sem token",
          slug: "tentativa-sem-token",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede excluir categoria sem token", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/admin/categories/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Marcas", () => {
    it("permite listar marcas sem autenticação", async () => {
      vi.spyOn(prisma.brand, "findMany").mockResolvedValue([]);

      const response = await app.inject({
        method: "GET",
        url: "/brands",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        data: [],
      });
    });

    it("impede criar marca sem token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/admin/brands",
        payload: {
          name: "Marca não autorizada",
          slug: "marca-nao-autorizada",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede atualizar marca sem token", async () => {
      const response = await app.inject({
        method: "PUT",
        url: "/admin/brands/00000000-0000-0000-0000-000000000000",
        payload: {
          name: "Tentativa sem token",
          slug: "tentativa-sem-token",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede excluir marca sem token", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/admin/brands/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Laboratórios", () => {
    it("impede listar laboratórios sem token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/admin/laboratories",
      });

      expect(response.statusCode).toBe(401);
    });

    it("mantém removida a antiga rota pública", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/laboratories",
      });

      expect(response.statusCode).toBe(404);
    });

    it("impede criar laboratório sem token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/admin/laboratories",
        payload: {
          name: "Laboratório não autorizado",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede atualizar laboratório sem token", async () => {
      const response = await app.inject({
        method: "PUT",
        url: "/admin/laboratories/00000000-0000-0000-0000-000000000000",
        payload: {
          name: "Tentativa sem token",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede excluir laboratório sem token", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/admin/laboratories/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Widgets", () => {
    it("mantém a rota da vitrine pública", async () => {
      vi.spyOn(prisma.widget, "findMany").mockResolvedValue([]);

      const response = await app.inject({
        method: "GET",
        url: "/widgets/home",
      });

      expect(response.statusCode).toBe(200);
    });

    it("impede listar widgets administrativos sem token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede criar widget sem token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/admin/widgets",
        payload: {},
      });

      expect(response.statusCode).toBe(401);
    });

    it("impede excluir widget sem token", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/admin/widgets/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(401);
    });
  });
  describe("JWT e autorização por papel", () => {
    it("rejeita Authorization malformado", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
        headers: {
          authorization: "Token qualquer-coisa",
        },
      });

      expect(response.statusCode).toBe(401);

      expect(response.json()).toMatchObject({
        error: "Unauthorized",
        message: "Token inválido.",
      });
    });

    it("rejeita Bearer sem token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
        headers: {
          authorization: "Bearer",
        },
      });

      expect(response.statusCode).toBe(401);

      expect(response.json()).toMatchObject({
        error: "Unauthorized",
        message: "Token inválido.",
      });
    });

    it("rejeita token com assinatura inválida", async () => {
      const invalidToken = jwt.sign(
        {
          sub: "00000000-0000-0000-0000-000000000001",
          email: "invasor@example.com",
          role: "owner",
        },
        "segredo-incorreto-usado-no-teste",
        {
          expiresIn: "1h",
        },
      );

      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
        headers: {
          authorization: `Bearer ${invalidToken}`,
        },
      });

      expect(response.statusCode).toBe(401);

      expect(response.json()).toMatchObject({
        error: "Unauthorized",
        message: "Token inválido ou expirado.",
      });
    });

    it("rejeita token expirado", async () => {
      const expiredToken = jwt.sign(
        {
          sub: "00000000-0000-0000-0000-000000000002",
          email: "expired@example.com",
          role: "owner",
        },
        env.ADMIN_JWT_SECRET,
        {
          expiresIn: -1,
        },
      );

      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
        headers: {
          authorization: `Bearer ${expiredToken}`,
        },
      });

      expect(response.statusCode).toBe(401);

      expect(response.json()).toMatchObject({
        error: "Unauthorized",
        message: "Token inválido ou expirado.",
      });
    });

    it("impede viewer de criar categoria", async () => {
      const adminId = "00000000-0000-0000-0000-000000000003";
      const email = "viewer@example.com";

      mockActiveAdmin({
        id: adminId,
        email,
        role: "viewer",
      });

      const viewerToken = signAdminToken({
        sub: adminId,
        email,
        role: "viewer",
      });

      const response = await app.inject({
        method: "POST",
        url: "/admin/categories",
        headers: {
          authorization: `Bearer ${viewerToken}`,
        },
        payload: {
          name: "Categoria bloqueada",
          slug: "categoria-bloqueada",
        },
      });

      expect(response.statusCode).toBe(403);

      expect(response.json()).toMatchObject({
        error: "Forbidden",
        message: "Você não tem permissão para executar esta ação.",
      });
    });
    it("impede admin de excluir marca", async () => {
      const adminId = "00000000-0000-0000-0000-000000000004";
      const email = "admin-teste@example.com";

      mockActiveAdmin({
        id: adminId,
        email,
        role: "admin",
      });

      const adminToken = signAdminToken({
        sub: adminId,
        email,
        role: "admin",
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/admin/brands/00000000-0000-0000-0000-000000000000",
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it("permite viewer listar laboratórios", async () => {
      mockActiveAdmin({
        id: "admin-viewer-id",
        email: "viewer@example.com",
        role: "viewer",
      });

      vi.spyOn(prisma.laboratory, "findMany").mockResolvedValue([]);

      const token = signAdminToken({
        sub: "admin-viewer-id",
        email: "viewer@example.com",
        role: "viewer",
      });

      const response = await app.inject({
        method: "GET",
        url: "/admin/laboratories",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it("permite owner listar widgets administrativos", async () => {
      const adminId = "00000000-0000-0000-0000-000000000006";
      const email = "owner@example.com";

      mockActiveAdmin({
        id: adminId,
        email,
        role: "owner",
      });

      vi.spyOn(prisma.widget, "findMany").mockResolvedValue([]);

      const ownerToken = signAdminToken({
        sub: adminId,
        email,
        role: "owner",
      });

      const response = await app.inject({
        method: "GET",
        url: "/admin/widgets",
        headers: {
          authorization: `Bearer ${ownerToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
