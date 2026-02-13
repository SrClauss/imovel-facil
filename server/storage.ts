import { db } from "./db";
import {
  properties,
  contacts,
  users,
  type Property,
  type InsertProperty,
  type UpdatePropertyRequest,
  type Contact,
  type InsertContact,
  type User,
  type UpsertUser
} from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  getProperties(filters?: any): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: UpdatePropertyRequest): Promise<Property>;
  deleteProperty(id: number): Promise<void>;
  createContact(contact: InsertContact): Promise<Contact>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property methods
  async getProperties(filters?: any): Promise<Property[]> {
    let query = db.select().from(properties);
    const conditions = [];

    if (filters) {
      if (filters.type) conditions.push(eq(properties.type, filters.type));
      if (filters.category) conditions.push(eq(properties.category, filters.category));
      if (filters.neighborhood) conditions.push(eq(properties.neighborhood, filters.neighborhood));
      if (filters.minPrice) conditions.push(gte(properties.price, filters.minPrice));
      if (filters.maxPrice) conditions.push(lte(properties.price, filters.maxPrice));
      if (filters.bedrooms) conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(properties.createdAt));
    }

    return await query.orderBy(desc(properties.createdAt));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: number, updates: UpdatePropertyRequest): Promise<Property> {
    const [updated] = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Contact methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }
}

export const storage = new DatabaseStorage();
