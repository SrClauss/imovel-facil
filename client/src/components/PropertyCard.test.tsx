import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "./PropertyCard";
import type { Property } from "@shared/schema";

// Mock wouter Link component
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("PropertyCard", () => {
  const mockProperty: Property = {
    id: 1,
    title: "Casa Moderna no Centro",
    description: "Linda casa com 3 quartos",
    type: "sale",
    category: "house",
    price: "450000",
    neighborhood: "Centro",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    imageUrls: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    ],
    videoUrl: null,
    status: "available",
    createdAt: new Date(),
  };

  it("should render property title", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Casa Moderna no Centro")).toBeInTheDocument();
  });

  it("should render property type badge", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Venda")).toBeInTheDocument();
  });

  it("should render property category badge", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Casa")).toBeInTheDocument();
  });

  it("should render property details", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("3 Quartos")).toBeInTheDocument();
    expect(screen.getByText("2 Banheiros")).toBeInTheDocument();
    expect(screen.getByText("150 m²")).toBeInTheDocument();
  });

  it("should render neighborhood", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Centro, Juazeiro/)).toBeInTheDocument();
  });

  it("should render property image", () => {
    render(<PropertyCard property={mockProperty} />);
    const img = screen.getByAltText("Casa Moderna no Centro");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockProperty.imageUrls[0]);
  });

  it("should use fallback image when no images provided", () => {
    const propertyWithoutImages = {
      ...mockProperty,
      imageUrls: [],
    };
    render(<PropertyCard property={propertyWithoutImages} />);
    const img = screen.getByAltText("Casa Moderna no Centro");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("unsplash.com")
    );
  });

  it("should render link to property details", () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/imovel/1");
  });

  it("should show 'Aluguel' badge for rent properties", () => {
    const rentProperty = {
      ...mockProperty,
      type: "rent" as const,
    };
    render(<PropertyCard property={rentProperty} />);
    expect(screen.getByText("Aluguel")).toBeInTheDocument();
  });

  it("should show correct category for apartment", () => {
    const apartmentProperty = {
      ...mockProperty,
      category: "apartment" as const,
    };
    render(<PropertyCard property={apartmentProperty} />);
    expect(screen.getByText("Apartamento")).toBeInTheDocument();
  });

  it("should show correct category for land", () => {
    const landProperty = {
      ...mockProperty,
      category: "land" as const,
    };
    render(<PropertyCard property={landProperty} />);
    expect(screen.getByText("Terreno")).toBeInTheDocument();
  });

  it("should show correct category for commercial", () => {
    const commercialProperty = {
      ...mockProperty,
      category: "commercial" as const,
    };
    render(<PropertyCard property={commercialProperty} />);
    expect(screen.getByText("Comercial")).toBeInTheDocument();
  });
});
