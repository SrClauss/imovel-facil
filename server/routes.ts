import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { authStorage } from "./replit_integrations/auth/storage";
import { db } from "./db";
import { users } from "@shared/models/auth";
import bcrypt from "bcryptjs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Properties API
  app.get(api.properties.list.path, async (req, res) => {
    const filters = {
      type: req.query.type as string,
      category: req.query.category as string,
      neighborhood: req.query.neighborhood as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
    };
    const properties = await storage.getProperties(filters);
    res.json(properties);
  });

  app.get(api.properties.get.path, async (req, res) => {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  });

  // Protected Routes
  app.post(api.properties.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.properties.create.input.parse(req.body);
      const property = await storage.createProperty(input);
      res.status(201).json(property);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.properties.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.properties.update.input.parse(req.body);
      const property = await storage.updateProperty(Number(req.params.id), input);
      res.json(property);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.properties.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteProperty(Number(req.params.id));
    res.status(204).end();
  });

  // Admin user management endpoints
  function ensureAdmin(req: any, res: any, next: any) {
    const userId = req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    authStorage.getUser(userId).then((u) => {
      if (!u || (u as any).role !== "admin") return res.status(403).json({ message: "Forbidden" });
      next();
    }).catch(next);
  }

  app.get("/api/admin/users", isAuthenticated, ensureAdmin, async (_req, res) => {
    const all = await db.select().from(users).orderBy(users.createdAt);
    res.json(all.map((u) => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: (u as any).role })));
  });

  app.post("/api/admin/users", isAuthenticated, ensureAdmin, async (req, res) => {
    const { email, firstName, lastName, role, username, password } = req.body || {};
    if (!email) return res.status(400).json({ message: "email required" });
    try {
      let passwordHash: string | undefined = undefined;
      if (password) {
        passwordHash = await bcrypt.hash(password, 12);
      }
      const inserted = await db
        .insert(users)
        .values({ email, firstName, lastName, role: role || "user", username, passwordHash } as any)
        .returning();
      res.status(201).json(inserted[0]);
    } catch (err) {
      res.status(500).json({ message: "failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", isAuthenticated, ensureAdmin, async (req, res) => {
    const id = req.params.id;
    const { role, password } = req.body || {};
    const updates: any = {};
    if (role) updates.role = role;
    if (password) {
      updates.passwordHash = await bcrypt.hash(password, 12);
    }
    if (!Object.keys(updates).length) return res.status(400).json({ message: "role or password required" });
    await db.update(users).set(updates).where(eq(users.id, id));
    res.json({ ok: true });
  });

  app.delete("/api/admin/users/:id", isAuthenticated, ensureAdmin, async (req, res) => {
    const id = req.params.id;
    await db.delete(users).where(eq(users.id, id));
    res.json({ ok: true });
  });

  // Contacts API
  app.post(api.contacts.create.path, async (req, res) => {
    try {
      const input = api.contacts.create.input.parse(req.body);
      const contact = await storage.createContact(input);
      res.status(201).json(contact);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Ensure admin exists
  await ensureAdminUser();

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function ensureAdminUser() {
  try {
    const [existingAdmin] = await db.select().from(users).where(eq(users.role, "admin"));
    if (existingAdmin) return;

    const [byUsername] = await db.select().from(users).where(eq(users.username, "admin"));
    if (byUsername) {
      await db.update(users).set({ role: "admin" }).where(eq(users.username, "admin"));
      console.log("Promoted existing user 'admin' to role 'admin'");
      return;
    }

    const password = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(password, 12);

    const [newAdmin] = await db
      .insert(users)
      .values({
        username: "admin",
        email: "admin@local",
        firstName: "Admin",
        lastName: "Local",
        role: "admin",
        passwordHash,
      })
      .returning();

    console.log(`Created default admin 'admin' (${process.env.ADMIN_PASSWORD ? 'ADMIN_PASSWORD' : 'admin123'})`);
  } catch (err) {
    console.error('ensureAdminUser error:', err);
  }
}

async function seedDatabase() {
  const existing = await storage.getProperties();
  if (existing.length === 0) {
    console.log("Seeding database...");
    await storage.createProperty({
      title: "Casa Moderna no Centro",
      description: "Linda casa com 3 quartos, suíte master, piscina e área gourmet. Localização privilegiada no centro de Juazeiro.",
      type: "sale",
      category: "house",
      price: "450000",
      neighborhood: "Centro",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      imageUrls: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "available"
    });
    await storage.createProperty({
      title: "Apartamento com Vista para o Rio",
      description: "Apartamento de luxo com vista panorâmica para o Rio São Francisco. Condomínio completo com segurança 24h.",
      type: "rent",
      category: "apartment",
      price: "1500",
      neighborhood: "Orla",
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      imageUrls: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "available"
    });
    await storage.createProperty({
      title: "Terreno em Condomínio Fechado",
      description: "Oportunidade única! Terreno plano em condomínio de alto padrão.",
      type: "sale",
      category: "land",
      price: "120000",
      neighborhood: "Nova Juazeiro",
      bedrooms: 0,
      bathrooms: 0,
      area: 300,
      imageUrls: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      status: "available"
    });
  }
}
