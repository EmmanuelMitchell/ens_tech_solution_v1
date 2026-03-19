import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CircuitBoard, Layers, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Seo from "@/components/Seo";

const About = () => {
  const publicImage = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

  const values = [
    {
      image: "mission.jpg",
      title: "Mission",
      description: "To empower businesses with cutting-edge technology solutions that drive growth and innovation.",
    },
    {
      image: "vision.png",
      title: "Vision",
      description: "To be the leading tech partner for businesses seeking digital transformation and excellence.",
    },
    {
      image: "excellence.jpeg",
      title: "Excellence",
      description: "We are committed to delivering the highest quality in every project we undertake.",
    },
    {
      image: "customer.jpg",
      title: "Client-Focused",
      description: "Your success is our priority. We build lasting partnerships through exceptional service.",
    },
  ];

  useScrollReveal();

  return (
    <div className="min-h-screen">
      <Seo
        title="About E&S Tech Solutions | Trusted Digital Partner"
        description="Learn about E&S Tech Solutions—our mission, vision, and the team behind premium web development, mobile apps, and custom software delivery."
        path="/about"
      />
      <Navbar />
      <WhatsAppButton />

      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 text-white">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-circuit opacity-70 animate-circuit-pan" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="absolute top-28 right-10 h-28 w-28 rounded-2xl bg-accent/15 ring-1 ring-accent/25 blur-xl animate-float" style={{ animationDelay: "0.8s" }} />
          <div className="absolute bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 blur-2xl animate-float" style={{ animationDelay: "1.4s" }} />
          <CircuitBoard className="absolute left-10 top-32 text-white/15 animate-float" size={40} style={{ animationDelay: "0.2s" }} />
          <Layers className="absolute right-16 bottom-16 text-white/12 animate-float" size={44} style={{ animationDelay: "1s" }} />
          <Sparkles className="absolute right-28 top-44 text-white/10 animate-float" size={38} style={{ animationDelay: "1.8s" }} />
        </div>

        <div className="container mx-auto text-center relative">
          <div className="reveal" data-reveal>
            <h1 className="mb-6 text-white">About E&S Tech Solution</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Your trusted partner in digital transformation and technology innovation
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 items-center">
            <div className="reveal lg:col-span-5" data-reveal>
              <h2 className="mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Founded with a passion for innovation, E&S Tech Solution has grown from a small startup
                  to a trusted technology partner for businesses worldwide.
                </p>
                <p>
                  We specialize in creating custom software solutions, web applications, mobile apps,
                  and enterprise systems that help our clients stay competitive in the digital age.
                </p>
                <p>
                  Our team of expert developers, designers, and strategists work collaboratively to
                  deliver solutions that not only meet but exceed expectations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 reveal lg:col-span-7" data-reveal>
              <div className="w-full bg-gradient-accent rounded-2xl shadow-custom-lg overflow-hidden aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src={publicImage("Samuel_Power.jpeg")}
                  alt="Samuel"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="w-full bg-gradient-accent rounded-2xl shadow-custom-lg overflow-hidden aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src={publicImage("emmanuel.jpg")}
                  alt="Emmanuel"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="w-full bg-gradient-accent rounded-2xl shadow-custom-lg overflow-hidden aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src={publicImage("timothy.jpeg")}
                  alt="Timothy"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal" data-reveal>
            <h2 className="mb-4 text-white">Our Core Values</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="reveal surface-glass border-white/60 ring-1 ring-white/40 p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all"
                style={{ transitionDelay: `${index * 60}ms` }}
                data-reveal
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-accent">
                  <img 
                    src={publicImage(value.image)}
                    alt={value.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="reveal" data-reveal>
            <h2 className="mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              A talented group of professionals dedicated to your success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="reveal surface-glass border-white/60 ring-1 ring-white/40 p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all" data-reveal>
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-accent">
                <img 
                  src={publicImage("Samuel_Power.jpeg")}
                  alt="Samuel" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">Samuel</h3>
              {/* <p className="text-accent font-medium mb-2">Co-Founder & CEO</p> */}
              <p className="text-sm text-muted-foreground">
                Expert in delivering exceptional solutions and leading innovative projects
              </p>
            </div>
            <div className="reveal surface-glass border-white/60 ring-1 ring-white/40 p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all" style={{ transitionDelay: "60ms" }} data-reveal>
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-accent">
                <img 
                  src={publicImage("emmanuel.jpg")}
                  alt="Emmanuel" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">Emmanuel</h3>
              {/* <p className="text-accent font-medium mb-2">Co-Founder & CTO</p> */}
              <p className="text-sm text-muted-foreground">
                Technology visionary driving cutting-edge development and innovation
              </p>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;
