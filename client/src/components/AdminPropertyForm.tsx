import { useState } from "react";
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
import { api } from "@shared/routes";
import { z } from "zod";

// Extend schema to handle strings from inputs that should be numbers
const formSchema = insertPropertySchema.extend({
  price: z.coerce.number(), // Handle decimal as number input
  bedrooms: z.coerce.number(),
  bathrooms: z.coerce.number(),
  area: z.coerce.number(),
  // keep `imageUrls` as string in the form (comma-separated); convert on submit
  imageUrls: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminPropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
}

export function AdminPropertyForm({ property, onSuccess }: AdminPropertyFormProps) {
  const { toast } = useToast();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const [uploading, setUploading] = useState(false);
  const [hasUnsavedImages, setHasUnsavedImages] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      type: (property?.type as "sale" | "rent") || "sale",
      category: property?.category || "house",
      price: property?.price ? Number(property.price) : 0,
      neighborhood: property?.neighborhood || "",
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      area: property?.area || 0,
      imageUrls: property?.imageUrls?.join(", ") || "",
      status: property?.status || "available",
    },
  });

  // Watch imageUrls field for changes
  const imageUrlsValue = form.watch("imageUrls");

  const onSubmit = async (data: FormValues) => {
    console.log("Submitting property:", JSON.stringify(data, null, 2));

    // Convert form data to API shape
    const payload = {
      ...data,
      price: String(data.price),
      imageUrls: (data.imageUrls || "").toString().split(',').map(s => s.trim()).filter(Boolean),
    } as any;

    try {
      if (property) {
        await updateMutation.mutateAsync({ id: property.id, ...payload });
        toast({ title: "Sucesso", description: "Imóvel atualizado." });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Sucesso", description: "Imóvel cadastrado." });
      }
      setHasUnsavedImages(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Save property error:", error);
      const message = error?.message || error?.body?.message || "Falha ao salvar imóvel. Verifique os dados.";
      toast({ 
        title: "Erro", 
        description: message, 
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

          {/* Image upload UI */}
          <FormItem className="col-span-2">
            <FormLabel>Imagens</FormLabel>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                const fd = new FormData();
                files.forEach((f) => fd.append("files", f));

                setUploading(true);
                try {
                  const res = await fetch(api.uploads.upload.path, {
                    method: api.uploads.upload.method,
                    body: fd,
                    credentials: "include",
                  });
                  const json = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    const msg = json?.message || "Falha ao enviar imagens";
                    toast({ title: "Erro no upload", description: msg, variant: "destructive" });
                    return;
                  }

                  const returned: string[] = json.urls || [];
                  const current = imageUrlsValue || "";
                  const currentArr = current ? current.split(",").map((s) => s.trim()).filter(Boolean) : [];
                  form.setValue("imageUrls", [...currentArr, ...returned].join(", "));
                  
                  // Mark that there are unsaved changes
                  setHasUnsavedImages(true);
                  
                  toast({ 
                    title: "Upload concluído", 
                    description: `${returned.length} imagem(ns) adicionadas. CLIQUE EM SALVAR ALTERAÇÕES para persistir!`,
                    duration: 8000
                  });
                } catch (err: any) {
                  console.error("upload error", err);
                  toast({ title: "Erro no upload", description: "Verifique sua autenticação / conexão.", variant: "destructive" });
                } finally {
                  setUploading(false);
                  // clear input
                  (e.target as HTMLInputElement).value = "";
                }
              }}
              className="mb-4"
            />

            {/* Thumbnails / preview */}
            <div className="flex gap-2 flex-wrap">
              {(imageUrlsValue || "")
                .toString()
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((url) => (
                  <div key={url} className="relative w-24 h-24 rounded overflow-hidden border">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={async () => {
                        const newUrls = (imageUrlsValue || "")
                          .toString()
                          .split(",")
                          .map((s) => s.trim())
                          .filter((u) => u && u !== url);
                        form.setValue("imageUrls", newUrls.join(", "));
                        // try to delete from server storage if it belongs to our service
                        try {
                          await fetch(api.uploads.delete.path, {
                            method: api.uploads.delete.method,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ urls: [url] }),
                            credentials: "include",
                          });
                          toast({ title: "Imagem removida" });
                        } catch (e) {
                          toast({ title: "Erro", description: "Falha ao remover imagem do storage", variant: "destructive" });
                        }
                      }}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-sm hover:bg-white"
                      aria-label="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>

            {uploading && <div className="text-sm text-muted-foreground mt-2">Enviando imagens...</div>}
            {hasUnsavedImages && (
              <div className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>Imagens carregadas. Clique em "Salvar Alterações" abaixo para persistir!</span>
              </div>
            )}
          </FormItem>

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
