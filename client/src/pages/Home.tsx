import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [filters, setFilters] = useState({
    type: "sale",
    category: "",
    neighborhood: "",
  });

  const { data: properties, isLoading } = useProperties(filters);

  // Featured Hero Background - Using Unsplash directly with descriptive comment
  // Hero: Modern architectural house
  const heroImage =
    "https://images.unsplash.com/photo-1600596542815-e32c12e32ade?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 backdrop-blur-[2px]" />
        </div>

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center text-white mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Encontre o seu lugar em{" "}
              <span className="text-accent">Juazeiro</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light">
              Dezenas de casas, apartamentos e terrenos esperando por você.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground ml-1">
                  O que você busca?
                </label>
                <div className="flex bg-secondary/50 p-1 rounded-lg">
                  <button
                    onClick={() => setFilters({ ...filters, type: "sale" })}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filters.type === "sale" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, type: "rent" })}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filters.type === "rent" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Alugar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground ml-1">
                  Tipo de Imóvel
                </label>
                <Select
                  onValueChange={(val) =>
                    setFilters({
                      ...filters,
                      category: val === "all" ? "" : val,
                    })
                  }
                >
                  <SelectTrigger className="h-11 border-border/50 bg-secondary/20">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground ml-1">
                  Bairro
                </label>
                <Input
                  placeholder="Ex: Centro, Santo Antônio"
                  className="h-11 border-border/50 bg-secondary/20"
                  onChange={(e) =>
                    setFilters({ ...filters, neighborhood: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              Imóveis em Destaque
            </h2>
            <p className="text-muted-foreground mt-2">
              As melhores oportunidades selecionadas para você.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Ver todos os imóveis
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : properties?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <h3 className="text-xl font-medium text-muted-foreground">
              Nenhum imóvel encontrado com estes filtros.
            </h3>
            <Button
              variant="ghost"
              onClick={() =>
                setFilters({ type: "sale", category: "", neighborhood: "" })
              }
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties?.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Quer vender ou alugar seu imóvel?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-lg">
            Anuncie com a Imóvel Fácil e tenha a melhor visibilidade de
            Juazeiro. Processo rápido, seguro e sem burocracia.
          </p>
          <a href="/proprietario">
            <Button
              size="lg"
              variant="secondary"
              className="text-primary font-bold px-8 h-14 text-lg shadow-xl hover:bg-white"
            >
              Anunciar Agora
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
