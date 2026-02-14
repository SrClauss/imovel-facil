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

  // Local/dev login for quick testing: creates/returns a dev session cookie
  // Enabled only in non-production environments
  app.post("/api/local-login", async (req: any, res) => {
    // allow local-login in non-production OR when explicitly enabled via env
    console.log(`[DEBUG] NODE_ENV=${process.env.NODE_ENV}, ALLOW_LOCAL_LOGIN=${process.env.ALLOW_LOCAL_LOGIN}`);
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_LOGIN !== "true") {
      console.log("[DEBUG] Rejecting local-login: production mode without ALLOW_LOCAL_LOGIN");
      return res.status(404).json({ message: "Not available" });
    }

    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // default dev user
    if (username === "admin" && password === "admin123") {
      const userId = "local-admin";
      try {
        await authStorage.upsertUser({
          id: userId,
          email: "admin@local",
          firstName: "Admin",
          lastName: "Local",
          role: "admin",
        });

        // set HTTP-only cookie used by isAuthenticated dev branch
        const maxAge = 60 * 60 * 24; // 1 day
        res.setHeader(
          "Set-Cookie",
          `dev_user=${userId}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax`
        );

        return res.json({ ok: true });
      } catch (err) {
        console.error("local-login error:", err);
        return res.status(500).json({ message: "Failed to create dev user" });
      }
    }

    // try DB users (username OR email)
    try {
      const user = await authStorage.getUserByIdentifier(username);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const bcrypt = await import("bcryptjs");
      const ok = await bcrypt.compare(password, (user as any).passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      // set HTTP-only cookie used by isAuthenticated dev branch
      const maxAge = 60 * 60 * 24; // 1 day
      res.setHeader(
        "Set-Cookie",
        `dev_user=${user.id}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax`
      );

      return res.json({ ok: true });
    } catch (err) {
      console.error("local-login db error:", err);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });

  // clear dev cookie
  app.post("/api/local-logout", async (_req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).end();
    }
    res.setHeader("Set-Cookie", `dev_user=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
    res.json({ ok: true });
  });
}
