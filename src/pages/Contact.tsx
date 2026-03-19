import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { api } from "@/lib/api"; 
import Seo from "@/components/Seo";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/contact", formData);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo
        title="Contact E&S Tech Solutions | Start Your Project"
        description="Contact E&S Tech Solutions to discuss web development, mobile apps, branding, or custom software. Get a fast response and a clear proposal."
        path="/contact"
      />
      <Navbar />
      <WhatsAppButton />

      <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 animate-fade-in-up text-white">Get in Touch</h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Have a project in mind? Let's discuss how we can help you achieve your goals
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-slide-in-left">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-white">Contact Information</h2>
                <p className="text-lg text-white text-muted-foreground mb-8">
                  Reach out to us through any of these channels, and we'll respond promptly.
                </p>
              </div>

              <div className="space-y-6 text-white">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <a href="mailto:enstechsolution@gmail.com" className="text-muted-foreground text-white hover:text-primary transition-colors">
                      enstechsolution@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <a href="tel:+23276427304" className="text-muted-foreground text-white hover:text-primary transition-colors">
                      +232 76427304 / 75715080
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Address</h3>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Sierra%20Leone%20Freetown"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground text-white hover:text-primary transition-colors"
                    >
                      Sierra Leone, Freetown
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="surface-glass border-white/60 ring-1 ring-white/40 p-8 rounded-2xl shadow-custom-lg animate-slide-in-right">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;
