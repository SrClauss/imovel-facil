import type { Express, RequestHandler } from "express";
import { authStorage } from "./storage";

export function getSession() {
  return (_req: any, _res: any, next: any) => next();
}

export async function setupAuth(app: Express) {
  console.log("Auth: usando autenticação por usuário/senha");
  app.set("trust proxy", 1);
}

function parseCookieHeader(cookieHeader?: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((c) => {
    const idx = c.indexOf("=");
    if (idx === -1) return;
    const name = c.slice(0, idx).trim();
    const value = c.slice(idx + 1).trim();
    cookies[name] = decodeURIComponent(value);
  });
  return cookies;
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const cookies = parseCookieHeader(req.headers.cookie as string | undefined);
  const userId = cookies["user_session"];
  
  if (userId) {
    const user = await authStorage.getUser(userId);
    if (user) {
      req.user = { 
        claims: { sub: userId }, 
        expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60 
      } as any;
      return next();
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};
