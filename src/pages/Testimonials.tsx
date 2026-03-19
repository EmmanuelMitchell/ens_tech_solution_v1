import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import { Carousel, type CarouselApi, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const resolveImage = (src: string) => {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    const base = import.meta.env.BASE_URL;
    if (src.startsWith(base)) return src;
    if (src.startsWith("/")) return `${base}${src.slice(1)}`;
    return `${base}${src}`;
  };
  const fallbackAvatar = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.get("/api/testimonials/");
        setTestimonials(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReducedMotion || autoPlayPaused) return;
    const id = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);
    return () => window.clearInterval(id);
  }, [autoPlayPaused, carouselApi]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 animate-fade-in-up text-white">Client Testimonials</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Hear what our satisfied clients have to say about working with us
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          {loading ? (
            <Carousel opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full overflow-hidden border-white/60 bg-white/75">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-muted animate-pulse mr-4" />
                          <div className="flex-1">
                            <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                            <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
                          </div>
                        </div>
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="mt-2 h-4 w-5/6 rounded bg-muted animate-pulse" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div
              onMouseEnter={() => setAutoPlayPaused(true)}
              onMouseLeave={() => setAutoPlayPaused(false)}
              onFocusCapture={() => setAutoPlayPaused(true)}
              onBlurCapture={() => setAutoPlayPaused(false)}
            >
              <Carousel setApi={setCarouselApi} opts={{ align: "start", loop: true }} className="relative">
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full surface-glass border-white/60 ring-1 ring-white/40 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center mb-4">
                            <img
                              src={resolveImage(testimonial.image)}
                              alt={testimonial.name}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.src = fallbackAvatar;
                              }}
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-bold text-lg">{testimonial.name}</h3>
                              <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                            </div>
                          </div>
                          <div className="flex mb-3">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="text-accent fill-accent" size={18} />
                            ))}
                          </div>
                          <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
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

export default Testimonials;
