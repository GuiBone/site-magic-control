import { useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, ZoomIn } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function GallerySection() {
  const { data: items, isLoading } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-secondary/30 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </section>
    );
  }

  // Fallback: Se não houver itens ativos, não renderizar a sessão para manter UX limpa
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nosso Portfólio</h2>
          <p className="text-xl text-muted-foreground">
            Confira alguns dos nossos trabalhos mais recentes.
          </p>
        </div>

        {/* Grid Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden group cursor-pointer border-none shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setSelectedImage(item.image_url)}
            >
              <CardContent className="p-0 relative aspect-[4/3]">
                <img 
                  src={item.image_url} 
                  alt={item.title || "Galeria de trabalho"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <ZoomIn className="text-white w-8 h-8 opacity-75" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal Lightbox Native shadcn/Radix */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-screen-md w-full p-1 bg-transparent border-none shadow-none focus:outline-none">
            <VisuallyHidden>
               <DialogTitle>Visualização Ampla</DialogTitle>
               <DialogDescription>Imagem da galeria na sua resolução original.</DialogDescription>
            </VisuallyHidden>
            {selectedImage && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                 <img 
                   src={selectedImage} 
                   alt="Visualização amplicada" 
                   className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-md border border-white/10 shadow-2xl"
                 />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
