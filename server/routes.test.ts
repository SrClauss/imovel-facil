import { describe, it, expect, beforeEach, vi } from "vitest";
import express, { type Express } from "express";
import request from "supertest";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import type { Server } from "http";
import { createServer } from "http";

// Mock storage module
vi.mock("./storage", () => ({
  storage: {
    getProperties: vi.fn(),
    getProperty: vi.fn(),
    createProperty: vi.fn(),
    updateProperty: vi.fn(),
    deleteProperty: vi.fn(),
    createContact: vi.fn(),
  },
}));

// Mock auth module
vi.mock("./replit_integrations/auth", () => ({
  setupAuth: vi.fn(),
  registerAuthRoutes: vi.fn(),
  isAuthenticated: (req: any, res: any, next: any) => next(),
}));

describe("API Routes", () => {
  let app: Express;
  let httpServer: Server;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    vi.clearAllMocks();
  });

  describe("GET /api/properties", () => {
    it("should return all properties", async () => {
      const mockProperties = [
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

      vi.mocked(storage.getProperties).mockResolvedValue(mockProperties);

      const response = await request(app).get("/api/properties");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperties);
    });

    it("should filter properties by type", async () => {
      vi.mocked(storage.getProperties).mockResolvedValue([]);

      const response = await request(app).get("/api/properties?type=sale");

      expect(response.status).toBe(200);
      expect(storage.getProperties).toHaveBeenCalledWith(
        expect.objectContaining({ type: "sale" })
      );
    });

    it("should filter properties by price range", async () => {
      vi.mocked(storage.getProperties).mockResolvedValue([]);

      const response = await request(app).get(
        "/api/properties?minPrice=100000&maxPrice=500000"
      );

      expect(response.status).toBe(200);
      expect(storage.getProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          minPrice: 100000,
          maxPrice: 500000,
        })
      );
    });
  });

  describe("GET /api/properties/:id", () => {
    it("should return a property by id", async () => {
      const mockProperty = {
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

      vi.mocked(storage.getProperty).mockResolvedValue(mockProperty);

      const response = await request(app).get("/api/properties/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperty);
    });

    it("should return 404 if property not found", async () => {
      vi.mocked(storage.getProperty).mockResolvedValue(undefined);

      const response = await request(app).get("/api/properties/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Property not found" });
    });
  });

  describe("POST /api/properties", () => {
    it("should create a new property", async () => {
      const newProperty = {
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

      const createdProperty = {
        id: 1,
        ...newProperty,
        createdAt: new Date(),
      };

      vi.mocked(storage.createProperty).mockResolvedValue(createdProperty);

      const response = await request(app)
        .post("/api/properties")
        .send(newProperty);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProperty);
    });

    it("should return 400 for invalid property data", async () => {
      const invalidProperty = {
        title: "Invalid",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/properties")
        .send(invalidProperty);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/contacts", () => {
    it("should create a new contact", async () => {
      const newContact = {
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

      vi.mocked(storage.createContact).mockResolvedValue(createdContact);

      const response = await request(app).post("/api/contacts").send(newContact);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdContact);
    });

    it("should return 400 for invalid contact data", async () => {
      const invalidContact = {
        name: "John",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/contacts")
        .send(invalidContact);

      expect(response.status).toBe(400);
    });
  });
});
