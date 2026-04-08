import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Save, FileText, Settings, LayoutDashboard } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ContentRow {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
}

interface BudgetRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  description: string;
  status: string;
  created_at: string;
}

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
}

export default function Admin() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .then(({ data }) => {
          setIsAdmin(data && data.length > 0);
        });
    }
  }, [user]);

  const { data: contentRows } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data as ContentRow[];
    },
    enabled: isAdmin === true,
  });

  const { data: budgets } = useQuery({
    queryKey: ["admin-budgets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BudgetRow[];
    },
    enabled: isAdmin === true,
  });

  const { data: serviceRows } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ServiceRow[];
    },
    enabled: isAdmin === true,
  });

  const updateContent = useMutation({
    mutationFn: async (row: ContentRow) => {
      const { error } = await supabase
        .from("site_content")
        .update({ title: row.title, subtitle: row.subtitle, content: row.content, image_url: row.image_url })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Conteúdo atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar conteúdo."),
  });

  const updateBudgetStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("budget_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-budgets"] });
      toast.success("Status atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <p className="text-xl font-bold">Acesso Negado</p>
            <p className="text-muted-foreground">Você não tem permissão de administrador.</p>
            <Button variant="outline" onClick={signOut}>Sair</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sectionLabels: Record<string, string> = {
    hero: "Hero (Início)",
    about: "Sobre Nós",
    contact: "Contato",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    contacted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-bold font-['Space_Grotesk']">Admin DTF ARTZONE</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" target="_blank">Ver Site</a>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content">
          <TabsList className="mb-8">
            <TabsTrigger value="content"><Settings className="h-4 w-4 mr-1" /> Conteúdo</TabsTrigger>
            <TabsTrigger value="budgets"><FileText className="h-4 w-4 mr-1" /> Orçamentos</TabsTrigger>
            <TabsTrigger value="services"><LayoutDashboard className="h-4 w-4 mr-1" /> Serviços</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {contentRows?.map((row) => (
              <ContentEditor
                key={row.id}
                row={row}
                label={sectionLabels[row.section_key] || row.section_key}
                onSave={(updated) => updateContent.mutate(updated)}
              />
            ))}
          </TabsContent>

          <TabsContent value="budgets">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                {!budgets?.length ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum orçamento recebido ainda.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgets.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="whitespace-nowrap text-sm">
                              {new Date(b.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell className="text-sm">{b.email}</TableCell>
                            <TableCell><Badge variant="secondary">{b.service}</Badge></TableCell>
                            <TableCell className="max-w-xs truncate text-sm">{b.description}</TableCell>
                            <TableCell>
                              <Select
                                value={b.status}
                                onValueChange={(val) => updateBudgetStatus.mutate({ id: b.id, status: val })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="contacted">Contatado</SelectItem>
                                  <SelectItem value="completed">Finalizado</SelectItem>
                                  <SelectItem value="rejected">Rejeitado</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Serviços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceRows?.map((s) => (
                  <ServiceEditor key={s.id} service={s} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ContentEditor({ row, label, onSave }: { row: ContentRow; label: string; onSave: (r: ContentRow) => void }) {
  const [form, setForm] = useState(row);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Título</label>
            <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Subtítulo</label>
            <Input value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Conteúdo</label>
          <Textarea rows={4} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <Button onClick={() => onSave(form)} size="sm">
          <Save className="h-4 w-4 mr-1" /> Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function ServiceEditor({ service }: { service: ServiceRow }) {
  const [form, setForm] = useState(service);
  const queryClient = useQueryClient();

  const save = async () => {
    const { error } = await supabase
      .from("services")
      .update({ title: form.title, description: form.description, icon: form.icon, sort_order: form.sort_order, active: form.active })
      .eq("id", form.id);
    if (error) {
      toast.error("Erro ao salvar serviço.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast.success("Serviço atualizado!");
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Título</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ícone</label>
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ordem</label>
          <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Ativo
        </label>
        <Button onClick={save} size="sm">
          <Save className="h-4 w-4 mr-1" /> Salvar
        </Button>
      </div>
    </div>
  );
}
