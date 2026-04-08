import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";interface Props {
  content?: Record<string, string>;
}

export function HeroSection({ content }: Props) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
            {content?.hero_badge || "Bem-vindo à DTF ARTZONE"}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-blue-600 dark:text-blue-500">
            {content?.hero_title || "Impressão DTF com qualidade profissional"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            {content?.hero_subtitle || "Soluções criativas para o seu negócio"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-base px-8">
              <a href={content?.hero_cta_link || "#budget"}>
                {content?.hero_cta_text || "Solicitar Orçamento"} <ArrowRight className="ml-2 h-5 w-5" />
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
