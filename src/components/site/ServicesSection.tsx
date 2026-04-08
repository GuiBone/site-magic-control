import { Card, CardContent } from "@/components/ui/card";
import { Printer, Palette, Factory, Briefcase } from "lucide-react";
import type { Service } from "@/hooks/useContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Printer,
  Palette,
  Factory,
  Briefcase,
};

interface Props {
  content?: Record<string, string>;
  services?: Service[];
}

export function ServicesSection({ content, services }: Props) {
  const items = services ?? [];

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">
            {content?.services_subtitle || "Conheça as soluções que oferecemos"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {content?.services_title || "Nossos Serviços"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((service) => {
            const Icon = iconMap[service.icon || ""] || Briefcase;
            return (
              <Card
                key={service.id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 overflow-hidden"
              >
                {service.image_url && (
                  <div className="w-full h-48 bg-muted">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-8 text-center space-y-4">
                  {!service.image_url && (
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
