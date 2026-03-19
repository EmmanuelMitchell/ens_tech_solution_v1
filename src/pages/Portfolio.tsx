import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Seo from "@/components/Seo";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link?: string;
}


const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolveImage = (src: string) => {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    const base = import.meta.env.BASE_URL;
    if (src.startsWith(base)) return src;
    if (src.startsWith("/")) return `${base}${src.slice(1)}`;
    return `${base}${src}`;
  };

  useEffect(() => {
    let active = true;
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get("/api/portfolio/");
        if (!active) return;
        if (Array.isArray(data)) {
          setPortfolio(data as PortfolioItem[]);
        } else {
          setPortfolio([data as PortfolioItem]);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        if (!active) return;
        setPortfolio([]);
        setError("Failed to load portfolio. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPortfolio();
    return () => {
      active = false;
    };
  }, []);

  useScrollReveal({ deps: [loading, portfolio.length] });

  return (
    <div className="min-h-screen">
      <Seo
        title="Portfolio | Web & Mobile Projects by E&S Tech Solutions"
        description="Browse recent projects by E&S Tech Solutions—websites, mobile apps, dashboards, and digital products designed for speed, clarity, and growth."
        path="/portfolio"
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
            <h1 className="mb-6 text-white">Our Portfolio</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Explore our successful projects and see how we've helped businesses thrive
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          {loading ? (
            <Carousel opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full overflow-hidden border-white/60 bg-white/75">
                      <div className="h-48 animate-pulse bg-muted" />
                      <CardHeader>
                        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
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
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : portfolio.length === 0 ? (
            <div className="text-center text-muted-foreground">No portfolio items yet.</div>
          ) : (
            <div className="reveal" data-reveal>
              <Carousel opts={{ align: "start", loop: true }} className="relative">
                <CarouselContent>
                  {portfolio.map((item, index) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card
                        className="h-full overflow-hidden surface-glass border-white/60 ring-1 ring-white/40 hover:-translate-y-1 hover:shadow-xl transition-all"
                        style={{ transitionDelay: `${index * 40}ms` }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={resolveImage(item.image)}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                          <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/20">
                            {item.category}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{item.description}</CardDescription>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-semibold transition-colors"
                            >
                              View Project
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M7 7h10v10" />
                                <path d="M7 17 17 7" />
                              </svg>
                            </a>
                          )}
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

export default Portfolio;
