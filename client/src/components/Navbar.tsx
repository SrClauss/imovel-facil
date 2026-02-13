import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, Phone } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/proprietario", label: "Anunciar Imóvel" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-primary leading-none">Imóvel Fácil</span>
              <span className="text-xs text-muted-foreground font-medium tracking-widest">JUAZEIRO</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="https://wa.me/5574999695633" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Phone className="h-4 w-4" />
              <span>(74) 99969-5633</span>
            </a>
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" size="sm" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  Painel
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                  <UserCircle className="h-4 w-4" />
                  Área do Corretor
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`text-lg font-medium ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <a href="https://wa.me/5574999695633" className="text-lg font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (74) 99969-5633
                </a>
                {user ? (
                  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                    <Button className="w-full">Painel do Corretor</Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Área do Corretor</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
