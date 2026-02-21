import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Login por usuário/senha
  app.post("/api/local-login", async (req: any, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    try {
      const user = await authStorage.getUserByIdentifier(username);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const [salt, storedHash] = user.passwordHash.split("_");
      const { scryptSync } = await import("crypto");
      const hash = scryptSync(password, salt, 64).toString("hex");

      if (hash !== storedHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const maxAge = 60 * 60 * 24 * 7; // 7 dias
      res.setHeader(
        "Set-Cookie",
        `user_session=${user.id}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax`
      );

      return res.json({ ok: true });
    } catch (err) {
      console.error("login error:", err);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Logout
  app.post("/api/local-logout", async (_req, res) => {
    res.setHeader("Set-Cookie", `user_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
    res.json({ ok: true });
  });
}
