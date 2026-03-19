import { api } from "@/lib/api";
import { useEffect, useState, type ComponentType } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Cloud, Code, CreditCard, Database, FileText, Globe, Palette, Shield, Smartphone } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Seo from "@/components/Seo";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, ComponentType<{ className?: string; size?: string | number }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  "id-card": CreditCard,
  "file-text": FileText,
  "badge-check": BadgeCheck,
  palette: Palette,
};


const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get("/api/services/");
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useScrollReveal({ deps: [loading, services.length] });

  return (
    <div className="min-h-screen">
      <Seo
        title="Services | Web Development, Mobile Apps & IT Solutions"
        description="Explore E&S Tech Solutions services: web development, mobile applications, custom software, cloud solutions, branding, and secure IT systems built to scale."
        path="/services"
      />
      <Navbar />
      <WhatsAppButton />

      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 text-white">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-circuit opacity-70 animate-circuit-pan" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

        <div className="container mx-auto text-center relative">
          <div className="reveal" data-reveal>
            <h1 className="mb-6 text-white">Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          {loading ? (
            <Carousel opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full overflow-hidden border-white/60 bg-white/75">
                      <CardHeader>
                        <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                          <div className="h-7 w-7 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="reveal" data-reveal>
              <Carousel opts={{ align: "start", loop: true }} className="relative">
                <CarouselContent>
                  {services.map((service) => {
                    const IconComponent = iconMap[service.icon] || Code;
                    return (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full surface-glass border-white/60 ring-1 ring-white/40 hover:-translate-y-1 hover:shadow-xl transition-all">
                          <CardHeader>
                            <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                              <IconComponent className="text-accent" size={28} />
                            </div>
                            <CardTitle className="text-2xl">{service.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-base">{service.description}</CardDescription>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
                <CarouselNext className="hidden md:flex -right-4 border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
                <CarouselDots />
              </Carousel>
            </div>
          )}
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Services;
