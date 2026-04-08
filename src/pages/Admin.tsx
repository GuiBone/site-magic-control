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
import { LogOut, Save, FileText, Settings, LayoutDashboard, Plus, Trash2, Search, Filter, Phone, Mail, Paperclip, MessageSquare, ExternalLink, UploadCloud, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CMSField {
  id: string;
  key: string;
  label: string;
  value: string;
  section: string;
  field_type: string;
}

interface QuoteRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  service: string | null;
  message: string | null;
  file_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
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

  const { data: contentFields } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("section");
      if (error) throw error;
      return data as CMSField[];
    },
    enabled: isAdmin === true,
  });

  const { data: quotes } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as QuoteRow[];
    },
    enabled: isAdmin === true,
  });

  const { data: serviceRows } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as ServiceRow[];
    },
    enabled: isAdmin === true,
  });

  const updateContent = useMutation({
    mutationFn: async (fields: CMSField[]) => {
      const { error } = await supabase
        .from("site_content")
        .upsert(fields.map(f => ({
           id: f.id,
           key: f.key,
           label: f.label,
           value: f.value,
           section: f.section,
           field_type: f.field_type
        })), { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Conteúdo atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar conteúdo."),
  });


  const createService = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("services")
        .insert({
          title: "Novo Serviço",
          description: "",
          icon: "Briefcase",
          display_order: 99,
          is_active: false
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Serviço criado!");
    },
    onError: () => toast.error("Erro ao criar serviço."),
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
    services: "Serviços",
    contact: "Contato",
    footer: "Rodapé",
  };

  const groupedContent: Record<string, CMSField[]> = {};
  if (contentFields) {
    contentFields.forEach(f => {
      if (!groupedContent[f.section]) groupedContent[f.section] = [];
      groupedContent[f.section].push(f);
    });
  }


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
            <TabsTrigger value="gallery"><LayoutDashboard className="h-4 w-4 mr-1" /> Galeria</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {!contentFields || contentFields.length === 0 ? (
               <p className="text-muted-foreground text-center py-8">Nenhum campo de conteúdo encontrado.</p>
            ) : Object.keys(groupedContent).map((sectionKey) => (
              <ContentEditor
                key={sectionKey}
                section={sectionLabels[sectionKey] || sectionKey}
                fields={groupedContent[sectionKey]}
                onSave={(updated) => updateContent.mutate(updated)}
                isSaving={updateContent.isPending}
              />
            ))}
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Mini CRM: Orçamentos</h2>
            </div>
            <QuoteCRM quotes={quotes || []} />
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Serviços</CardTitle>
                <Button onClick={() => createService.mutate()} disabled={createService.isPending} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Novo Serviço
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceRows?.map((s) => (
                  <ServiceEditor key={s.id} service={s} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ContentEditor({ section, fields, onSave, isSaving }: { section: string; fields: CMSField[]; onSave: (f: CMSField[]) => void; isSaving: boolean }) {
  const [localFields, setLocalFields] = useState<CMSField[]>(fields);

  useEffect(() => {
    setLocalFields(fields);
  }, [fields]);

  const handleChange = (id: string, value: string) => {
    setLocalFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {localFields.map(field => (
           <div key={field.id} className="space-y-1">
             <label className="text-sm font-medium">{field.label}</label>
             {field.field_type === 'text' ? (
                <Textarea 
                  rows={3} 
                  value={field.value || ""} 
                  onChange={(e) => handleChange(field.id, e.target.value)} 
                />
             ) : field.field_type === 'image' ? (
                <ImageUploader 
                  value={field.value || ""} 
                  onChange={(url) => handleChange(field.id, url)} 
                />
             ) : (
                <Input 
                  value={field.value || ""} 
                  onChange={(e) => handleChange(field.id, e.target.value)} 
                />
             )}
           </div>
        ))}
        <Button onClick={() => onSave(localFields)} size="sm" disabled={isSaving}>
          <Save className="h-4 w-4 mr-1" /> {isSaving ? "Salvando..." : "Salvar Grupo"}
        </Button>
      </CardContent>
    </Card>
  );
}

function ServiceEditor({ service }: { service: ServiceRow }) {
  const [form, setForm] = useState(service);
  const queryClient = useQueryClient();

  useEffect(() => {
    setForm(service);
  }, [service]);

  const save = async () => {
    const { error } = await supabase
      .from("services")
      .update({ 
        title: form.title, 
        description: form.description, 
        icon: form.icon, 
        image_url: form.image_url,
        display_order: form.display_order, 
        is_active: form.is_active 
      })
      .eq("id", form.id);
      
    if (error) {
      toast.error("Erro ao salvar serviço.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast.success("Serviço salvo!");
  };

  const remove = async () => {
    if(!confirm("Atenção: Deseja realmente excluir este serviço?")) return;
    const { error } = await supabase.from("services").delete().eq("id", form.id);
    if (error) {
      toast.error("Erro ao excluir serviço.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast.success("Serviço excluído!");
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card relative">
      <div className="absolute top-4 right-4">
         <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={remove}>
            <Trash2 className="h-4 w-4" />
         </Button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pr-10">
        <div className="space-y-1">
          <label className="text-sm font-medium">Título</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ícone (Lucide)</label>
          <Input value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Imagem (URL)</label>
          <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ordem</label>
          <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 cursor-pointer" />
          Serviço Ativo
        </label>
        <Button onClick={save} size="sm">
          <Save className="h-4 w-4 mr-1" /> Salvar Serviço
        </Button>
      </div>
    </div>
  );
}

function QuoteCRM({ quotes }: { quotes: QuoteRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = (quotes || []).filter(q => {
    if (statusFilter !== "all" && q.status !== statusFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      const matchName = q.name.toLowerCase().includes(term);
      const matchEmail = q.email?.toLowerCase().includes(term);
      const matchPhone = q.phone?.toLowerCase().includes(term);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome, email ou telefone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="em_contato">Em Contato</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="recusado">Recusado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!filtered.length ? (
        <Card className="p-8 text-center text-muted-foreground border-dashed">Nenhum orçamento encontrado com estes filtros.</Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(q => <QuoteCard key={q.id} quote={q} />)}
        </div>
      )}
    </div>
  );
}

function QuoteCard({ quote }: { quote: QuoteRow }) {
  const [form, setForm] = useState(quote);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const statusColors: Record<string, string> = {
    novo: "bg-yellow-100 text-yellow-800 border-yellow-200",
    em_contato: "bg-blue-100 text-blue-800 border-blue-200",
    aprovado: "bg-green-100 text-green-800 border-green-200",
    recusado: "bg-red-100 text-red-800 border-red-200",
  };

  const save = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from("quotes")
      .update({ status: form.status, notes: form.notes })
      .eq("id", form.id);
    setIsSaving(false);
    if (error) { toast.error("Erro ao salvar."); return; }
    queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
    toast.success("Orçamento atualizado!");
  };

  const whatsappLink = form.phone ? `https://wa.me/55${form.phone.replace(/\D/g, '')}` : "";
  const mailToLink = form.email ? `mailto:${form.email}` : "";

  return (
    <Card className="relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${statusColors[form.status]?.split(' ')[0] || 'bg-gray-100'}`} />
      <CardContent className="p-5 pl-7 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
           <div className="space-y-1">
             <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-lg">{form.name}</h3>
                <Badge variant="outline" className={statusColors[form.status]}>
                  {form.status.replace("_", " ")}
                </Badge>
             </div>
             <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                {form.phone && (
                   <span className="flex items-center gap-1">
                     <Phone className="h-3 w-3" /> {form.phone}
                   </span>
                )}
                {form.email && (
                   <span className="flex items-center gap-1">
                     <Mail className="h-3 w-3" /> {form.email}
                   </span>
                )}
             </div>
             {form.service && <Badge variant="secondary" className="mt-2 text-xs">{form.service}</Badge>}
           </div>

           <div className="flex items-center gap-2 shrinking-0">
             <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
               <SelectTrigger className="w-[140px] h-8 text-sm">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="novo">Novo</SelectItem>
                 <SelectItem value="em_contato">Em Contato</SelectItem>
                 <SelectItem value="aprovado">Aprovado</SelectItem>
                 <SelectItem value="recusado">Recusado</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>

        {form.message && (
          <div className="bg-muted/50 p-3 rounded-md border border-border/50 text-sm">
            <span className="font-semibold flex items-center gap-1 mb-1 text-xs uppercase text-muted-foreground tracking-wider"><MessageSquare className="h-3 w-3"/> Mensagem</span>
            <p className="whitespace-pre-wrap">{form.message}</p>
          </div>
        )}

        <div className="pt-2 border-t space-y-3">
          <div className="space-y-1.5">
             <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1"><FileText className="h-3 w-3"/> Observações Internas</label>
             <Textarea 
               placeholder="Anotações, status da negociação, links adicionais..." 
               className="h-20 text-sm" 
               value={form.notes || ""} 
               onChange={e => setForm({ ...form, notes: e.target.value })} 
             />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
               {whatsappLink && (
                 <Button variant="outline" size="sm" asChild className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200">
                   <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Phone className="h-3.5 w-3.5 mr-1" /> WhatsApp</a>
                 </Button>
               )}
               {mailToLink && (
                 <Button variant="outline" size="sm" asChild>
                   <a href={mailToLink}><Mail className="h-3.5 w-3.5 mr-1" /> E-mail</a>
                 </Button>
               )}
               {form.file_url && (
                 <Button variant="outline" size="sm" asChild>
                   <a href={form.file_url} target="_blank" rel="noopener noreferrer"><Paperclip className="h-3.5 w-3.5 mr-1" /> Anexo</a>
                 </Button>
               )}
            </div>
            
            <Button onClick={save} size="sm" disabled={isSaving}>
              <Save className="h-3.5 w-3.5 mr-1" /> {isSaving ? "Salvando..." : "Salvar Lead"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("Erro ao fazer upload da imagem");
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    onChange(publicUrl);
    toast.success("Imagem carregada! Salve o grupo para aplicar.");
    setIsUploading(false);
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/20">
      {value ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden bg-black/5 border border-border/50">
          <img src={value} alt="Preview" className="object-contain w-full h-full" />
        </div>
      ) : (
        <div className="w-full h-32 rounded-md bg-muted border border-dashed flex flex-col items-center justify-center text-muted-foreground">
           <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
           <p className="text-sm">Nenhuma imagem definida</p>
        </div>
      )}
        <div className="flex items-center gap-4">
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={isUploading}
          className="max-w-[400px] cursor-pointer"
        />
        {isUploading && (
          <span className="flex items-center text-sm text-muted-foreground font-medium">
             <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...
          </span>
        )}
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as GalleryItemRow[];
    },
  });

  const uploadImage = async (file: File, title: string, order: number) => {
    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file);

    if (uploadError) {
      setIsUploading(false);
      toast.error("Erro ao fazer upload da imagem");
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("gallery_items")
      .insert({
        image_url: publicUrl,
        title,
        display_order: order,
        is_active: true,
      });

    setIsUploading(false);
    if (insertError) {
      toast.error("Erro ao salvar item na galeria");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery-public"] });
    toast.success("Imagem adicionada à galeria!");
  };

  const updateItem = async (item: GalleryItemRow) => {
    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: item.title,
        display_order: item.display_order,
        is_active: item.is_active,
      })
      .eq("id", item.id);

    if (error) {
      toast.error("Erro ao atualizar item");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery-public"] });
    toast.success("Item atualizado!");
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Deseja realmente excluir este item da galeria?")) return;

    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir item");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery-public"] });
    toast.success("Item excluído!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Galeria de Trabalhos</CardTitle>
        <UploadGalleryForm onUpload={uploadImage} isUploading={isUploading} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <GalleryItemCard
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Nenhum item na galeria. Adicione sua primeira imagem!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface GalleryItemRow {
  id: string;
  title: string | null;
  image_url: string;
  display_order: number | null;
  is_active: boolean | null;
}

function UploadGalleryForm({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File, title: string, order: number) => void;
  isUploading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    onUpload(file, title, order);
    setFile(null);
    setPreview(null);
    setTitle("");
    setOrder(0);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="max-w-[200px]"
        />
        <Input
          placeholder="Título (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
          className="max-w-[150px]"
        />
        <Input
          type="number"
          placeholder="Ordem"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          disabled={isUploading}
          className="max-w-[80px]"
        />
        <Button onClick={handleSubmit} disabled={!file || isUploading} size="sm">
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-1" /> Adicionar
            </>
          )}
        </Button>
      </div>
      {preview && (
        <div className="relative w-32 h-24 rounded-md overflow-hidden border">
          <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/80"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function GalleryItemCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: GalleryItemRow;
  onUpdate: (item: GalleryItemRow) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState(item);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(form);
    setIsSaving(false);
  };

  return (
    <div className="border rounded-lg p-3 space-y-3 bg-card relative">
      <button
        onClick={() => onDelete(item.id)}
        className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1 rounded"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-muted">
        <img
          src={item.image_url}
          alt={item.title || "Galeria"}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Título"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="text-sm"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Ordem"
            value={form.display_order || 0}
            onChange={(e) =>
              setForm({ ...form, display_order: Number(e.target.value) })
            }
            className="text-sm w-20"
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active || false}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="w-4 h-4 cursor-pointer"
            />
            Ativo
          </label>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="sm" className="w-full">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
