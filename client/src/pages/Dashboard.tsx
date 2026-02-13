import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProperties, useDeleteProperty } from "@/hooks/use-properties";
import { Navbar } from "@/components/Navbar";
import { AdminPropertyForm } from "@/components/AdminPropertyForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { type Property } from "@shared/schema";
import { NumericFormat } from "react-number-format";

export default function Dashboard() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: properties, isLoading: propsLoading } = useProperties();
  const deleteMutation = useDeleteProperty();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [authLoading, user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const filteredProperties = properties?.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProperty(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Painel do Corretor
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, Luiz. Gerencie seus imóveis.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => logout()}
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreate}
                  className="shadow-lg shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Novo Imóvel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProperty
                      ? "Editar Imóvel"
                      : "Cadastrar Novo Imóvel"}
                  </DialogTitle>
                </DialogHeader>
                <AdminPropertyForm
                  property={editingProperty}
                  onSuccess={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou bairro..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Imóvel</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Carregando imóveis...
                    </TableCell>
                  </TableRow>
                ) : filteredProperties?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      Nenhum imóvel encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties?.map((property) => (
                    <TableRow
                      key={property.id}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {property.imageUrls && property.imageUrls[0] && (
                            <img
                              src={property.imageUrls[0]}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span className="truncate max-w-[200px]">
                            {property.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {property.type === "sale" ? "Venda" : "Aluguel"}
                      </TableCell>
                      <TableCell>
                        <NumericFormat
                          value={property.price}
                          displayType="text"
                          prefix="R$ "
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            property.status === "available"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            property.status === "available"
                              ? "border-green-500 text-green-600 bg-green-50"
                              : ""
                          }
                        >
                          {property.status === "available"
                            ? "Disponível"
                            : property.status === "sold"
                              ? "Vendido"
                              : "Alugado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.neighborhood}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(property)}
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente o imóvel "{property.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteMutation.mutate(property.id)
                                  }
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
