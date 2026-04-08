import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { generateWhatsAppLink, getWhatsAppConfig } from "@/utils/whatsapp";

interface Props {
  content?: Record<string, string>;
}

export function HeroSection({ content }: Props) {
  const whatsappConfig = getWhatsAppConfig(content);
  const whatsappLink = generateWhatsAppLink(
    whatsappConfig.number,
    whatsappConfig.message
  );

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${content?.hero_background_image || '/images/hero-default.jpg'})` }}
      />
      <div className="absolute inset-0 z-0 bg-background/85 md:bg-background/90 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      
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
              <a href={whatsappLink}>
                {whatsappConfig.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
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
