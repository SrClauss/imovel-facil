import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FaPlus, FaTrash, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

type User = { id: string; email?: string; firstName?: string; lastName?: string; role?: string };

export default function AdminUsers() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const [createPasswordVisible, setCreatePasswordVisible] = useState(false);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // change-password modal state
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [changePwdUserId, setChangePwdUserId] = useState<string | null>(null);
  const [changePwdValue, setChangePwdValue] = useState("");
  const [changePwdConfirmValue, setChangePwdConfirmValue] = useState("");
  const [changePwdVisible, setChangePwdVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) return navigate("/login");
    if (!isLoading && user && user.role !== "admin") return navigate("/");
    fetchUsers();
  }, [isLoading, user]);

  async function fetchUsers() {
    const res = await axios.get("/api/admin/users", { withCredentials: true });
    setUsers(res.data || []);
  }

  async function handleAdd(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (createPassword && createPassword !== createConfirmPassword) {
      return alert("Senhas não conferem");
    }
    await axios.post(
      "/api/admin/users",
      { email, firstName, lastName, role, password: createPassword || undefined },
      { withCredentials: true },
    );
    setEmail("");
    setCreatePassword("");
    setCreateConfirmPassword("");
    setCreatePasswordVisible(false);
    setFirstName("");
    setLastName("");
    setRole("user");
    setIsCreateOpen(false);
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

  async function handleUpdatePassword(id: string, newPassword: string) {
    if (!newPassword) return alert("Informe a nova senha");
    await axios.put(`/api/admin/users/${id}`, { password: newPassword }, { withCredentials: true });
    setPasswords((p) => ({ ...p, [id]: "" }));
    fetchUsers();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Administração de Corretores</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                  <FaPlus className="h-4 w-4" /> Adicionar usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Corretor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-3 mt-2">
                  <Input placeholder="email" value={email} onChange={(e:any) => setEmail(e.target.value)} required />
                  <div className="flex gap-2">
                    <Input placeholder="Nome" value={firstName} onChange={(e:any) => setFirstName(e.target.value)} />
                    <Input placeholder="Sobrenome" value={lastName} onChange={(e:any) => setLastName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        placeholder="senha (opcional)"
                        type={createPasswordVisible ? "text" : "password"}
                        value={createPassword}
                        onChange={(e: any) => setCreatePassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                        onClick={() => setCreatePasswordVisible((v) => !v)}
                        aria-label={createPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {createPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="repita a senha"
                        type={createPasswordVisible ? "text" : "password"}
                        value={createConfirmPassword}
                        onChange={(e: any) => setCreateConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                        onClick={() => setCreatePasswordVisible((v) => !v)}
                        aria-label={createPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {createPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-2 rounded">
                      <option value="user">user</option>
                      <option value="broker">broker</option>
                      <option value="admin">admin</option>
                    </select>
                    <div className="flex gap-2 ml-auto">
                      <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); setCreatePassword(""); setCreateConfirmPassword(""); setCreatePasswordVisible(false); }}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Change-password modal */}
            <Dialog open={isChangePwdOpen} onOpenChange={(open) => { if (!open) { setChangePwdUserId(null); setChangePwdValue(""); setChangePwdConfirmValue(""); setChangePwdVisible(false); } setIsChangePwdOpen(open); }}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Alterar senha</DialogTitle>
                </DialogHeader>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!changePwdUserId) return;
                  if (changePwdValue !== changePwdConfirmValue) return alert("Senhas não conferem");
                  await axios.put(`/api/admin/users/${changePwdUserId}`, { password: changePwdValue }, { withCredentials: true });
                  setIsChangePwdOpen(false);
                  setChangePwdUserId(null);
                  setChangePwdValue("");
                  setChangePwdConfirmValue("");
                  setChangePwdVisible(false);
                  fetchUsers();
                }} className="space-y-3 mt-2">
                  <div className="relative">
                    <Input placeholder="nova senha" type={changePwdVisible ? "text" : "password"} value={changePwdValue} onChange={(e:any) => setChangePwdValue(e.target.value)} required />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setChangePwdVisible(v => !v)} aria-label={changePwdVisible ? 'Ocultar senha' : 'Mostrar senha'}>
                      {changePwdVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input placeholder="repita a nova senha" type={changePwdVisible ? "text" : "password"} value={changePwdConfirmValue} onChange={(e:any) => setChangePwdConfirmValue(e.target.value)} required />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setChangePwdVisible(v => !v)} aria-label={changePwdVisible ? 'Ocultar senha' : 'Mostrar senha'}>
                      {changePwdVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setIsChangePwdOpen(false); setChangePwdUserId(null); setChangePwdConfirmValue(''); setChangePwdVisible(false); }}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow-sm bg-white rounded-md overflow-hidden">
              <thead className="bg-slate-50">
                <tr className="text-sm text-left text-muted-foreground">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} className={`text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100`}>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={(e) => handleUpdateRole(u.id, e.target.value)} className="border px-2 rounded">
                        <option value="user">user</option>
                        <option value="broker">broker</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                            <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-2 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                              onClick={() => { setChangePwdUserId(u.id); setChangePwdValue(""); setIsChangePwdOpen(true); }}
                              aria-label="Alterar senha"
                            >
                              🔑
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Alterar senha</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleDelete(u.id)}
                              aria-label="Excluir usuário"
                            >
                              <FaTrash />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
