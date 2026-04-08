interface Props {
  content?: Record<string, string>;
}

export function AboutSection({ content }: Props) {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">
            Quem somos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {content?.about_title || "Sobre Nós"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {content?.about_text ||
              "Somos uma empresa dedicada a oferecer soluções de alta qualidade para nossos clientes."}
          </p>
        </div>
      </div>
    </section>
  );
}
