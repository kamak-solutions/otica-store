import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("Health routes", () => {
  it("should return API health status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toEqual(
      expect.objectContaining({
        status: "ok",
      }),
    );
  });
});
