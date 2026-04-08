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
  footer_text: "© DTF ARTZONE. Todos os direitos reservados."
};

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");
      
      if (error) {
        console.error("Supabase fetch error for site_content, using fallback:", error);
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
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });
}
