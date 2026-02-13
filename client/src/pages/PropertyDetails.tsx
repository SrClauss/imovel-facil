import { useParams, Link } from "wouter";
import { useProperty } from "@/hooks/use-properties";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Bed,
  Bath,
  Move,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PropertyDetails() {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(Number(id));
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          Imóvel não encontrado
        </h2>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  // Fallback images if none exist
  const images =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
        ];

  const whatsappMessage = encodeURIComponent(
    `Olá, gostaria de saber mais sobre o imóvel "${property.title}" (Cód: ${property.id})`,
  );
  const whatsappLink = `https://wa.me/5574999695633?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para busca
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge
                variant={property.type === "sale" ? "default" : "secondary"}
                className="uppercase"
              >
                {property.type === "sale" ? "Venda" : "Aluguel"}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/20 text-primary"
              >
                {property.category === "house"
                  ? "Casa"
                  : property.category === "apartment"
                    ? "Apartamento"
                    : "Imóvel"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span className="text-lg">
                {property.neighborhood}, Juazeiro - BA
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary mb-2">
              <NumericFormat
                value={property.price}
                displayType="text"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
              />
            </p>
            <p className="text-sm text-muted-foreground">
              Valor {property.type === "sale" ? "de venda" : "mensal"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Gallery Section */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-black/5"
            >
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Resumo do Imóvel</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                  <Bed className="h-5 w-5 text-primary mb-1" />
                  <span className="font-bold text-lg">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Quartos</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                  <Bath className="h-5 w-5 text-primary mb-1" />
                  <span className="font-bold text-lg">
                    {property.bathrooms}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Banheiros
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                  <Move className="h-5 w-5 text-primary mb-1" />
                  <span className="font-bold text-lg">{property.area}</span>
                  <span className="text-xs text-muted-foreground">m²</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-primary/10">
              <h3 className="font-semibold text-lg mb-4">Interessou?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Entre em contato agora mesmo para agendar uma visita ou tirar
                dúvidas sobre este imóvel.
              </p>

              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <Button className="w-full h-12 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-500/20 gap-2 mb-3">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chamar no WhatsApp
                </Button>
              </a>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-6 font-display">
            Descrição do Imóvel
          </h2>
          <div className="prose prose-blue max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
            {property.description}
          </div>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="font-semibold text-foreground text-lg mb-2 col-span-full">
              Diferenciais
            </h3>
            {[
              "Documentação em dia",
              "Aceita financiamento",
              "Próximo a escolas",
              "Rua pavimentada",
              "Área de serviço",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center text-muted-foreground"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
