import { Header } from "@/components/site/Header";
import { HeroSection } from "@/components/site/HeroSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { GallerySection } from "@/components/site/GallerySection";
import { BudgetForm } from "@/components/site/BudgetForm";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloatButton } from "@/components/site/WhatsAppFloatButton";
import { useSiteContent, useServices } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useTestimonials } from "@/hooks/useTestimonials";

const Index = () => {
  const { data: content } = useSiteContent();
  const { data: services } = useServices();
  const { data: testimonials } = useTestimonials();

  useSEO(content);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection content={content} />
      <AboutSection content={content} />
      <ServicesSection content={content} services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <GallerySection />
      <BudgetForm content={content} services={services} />
      <Footer content={content} />
      <WhatsAppFloatButton content={content} />
    </div>
  );
};

export default Index;
