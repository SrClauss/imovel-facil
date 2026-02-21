import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/local-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast({ title: "Logado", description: "Entrando no painel..." });
        // populate zustand store with current user
        try {
          const me = await fetch("/api/auth/user", { credentials: "include" }).then((r) => r.json()).catch(() => null);
          const { useAuthStore } = await import("../stores/authStore");
          useAuthStore.getState().setUser(me || null);
        } catch (e) {
          // ignore
        }
        // give the backend a moment to set cookie/session
        setTimeout(() => navigate("/dashboard"), 300);
        return;
      }

      const body = await res.json().catch(() => ({}));
      toast({ title: "Erro", description: body?.message || "Credenciais inválidas", variant: "destructive" });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao conectar ao servidor", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-border p-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-primary">Área do Corretor</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Entre com suas credenciais para acessar o painel.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <Label htmlFor="username">Usuário ou email</Label>
              <Input
                id="username"
                name="username"
                placeholder="usuário ou email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 items-center justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div>Ou use o provedor externo:</div>
            <a href="/api/login" className="text-primary hover:underline">Entrar com OIDC</a>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">Usuário padrão: <strong>admin</strong> / <strong>admin123</strong></div>
        </div>
      </main>
    </div>
  );
}
