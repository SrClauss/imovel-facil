import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, type Property } from "@shared/schema";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extend schema to handle strings from inputs that should be numbers
const formSchema = insertPropertySchema.extend({
  price: z.coerce.number(), // Handle decimal as number input
  bedrooms: z.coerce.number(),
  bathrooms: z.coerce.number(),
  area: z.coerce.number(),
  imageUrls: z.union([z.array(z.string()), z.string()]).transform((val) => 
    typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val
  ), // Accept string or array, transform string to array
});

type FormValues = z.input<typeof formSchema>;

interface AdminPropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
}

export function AdminPropertyForm({ property, onSuccess }: AdminPropertyFormProps) {
  const { toast } = useToast();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      type: (property?.type as "sale" | "rent") || "sale",
      category: property?.category || "house",
      price: property?.price?.toString() || "0",
      neighborhood: property?.neighborhood || "",
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      area: property?.area || 0,
      imageUrls: property?.imageUrls?.join(", ") || "",
      status: property?.status || "available",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (property) {
        await updateMutation.mutateAsync({ id: property.id, ...data });
        toast({ title: "Sucesso", description: "Imóvel atualizado." });
      } else {
        await createMutation.mutateAsync(data as any);
        toast({ title: "Sucesso", description: "Imóvel cadastrado." });
      }
      onSuccess?.();
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: "Falha ao salvar imóvel. Verifique os dados.", 
        variant: "destructive" 
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Título do Anúncio</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Linda Casa no Centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Negócio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sale">Venda</SelectItem>
                    <SelectItem value="rent">Aluguel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Santo Antônio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-2 col-span-2">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartos</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banheiros</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Descrição Detalhada</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Descreva os detalhes do imóvel..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>URLs das Imagens (separadas por vírgula)</FormLabel>
                <FormControl>
                  <Textarea placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="rented">Alugado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending ? (property ? "Atualizando..." : "Criando...") : (property ? "Salvar Alterações" : "Cadastrar Imóvel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
