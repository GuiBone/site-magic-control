import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CMSField {
  id: string;
  key: string;
  label: string;
  value: string;
  section: string;
  field_type: string;
}

export const DEFAULT_CONTENT_FALLBACK: Record<string, string> = {
  hero_background_image: "/images/hero-default.jpg",
  hero_badge: "Bem-vindo à DTF ARTZONE",
  hero_title: "Impressão DTF com qualidade profissional",
  hero_subtitle: "Produzimos impressões e adesivos personalizados com acabamento premium e atendimento ágil.",
  hero_cta_text: "Solicitar orçamento",
  hero_cta_link: "https://wa.me/5500000000000",
  about_title: "Sobre a DTF ARTZONE",
  about_text: "Somos especialistas em impressão personalizada, focados em qualidade, agilidade e acabamento premium para sua marca ou projeto.",
  services_title: "Nossos Serviços",
  services_subtitle: "Conheça as soluções que oferecemos para transformar suas ideias em materiais de alto impacto.",
  contact_title: "Fale com a nossa equipe",
  contact_subtitle: "Solicite um orçamento e receba atendimento rápido pelo WhatsApp.",
  contact_phone: "(45) 99999-9999",
  contact_email: "contato@dtfartzone.com.br",
  footer_text: "© DTF ARTZONE. Todos os direitos reservados.",
  whatsapp_number: "5545999999999",
  whatsapp_message: "Olá! Vim pelo site e gostaria de solicitar um orçamento.",
  whatsapp_label: "Fale conosco",
  whatsapp_cta_text: "Solicitar orçamento pelo WhatsApp",
  seo_title: "DTF ARTZONE",
  seo_description: "Impressão DTF com qualidade profissional, adesivos personalizados e atendimento ágil.",
  seo_keywords: "dtf, impressão dtf, adesivos personalizados, gráfica dtf",
  seo_og_image: "",
  seo_favicon: ""
};

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

const DEFAULT_SERVICES_FALLBACK: Service[] = [
  { id: "s1", title: "Impressão DTF Premium", description: "Maior vivacidade de cores e durabilidade superior para estampas em algodão, poliéster e mais. Alta definição para logos e ilustrações complexas.", icon: "Printer", image_url: null, display_order: 10, is_active: true },
  { id: "s2", title: "Adesivos Personalizados", description: "Adesivos vibrantes e resistentes, perfeitos para branding, brindes corporativos e sinalização. Recorte exclusivo para o seu design.", icon: "Palette", image_url: null, display_order: 20, is_active: true },
  { id: "s3", title: "Design para Marcas", description: "Garantimos que sua marca se destaque no mercado criando desde a concepção do logotipo à aplicação na estamparia e mídias visuais.", icon: "Briefcase", image_url: null, display_order: 30, is_active: true },
];

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");
      
      if (error) {
        console.error("Supabase fetch error for site_content:", error);
        return DEFAULT_CONTENT_FALLBACK;
      }
      
      const map: Record<string, string> = { ...DEFAULT_CONTENT_FALLBACK };
      if (data && data.length > 0) {
        ((data as unknown) as CMSField[]).forEach((item) => {
          if (item.value !== null && item.value !== undefined) {
             map[item.key] = item.value;
          }
        });
      }
      return map;
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
        
      if (error) {
        console.error("Erro ao buscar serviços:", error);
        return DEFAULT_SERVICES_FALLBACK;
      }
      
      if (!data || data.length === 0) return DEFAULT_SERVICES_FALLBACK;
      
      return data as Service[];
    },
  });
}
