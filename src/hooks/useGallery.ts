import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  display_order: number | null;
  is_active: boolean | null;
}

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Gallery Error:", error);
        return [];
      }

      return data as GalleryItem[];
    },
  });
};
