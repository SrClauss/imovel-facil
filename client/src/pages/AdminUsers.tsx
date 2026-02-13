import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type User = { id: string; email?: string; firstName?: string; lastName?: string; role?: string };

export default function AdminUsers() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (!isLoading && !user) return navigate("/login");
    if (!isLoading && user && user.role !== "admin") return navigate("/");
    fetchUsers();
  }, [isLoading, user]);

  async function fetchUsers() {
    const res = await axios.get("/api/admin/users", { withCredentials: true });
    setUsers(res.data || []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await axios.post(
      "/api/admin/users",
      { email, firstName, lastName, role },
      { withCredentials: true },
    );
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("user");
    fetchUsers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir usuário?")) return;
    await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
    fetchUsers();
  }

  async function handleUpdateRole(id: string, newRole: string) {
    await axios.put(`/api/admin/users/${id}`, { role: newRole }, { withCredentials: true });
    fetchUsers();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Administração de Corretores</h1>

          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <Input placeholder="email" value={email} onChange={(e:any) => setEmail(e.target.value)} required />
            <Input placeholder="Nome" value={firstName} onChange={(e:any) => setFirstName(e.target.value)} />
            <Input placeholder="Sobrenome" value={lastName} onChange={(e:any) => setLastName(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-2 rounded">
              <option value="user">user</option>
              <option value="broker">broker</option>
              <option value="admin">admin</option>
            </select>
            <Button type="submit">Adicionar</Button>
          </form>

          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Email</th>
                <th className="px-2 py-1">Nome</th>
                <th className="px-2 py-1">Role</th>
                <th className="px-2 py-1">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-2 py-1">{u.id}</td>
                  <td className="px-2 py-1">{u.email}</td>
                  <td className="px-2 py-1">{u.firstName} {u.lastName}</td>
                  <td className="px-2 py-1">
                    <select value={u.role} onChange={(e) => handleUpdateRole(u.id, e.target.value)} className="border px-2 rounded">
                      <option value="user">user</option>
                      <option value="broker">broker</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <Button variant="destructive" onClick={() => handleDelete(u.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
