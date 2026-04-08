import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/hooks/useContent";

interface Props {
  content?: SiteContent;
}

export function HeroSection({ content }: Props) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Bem-vindo à DTF ARTZONE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            {content?.title || "DTF ARTZONE"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            {content?.subtitle || "Soluções criativas para o seu negócio"}
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            {content?.content || "Transformamos suas ideias em realidade com qualidade e profissionalismo."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-base px-8">
              <a href="#budget">
                Solicitar Orçamento <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <a href="#services">Nossos Serviços</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
