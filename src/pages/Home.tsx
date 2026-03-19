import { api } from "@/lib/api";
import type { ChangeEvent, ComponentType, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  ArrowRight,
  BadgeCheck,
  CircuitBoard,
  CreditCard,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  Layers,
  Mail,
  MapPin,
  MessageSquareQuote,
  Palette,
  Phone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Twitter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, type CarouselApi, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Seo from "@/components/Seo";

type HomeSection = "about" | "services" | "portfolio" | "testimonials" | "contact";

type HomeProps = {
  initialSection?: HomeSection;
};

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link?: string;
};

type Testimonial = {
  id: number;
  name: string;
  company: string;
  content: string;
  rating: number;
  image: string;
};

const iconMap: Record<string, ComponentType<{ className?: string; size?: string | number }>> = {
  globe: Globe,
  smartphone: Smartphone,
  "id-card": CreditCard,
  "file-text": FileText,
  "badge-check": BadgeCheck,
  palette: Palette,
};

const sectionIds: Record<HomeSection, string> = {
  about: "about",
  services: "services",
  portfolio: "portfolio",
  testimonials: "testimonials",
  contact: "contact",
};

const Home = ({ initialSection }: HomeProps) => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [testimonialsCarouselApi, setTestimonialsCarouselApi] = useState<CarouselApi | null>(null);
  const [testimonialsAutoPlayPaused, setTestimonialsAutoPlayPaused] = useState(false);
  const [portfolioCategory, setPortfolioCategory] = useState<string>("All");
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);

  const fetchedRef = useRef(false);

  const whyCards = useMemo(
    () => [
      {
        icon: Sparkles,
        title: "Premium Execution",
        description: "Clean UI, modern UX, and careful details that make your brand feel bigger.",
      },
      {
        icon: Rocket,
        title: "Fast Delivery",
        description: "A smooth workflow with clear milestones and reliable turnaround.",
      },
      {
        icon: ShieldCheck,
        title: "Secure & Reliable",
        description: "Strong fundamentals: performance, best practices, and dependable builds.",
      },
      {
        icon: Layers,
        title: "Scalable Systems",
        description: "Designed to grow with you: new features, new pages, new audiences.",
      },
    ],
    [],
  );

  const portfolioCategories = useMemo(() => {
    const categories = Array.from(new Set(portfolio.map((item) => item.category))).filter(Boolean);
    categories.sort((a, b) => a.localeCompare(b));
    return ["All", ...categories];
  }, [portfolio]);

  const portfolioCounts = useMemo(() => {
    const counts: Record<string, number> = { All: portfolio.length };
    portfolio.forEach((item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    });
    return counts;
  }, [portfolio]);

  const portfolioFiltered = useMemo(() => {
    if (portfolioCategory === "All") return portfolio;
    return portfolio.filter((item) => item.category === portfolioCategory);
  }, [portfolio, portfolioCategory]);

  const visiblePortfolio = useMemo(() => {
    return portfolioExpanded ? portfolioFiltered : portfolioFiltered.slice(0, 6);
  }, [portfolioExpanded, portfolioFiltered]);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        rafId = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    let active = true;

    const load = async () => {
      setDataLoading(true);
      setDataError(null);
      try {
        const [servicesData, portfolioData, testimonialsData] = await Promise.all([
          api.get("/api/services/"),
          api.get("/api/portfolio/"),
          api.get("/api/testimonials/"),
        ]);
        if (!active) return;
        setServices(Array.isArray(servicesData) ? (servicesData as Service[]) : []);
        setPortfolio(Array.isArray(portfolioData) ? (portfolioData as PortfolioItem[]) : []);
        setTestimonials(Array.isArray(testimonialsData) ? (testimonialsData as Testimonial[]) : []);
      } catch {
        if (!active) return;
        setServices([]);
        setPortfolio([]);
        setTestimonials([]);
        setDataError("Failed to load content. Please try again.");
        toast({ title: "Failed to load content", variant: "destructive" });
      } finally {
        if (active) setDataLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  useScrollReveal({
    deps: [dataLoading, services.length, portfolio.length, testimonials.length, portfolioCategory, portfolioExpanded, initialSection],
  });

  useEffect(() => {
    if (!testimonialsCarouselApi) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReducedMotion || testimonialsAutoPlayPaused) return;
    const id = window.setInterval(() => {
      testimonialsCarouselApi.scrollNext();
    }, 4000);
    return () => window.clearInterval(id);
  }, [testimonialsAutoPlayPaused, testimonialsCarouselApi]);

  useEffect(() => {
    setPortfolioExpanded(false);
  }, [portfolioCategory]);

  useEffect(() => {
    if (!initialSection) return;
    const id = sectionIds[initialSection];
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [initialSection]);

  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await api.post("/api/contact", contactForm);
      toast({
        title: "Message sent",
        description: "Thanks for reaching out. We’ll get back to you shortly.",
      });
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setContactLoading(false);
    }
  };

  const resolveImage = (src: string) => {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    const base = import.meta.env.BASE_URL;
    if (src.startsWith(base)) return src;
    if (src.startsWith("/")) return `${base}${src.slice(1)}`;
    return `${base}${src}`;
  };
  const fallbackAvatar = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  return (
    <div className="min-h-screen">
      <Seo
        title="E&S Tech Solutions | Web Development, Mobile Apps & Branding"
        description="E&S Tech Solutions builds modern websites, mobile apps, and custom software for growing businesses. Fast performance, clean UI/UX, and conversion-focused delivery."
        path="/"
      />
      <Navbar />
      <WhatsAppButton />

      <main>
      <section className="relative overflow-hidden text-white pt-28 md:pt-32 pb-20">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-circuit opacity-70 animate-circuit-pan" style={{ transform: `translateY(${scrollY * 0.06}px)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm text-white/85 animate-fade-in-up">
              <CircuitBoard size={16} className="text-accent" />
              Modern web, mobile, and branding for ambitious businesses
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight animate-fade-in-up" style={{ animationDelay: "120ms" }}>
              Innovate. Create. Elevate.
            </h1>

            <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed animate-fade-in-up" style={{ animationDelay: "240ms" }}>
              E&S Tech Solutions designs and builds premium digital experiences—fast, clean, and scalable—so your brand looks sharper and grows faster.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "360ms" }}>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all"
                >
                  Get a Free Quote <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 transition-colors"
                >
                  View Projects
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-white/75 animate-fade-in-up" style={{ animationDelay: "480ms" }}>
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="text-accent" size={16} />
                Trusted builds
              </div>
              <div className="inline-flex items-center gap-2">
                <Rocket className="text-accent" size={16} />
                Fast turnaround
              </div>
              <div className="inline-flex items-center gap-2">
                <Sparkles className="text-accent" size={16} />
                Premium design
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-10 hidden lg:block">
            <div className="relative w-[520px] h-[520px]">
              <div className="absolute right-6 top-14 h-40 w-40 rounded-3xl bg-white/8 ring-1 ring-white/15 surface-glass animate-float" />
              <div className="absolute right-44 top-40 h-28 w-28 rounded-2xl bg-accent/15 ring-1 ring-accent/30 animate-float" style={{ animationDelay: "900ms" }} />
              <div className="absolute right-20 top-64 h-52 w-52 rounded-[2.2rem] bg-white/6 ring-1 ring-white/10 surface-glass animate-float" style={{ animationDelay: "450ms" }} />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="reveal" data-reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
                <Sparkles size={16} className="text-accent" />
                About E&S Tech Solutions
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">
                A modern tech partner that builds with clarity and confidence.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                We help businesses launch, improve, and scale through premium websites, mobile applications, and strong brand identity. Our work is designed to look professional, load fast, and convert visitors into customers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm text-primary ring-1 ring-accent/20">
                  Clean UI/UX
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm text-primary ring-1 ring-accent/20">
                  Fast performance
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm text-primary ring-1 ring-accent/20">
                  Mobile-first
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm text-primary ring-1 ring-accent/20">
                  Modern branding
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 reveal" data-reveal>
              <Card className="overflow-hidden border-white/40 bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <Rocket className="text-accent" size={20} />
                    </div>
                    <div className="font-semibold">Fast Delivery</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Quick iteration with a clean, professional finish.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-white/40 bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <ShieldCheck className="text-accent" size={20} />
                    </div>
                    <div className="font-semibold">Trusted Quality</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Best practices that keep your product stable and secure.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-white/40 bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <CircuitBoard className="text-accent" size={20} />
                    </div>
                    <div className="font-semibold">Modern Stack</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Up-to-date tooling for speed, maintainability, and UX.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-white/40 bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <Palette className="text-accent" size={20} />
                    </div>
                    <div className="font-semibold">Brand Clarity</div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Visual identity that looks premium across every channel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 reveal" data-reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
                <Sparkles size={16} className="text-accent" />
                Our Services
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">Built for growth and credibility.</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                From product design to launch-ready websites, mobile apps, and branding—everything is crafted to look professional and perform flawlessly.
              </p>
            </div>
            <Link to="/contact">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all">
                Request a Proposal
              </Button>
            </Link>
          </div>

          <div className="mt-12 reveal" data-reveal>
            <Carousel opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {services.map((service) => {
                  const Icon = iconMap[service.icon] ?? Globe;
                  return (
                    <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full border-white/60 bg-white/75 backdrop-blur-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                        <CardContent className="p-7">
                          <div className="h-12 w-12 rounded-2xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                            <Icon className="text-accent" size={22} />
                          </div>
                          <div className="mt-5 text-xl font-semibold">{service.title}</div>
                          <p className="mt-3 text-muted-foreground leading-relaxed">{service.description}</p>
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
        </div>
      </section>

      <section id="portfolio" className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="reveal" data-reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
              <Rocket size={16} className="text-accent" />
              Portfolio / Projects
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">Work that looks premium and performs fast.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              A selection of recent work across web, mobile, and digital branding.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 reveal" data-reveal>
            {portfolioCategories.map((category) => {
              const active = category === portfolioCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setPortfolioCategory(category)}
                  className={[
                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
                    active
                      ? "bg-primary text-primary-foreground ring-primary/20"
                      : "bg-white/70 text-primary ring-black/5 hover:bg-white",
                  ].join(" ")}
                >
                  <span>{category}</span>
                  <span className={active ? "ml-2 text-xs text-white/75" : "ml-2 text-xs text-muted-foreground"}>
                    {portfolioCounts[category] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 reveal" data-reveal>
            <Carousel opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {dataLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full overflow-hidden border-white/60 bg-white/75">
                          <div className="h-48 animate-pulse bg-muted" />
                          <CardContent className="p-6">
                            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                            <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
                            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))
                  : visiblePortfolio.map((item) => (
                      <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full group overflow-hidden border-white/60 bg-white/75 hover:-translate-y-1 hover:shadow-xl transition-all">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={resolveImage(item.image)}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                            <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/20">
                              {item.category}
                            </div>
                            <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                              <div className="text-white font-semibold">{item.title}</div>
                              <div className="mt-1 text-sm text-white/80">{item.description}</div>
                              {item.link ? (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex items-center text-sm font-medium text-white hover:text-white/85"
                                >
                                  View Project <ArrowRight className="ml-2" size={16} />
                                </a>
                              ) : null}
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="text-lg font-semibold">{item.title}</div>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                              >
                                View Project <ArrowRight className="ml-2" size={16} />
                              </a>
                            ) : null}
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              {!dataLoading ? (
                <>
                  <CarouselPrevious className="hidden md:flex -left-4 border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
                  <CarouselNext className="hidden md:flex -right-4 border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
                  <CarouselDots />
                </>
              ) : null}
            </Carousel>
          </div>

          {!dataLoading && !dataError && portfolioFiltered.length === 0 ? (
            <div className="mt-10 text-center text-muted-foreground reveal" data-reveal>
              No portfolio items yet.
            </div>
          ) : null}

          {dataError ? (
            <div className="mt-10 text-center text-destructive reveal" data-reveal>
              {dataError}
            </div>
          ) : null}

          {portfolioFiltered.length > 6 ? (
            <div className="mt-10 flex justify-center reveal" data-reveal>
              <Button
                type="button"
                variant="outline"
                className="border-primary/15 bg-primary/5 text-primary hover:bg-primary/10"
                onClick={() => setPortfolioExpanded((v) => !v)}
              >
                {portfolioExpanded ? "Show less" : "Show more"}
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="reveal" data-reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
              <ShieldCheck size={16} className="text-accent" />
              Why Choose Us
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">Trusted, modern, and built for scale.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              A premium look is only the start—our builds are optimized, maintainable, and designed to convert.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c) => (
              <Card key={c.title} className="reveal border-white/60 bg-white/75 hover:-translate-y-1 hover:shadow-xl transition-all" data-reveal>
                <CardContent className="p-7">
                  <div className="h-12 w-12 rounded-2xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                    <c.icon className="text-accent" size={22} />
                  </div>
                  <div className="mt-5 text-lg font-semibold">{c.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="reveal" data-reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
              <MessageSquareQuote size={16} className="text-accent" />
              Testimonials
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">Clients love the clarity and quality.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Real feedback from real projects—focused on delivery, design, and results.
            </p>
          </div>

          <div className="mt-12 reveal" data-reveal>
            <div
              onMouseEnter={() => setTestimonialsAutoPlayPaused(true)}
              onMouseLeave={() => setTestimonialsAutoPlayPaused(false)}
              onFocusCapture={() => setTestimonialsAutoPlayPaused(true)}
              onBlurCapture={() => setTestimonialsAutoPlayPaused(false)}
            >
              <Carousel setApi={setTestimonialsCarouselApi} opts={{ align: "start", loop: true }} className="relative">
              <CarouselContent>
                {testimonials.map((t) => (
                  <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border-white/60 bg-white/75 hover:shadow-xl transition-shadow">
                      <CardContent className="p-7">
                        <div className="flex items-center gap-4">
                          <img
                            src={resolveImage(t.image)}
                            alt={t.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/25"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.src = fallbackAvatar;
                            }}
                          />
                          <div>
                            <div className="font-semibold">{t.name}</div>
                            <div className="text-sm text-muted-foreground">{t.company}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-accent fill-accent" />
                          ))}
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">“{t.content}”</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
              <CarouselNext className="hidden md:flex border-primary/15 bg-primary/5 text-primary hover:bg-primary/10" />
              <CarouselDots />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="reveal" data-reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
                <Sparkles size={16} className="text-accent" />
                Contact
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">Let’s build something great.</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Tell us what you’re building. We’ll reply quickly with next steps and a clear plan.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="flex items-start gap-3 rounded-2xl bg-white/70 ring-1 ring-black/5 p-5">
                  <div className="h-10 w-10 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                    <Rocket className="text-accent" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold">Fast response</div>
                    <div className="text-sm text-muted-foreground">We typically reply within 24 hours.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/70 ring-1 ring-black/5 p-5">
                  <div className="h-10 w-10 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                    <ShieldCheck className="text-accent" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold">Clear scope</div>
                    <div className="text-sm text-muted-foreground">We help you define requirements before building.</div>
                  </div>
                </div>
                <div className="grid gap-3 rounded-2xl bg-white/70 ring-1 ring-black/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <Mail className="text-accent" size={18} />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <a href="mailto:enstechsolution@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        enstechsolution@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <Phone className="text-accent" size={18} />
                    </div>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <a href="tel:+23276427304" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        +232 76427304 / 75715080
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 ring-1 ring-accent/25 flex items-center justify-center">
                      <MapPin className="text-accent" size={18} />
                    </div>
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-sm text-muted-foreground">Sierra Leone, Freetown</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="#"
                      aria-label="Facebook"
                      className="h-10 w-10 rounded-xl bg-white/60 ring-1 ring-black/5 flex items-center justify-center hover:bg-accent/15 hover:ring-accent/25 transition-all"
                    >
                      <Facebook size={18} className="text-primary" />
                    </a>
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="h-10 w-10 rounded-xl bg-white/60 ring-1 ring-black/5 flex items-center justify-center hover:bg-accent/15 hover:ring-accent/25 transition-all"
                    >
                      <Twitter size={18} className="text-primary" />
                    </a>
                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="h-10 w-10 rounded-xl bg-white/60 ring-1 ring-black/5 flex items-center justify-center hover:bg-accent/15 hover:ring-accent/25 transition-all"
                    >
                      <Linkedin size={18} className="text-primary" />
                    </a>
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="h-10 w-10 rounded-xl bg-white/60 ring-1 ring-black/5 flex items-center justify-center hover:bg-accent/15 hover:ring-accent/25 transition-all"
                    >
                      <Instagram size={18} className="text-primary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Card className="reveal border-white/60 bg-white/75 backdrop-blur-lg" data-reveal>
              <CardContent className="p-7">
                <h3 className="text-xl font-semibold">Send us a message</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share a few details and we’ll get back to you.
                </p>

                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      name="name"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="focus:ring-2 focus:ring-accent transition-all"
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      name="phone"
                      placeholder="Phone (optional)"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className="focus:ring-2 focus:ring-accent transition-all"
                    />
                    <Input
                      name="subject"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      className="focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={5}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={contactLoading}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all"
                  >
                    {contactLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="reveal rounded-3xl overflow-hidden border border-white/50" data-reveal>
            <div className="relative gradient-hero">
              <div className="absolute inset-0 bg-circuit opacity-55 animate-circuit-pan" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/15 to-black/35" />
              <div className="relative p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-white">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm text-white/85">
                    <Sparkles size={16} className="text-accent" />
                    Ready to start?
                  </div>
                  <div className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
                    Turn your idea into a professional digital product.
                  </div>
                  <div className="mt-3 text-white/80">
                    Websites, mobile apps, flyers, business cards, logos, and full branding—built to convert.
                  </div>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all">
                    Start a Project <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;
