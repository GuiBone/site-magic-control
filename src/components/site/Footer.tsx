import { generateWhatsAppLink, getWhatsAppConfig } from "@/utils/whatsapp";

export function Footer({ content }: { content?: Record<string, string> }) {
  const whatsappConfig = getWhatsAppConfig(content);
  const whatsappLink = generateWhatsAppLink(whatsappConfig.number, whatsappConfig.message);

  return (
    <footer id="contact" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-['Space_Grotesk']">
              DTF ARTZONE
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Soluções criativas em impressão DTF e design personalizado.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-2">
              {["Início", "Sobre", "Serviços", "Orçamento"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace("í", "hero").replace("início", "hero")}`}
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">
              Contato
            </h4>
            <div className="text-sm opacity-60 space-y-1">
              <p>{content?.contact_phone || "(45) 99999-9999"}</p>
              <p>{content?.contact_email || "contato@dtfartzone.com.br"}</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-green-400 hover:text-green-300 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm opacity-50">
          {content?.footer_text || `© ${new Date().getFullYear()} DTF ARTZONE. Todos os direitos reservados.`}
        </div>
      </div>
    </footer>
  );
}
