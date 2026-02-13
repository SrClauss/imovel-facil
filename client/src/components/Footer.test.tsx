import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

// Mock wouter Link component
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("should render the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Imóvel Fácil")).toBeInTheDocument();
  });

  it("should render brand description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Sua plataforma de confiança para encontrar/)
    ).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Navegação")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Anunciar Imóvel")).toBeInTheDocument();
    expect(screen.getByText("Fale Conosco")).toBeInTheDocument();
  });

  it("should render property categories", () => {
    render(<Footer />);
    expect(screen.getByText("Imóveis")).toBeInTheDocument();
    expect(screen.getByText("Comprar")).toBeInTheDocument();
    expect(screen.getByText("Alugar")).toBeInTheDocument();
    expect(screen.getByText("Casas")).toBeInTheDocument();
    expect(screen.getByText("Apartamentos")).toBeInTheDocument();
  });

  it("should render contact information", () => {
    render(<Footer />);
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText(/Travessa Passarela Center/)).toBeInTheDocument();
    expect(screen.getByText("(74) 99969-5633")).toBeInTheDocument();
    expect(screen.getByText("lspinolagoncalves@gmail.com")).toBeInTheDocument();
  });

  it("should render copyright notice", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2024 Imóvel Fácil Juazeiro/)
    ).toBeInTheDocument();
  });

  it("should render legal links", () => {
    render(<Footer />);
    expect(screen.getByText("Termos de Uso")).toBeInTheDocument();
    expect(screen.getByText("Privacidade")).toBeInTheDocument();
  });
});
