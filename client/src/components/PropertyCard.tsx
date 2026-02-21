import { type Property } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Move, MapPin } from "lucide-react";
import { Link } from "wouter";
import { NumericFormat } from "react-number-format";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"; // Fallback real estate image

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/50 bg-card transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={mainImage} 
          alt={property.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={property.type === 'sale' ? 'default' : 'secondary'} className="uppercase font-bold tracking-wide shadow-sm">
            {property.type === 'sale' ? 'Venda' : 'Aluguel'}
          </Badge>
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-transparent font-medium shadow-sm">
            {property.category === 'house' ? 'Casa' : property.category === 'apartment' ? 'Apartamento' : property.category === 'land' ? 'Terreno' : 'Comercial'}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
          <p className="text-white font-bold text-xl">
            <NumericFormat 
              value={property.price} 
              displayType="text" 
              prefix="R$ " 
              thousandSeparator="." 
              decimalSeparator="," 
            />
          </p>
        </div>
      </div>

      <CardContent className="flex-grow p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-bold leading-tight line-clamp-2 min-h-[3rem]">
            {property.title}
          </h3>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
          <span className="truncate">{property.neighborhood}, Juazeiro</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-dashed border-border text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
            <Bed className="h-4 w-4 mb-1 text-primary" />
            <span>{property.bedrooms} Quartos</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
            <Bath className="h-4 w-4 mb-1 text-primary" />
            <span>{property.bathrooms} Banheiros</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
            <Move className="h-4 w-4 mb-1 text-primary" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Link href={`/imovel/${property.id}`} className="w-full">
          <Button className="w-full font-semibold shadow-sm hover:shadow-md transition-all">
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
