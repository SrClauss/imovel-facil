import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

// Mock wouter
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ["/", vi.fn()],
}));

// Mock auth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null }),
}));

describe("Navbar", () => {
  it("should render the logo", () => {
    render(<Navbar />);
    expect(screen.getByText("Imóvel Fácil")).toBeInTheDocument();
    expect(screen.getByText("JUAZEIRO")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Anunciar Imóvel")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
  });

  it("should render phone number", () => {
    render(<Navbar />);
    expect(screen.getByText("(74) 99969-5633")).toBeInTheDocument();
  });

  it("should render 'Área do Corretor' button when user is not logged in", () => {
    render(<Navbar />);
    expect(screen.getByText("Área do Corretor")).toBeInTheDocument();
  });
});
