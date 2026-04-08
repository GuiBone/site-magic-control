import { Header } from "@/components/site/Header";
import { HeroSection } from "@/components/site/HeroSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { BudgetForm } from "@/components/site/BudgetForm";
import { Footer } from "@/components/site/Footer";
import { useSiteContent, useServices } from "@/hooks/useContent";

const Index = () => {
  const { data: content } = useSiteContent();
  const { data: services } = useServices();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection content={content} />
      <AboutSection content={content} />
      <ServicesSection content={content} services={services} />
      <BudgetForm content={content} services={services} />
      <Footer content={content} />
    </div>
  );
};

export default Index;
