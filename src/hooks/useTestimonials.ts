import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [];

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching testimonials:", error);
        return DEFAULT_TESTIMONIALS;
      }

      return (data as Testimonial[]) || DEFAULT_TESTIMONIALS;
    },
  });
}

export function useAllTestimonials() {
  return useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching all testimonials:", error);
        return [];
      }

      return data as Testimonial[];
    },
  });
}