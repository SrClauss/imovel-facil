import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";
import { registerAuthRoutes } from "./routes";
import { scryptSync, randomBytes } from "crypto";

// Mock auth storage used by the routes module
vi.mock("./storage", () => {
  return {
    authStorage: {
      upsertUser: vi.fn(),
      getUser: vi.fn(),
      getUserByIdentifier: vi.fn(),
    },
  };
});

let authStorage: any;

describe("local-login route", () => {
  let app: express.Express;

  beforeEach(async () => {
    // import the mocked module after vi.mock
    const mod = await import("./storage");
    authStorage = mod.authStorage;

    app = express();
    app.use(express.json());
    await registerAuthRoutes(app);
    vi.clearAllMocks();
  });

  it("authenticates a DB user by username and sets dev_user cookie", async () => {
    const salt = randomBytes(16).toString("hex");
    const storedHash = scryptSync("secret", salt, 64).toString("hex");
    const passwordHash = `${salt}_${storedHash}`;

    vi.mocked(authStorage.getUserByIdentifier).mockResolvedValue({ id: "u-1", username: "jdoe", email: "jdoe@example.com", passwordHash });

    const res = await request(app).post("/api/local-login").send({ username: "jdoe", password: "secret" });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body).toEqual({ ok: true });
  });

  it("rejects with wrong password", async () => {
    const salt = randomBytes(16).toString("hex");
    const storedHash = scryptSync("secret", salt, 64).toString("hex");
    const passwordHash = `${salt}_${storedHash}`;

    vi.mocked(authStorage.getUserByIdentifier).mockResolvedValue({ id: "u-2", username: "jane", email: "jane@example.com", passwordHash });

    const res = await request(app).post("/api/local-login").send({ username: "jane", password: "bad" });

    expect(res.status).toBe(401);
  });
});
