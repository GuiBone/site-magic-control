import { Star } from "lucide-react";
import type { Testimonial } from "@/hooks/useTestimonials";

interface Props {
  testimonials?: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function AvatarFallback({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
      <span className="text-lg font-semibold text-primary">{initial}</span>
    </div>
  );
}

export function TestimonialsSection({ testimonials }: Props) {
  const items = testimonials ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">
            O que dizem nossos clientes
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Depoimentos
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-background rounded-xl p-6 border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback name={testimonial.name} />
                )}
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && " - "}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}