import { describe, it, expect, beforeEach, vi } from "vitest";
import { DatabaseStorage } from "./storage";
import { db } from "./db";
import * as minio from "./minio";
import type { InsertProperty, InsertContact, Property } from "@shared/schema";

// Mock the database
vi.mock("./db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock minio helper functions
vi.mock("./minio", () => ({
  isMinioUrl: vi.fn(() => true),
  extractKeyFromUrl: vi.fn((u: string) => u.split('/').pop()),
  deleteObjects: vi.fn(),
}));

describe("DatabaseStorage", () => {
  let storage: DatabaseStorage;

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe("getProperties", () => {
    it("should return all properties without filters", async () => {
      const mockProperties: Property[] = [
        {
          id: 1,
          title: "Test Property",
          description: "Test Description",
          type: "sale",
          category: "house",
          price: "100000",
          neighborhood: "Centro",
          bedrooms: 3,
          bathrooms: 2,
          area: 150,
          imageUrls: [],
          status: "available",
          createdAt: new Date(),
        },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockProperties),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getProperties();

      expect(result).toEqual(mockProperties);
      expect(db.select).toHaveBeenCalled();
    });

    it("should filter properties by type", async () => {
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      await storage.getProperties({ type: "sale" });

      expect(mockQuery.where).toHaveBeenCalled();
      expect(mockQuery.orderBy).toHaveBeenCalled();
    });
  });

  describe("getProperty", () => {
    it("should return a property by id", async () => {
      const mockProperty: Property = {
        id: 1,
        title: "Test Property",
        description: "Test Description",
        type: "sale",
        category: "house",
        price: "100000",
        neighborhood: "Centro",
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        imageUrls: [],
        status: "available",
        createdAt: new Date(),
      };

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockProperty]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getProperty(1);

      expect(result).toEqual(mockProperty);
    });

    it("should return undefined if property not found", async () => {
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getProperty(999);

      expect(result).toBeUndefined();
    });
  });

  describe("createProperty", () => {
    it("should create a new property", async () => {
      const newProperty: InsertProperty = {
        title: "New Property",
        description: "New Description",
        type: "sale",
        category: "apartment",
        price: "200000",
        neighborhood: "Orla",
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        imageUrls: [],
        status: "available",
      };

      const createdProperty: Property = {
        id: 1,
        ...newProperty,
        createdAt: new Date(),
      };

      const mockQuery = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdProperty]),
      };

      vi.mocked(db.insert).mockReturnValue(mockQuery as any);

      const result = await storage.createProperty(newProperty);

      expect(result).toEqual(createdProperty);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("updateProperty", () => {
    it("should update a property", async () => {
      const updates = {
        title: "Updated Title",
        price: "250000",
      };

      const updatedProperty: Property = {
        id: 1,
        title: "Updated Title",
        description: "Description",
        type: "sale",
        category: "house",
        price: "250000",
        neighborhood: "Centro",
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        imageUrls: [],
        status: "available",
        createdAt: new Date(),
      };

      const mockQuery = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedProperty]),
      };

      vi.mocked(db.update).mockReturnValue(mockQuery as any);

      const result = await storage.updateProperty(1, updates);

      expect(result).toEqual(updatedProperty);
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("deleteProperty", () => {
    it("should delete a property", async () => {
      const mockQuery = {
        where: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(db.delete).mockReturnValue(mockQuery as any);

      await storage.deleteProperty(1);

      expect(db.delete).toHaveBeenCalled();
      expect(mockQuery.where).toHaveBeenCalled();
    });

    it("should delete MinIO images when property contains MinIO URLs", async () => {
      const mockProperty: Property = {
        id: 1,
        title: "Has Images",
        description: "...",
        type: "sale",
        category: "house",
        price: "100000",
        neighborhood: "Centro",
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        imageUrls: ["http://localhost:9000/imovel-facil/x.jpg"],
        status: "available",
        createdAt: new Date(),
      } as any;

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockProperty]),
      } as any;

      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      const mockDeleteQuery = {
        where: vi.fn().mockResolvedValue(undefined),
      } as any;

      vi.mocked(db.delete).mockReturnValue(mockDeleteQuery as any);

      await storage.deleteProperty(1);

      expect(minio.deleteObjects).toHaveBeenCalled();
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("createContact", () => {
    it("should create a new contact", async () => {
      const newContact: InsertContact = {
        name: "John Doe",
        phone: "123456789",
        email: "john@example.com",
        message: "I'm interested",
        propertyId: 1,
      };

      const createdContact = {
        id: 1,
        ...newContact,
        createdAt: new Date(),
      };

      const mockQuery = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdContact]),
      };

      vi.mocked(db.insert).mockReturnValue(mockQuery as any);

      const result = await storage.createContact(newContact);

      expect(result).toEqual(createdContact);
      expect(db.insert).toHaveBeenCalled();
    });
  });
});
